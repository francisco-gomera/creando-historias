import { prisma } from "../lib/prisma";

export interface MonetizationSettings {
  platformSharePercentage: number;
  authorSharePercentage: number;
  rpmEstimate: number;
}

export interface AuthorMonthlyBreakdown {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  articlesCount: number;
  monthlyViews: number;
  grossRevenue: number;
  authorSharePct: number;
  platformSharePct: number;
  authorShareAmount: number;
  platformShareAmount: number;
  isCustomShare: boolean;
  status: "CALCULATED" | "SETTLED";
}

export type RevenueFilterType = "today" | "week" | "month" | "year" | "all" | "custom";

export interface MonthlyRevenueReport {
  year: number;
  month: number;
  monthName: string;
  filterType: RevenueFilterType;
  filterLabel: string;
  startDate?: Date;
  endDate?: Date;
  
  // Filtered period metrics
  totalViews: number;
  grossEstimatedRevenue: number;
  totalAuthorShareAmount: number;
  totalPlatformShareAmount: number;

  // Today metrics
  todayViews: number;
  todayGrossRevenue: number;
  todayAuthorShareAmount: number;
  todayPlatformShareAmount: number;

  // Current month metrics
  currentMonthViews: number;
  currentMonthGrossRevenue: number;
  currentMonthAuthorShareAmount: number;
  currentMonthPlatformShareAmount: number;

  authorsCount: number;
  isCurrentMonth: boolean;
  rpmEstimate: number;
  authors: AuthorMonthlyBreakdown[];
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export async function getMonetizationSettings(): Promise<MonetizationSettings> {
  const platformSetting = await prisma.platformSetting.findUnique({
    where: { key: "platformSharePercentage" },
  });

  const authorSetting = await prisma.platformSetting.findUnique({
    where: { key: "authorSharePercentage" },
  });

  const rpmSetting = await prisma.platformSetting.findUnique({
    where: { key: "rpmEstimate" },
  });

  return {
    platformSharePercentage: platformSetting ? parseFloat(platformSetting.value) : 30,
    authorSharePercentage: authorSetting ? parseFloat(authorSetting.value) : 70,
    rpmEstimate: rpmSetting ? parseFloat(rpmSetting.value) : 4.50,
  };
}

export async function updateMonetizationSettings(settings: Partial<MonetizationSettings>) {
  if (settings.platformSharePercentage !== undefined) {
    await prisma.platformSetting.upsert({
      where: { key: "platformSharePercentage" },
      update: { value: settings.platformSharePercentage.toString() },
      create: { key: "platformSharePercentage", value: settings.platformSharePercentage.toString() },
    });
  }

  if (settings.authorSharePercentage !== undefined) {
    await prisma.platformSetting.upsert({
      where: { key: "authorSharePercentage" },
      update: { value: settings.authorSharePercentage.toString() },
      create: { key: "authorSharePercentage", value: settings.authorSharePercentage.toString() },
    });
  }

  if (settings.rpmEstimate !== undefined) {
    await prisma.platformSetting.upsert({
      where: { key: "rpmEstimate" },
      update: { value: settings.rpmEstimate.toString() },
      create: { key: "rpmEstimate", value: settings.rpmEstimate.toString() },
    });
  }
}

export function getDateRangeForFilter(
  filter: RevenueFilterType = "month",
  options?: { year?: number; month?: number; startDate?: string; endDate?: string }
): { startDate?: Date; endDate?: Date; label: string } {
  const now = new Date();

  if (filter === "today") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { startDate: start, endDate: end, label: "Hoy" };
  }

  if (filter === "week") {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { startDate: start, endDate: end, label: "Últimos 7 Días" };
  }

  if (filter === "year") {
    const y = options?.year || now.getFullYear();
    const start = new Date(y, 0, 1, 0, 0, 0, 0);
    const end = new Date(y, 11, 31, 23, 59, 59, 999);
    return { startDate: start, endDate: end, label: `Año ${y}` };
  }

  if (filter === "all") {
    return { label: "Desde el Inicio" };
  }

  if (filter === "custom" && options?.startDate) {
    const start = new Date(options.startDate);
    start.setHours(0, 0, 0, 0);
    const end = options.endDate ? new Date(options.endDate) : new Date();
    end.setHours(23, 59, 59, 999);
    const startStr = start.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
    const endStr = end.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
    return { startDate: start, endDate: end, label: `${startStr} - ${endStr}` };
  }

  // Default to month
  const targetYear = options?.year || now.getFullYear();
  const targetMonth = options?.month || (now.getMonth() + 1);
  const start = new Date(targetYear, targetMonth - 1, 1, 0, 0, 0, 0);
  const end = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);
  const monthName = MONTH_NAMES[targetMonth - 1];
  return { startDate: start, endDate: end, label: `${monthName} ${targetYear}` };
}

/**
 * Generates a detailed revenue report with per-user breakdown and date filtering.
 */
export async function getMonthlyRevenueReport(
  year?: number,
  month?: number,
  rpmOverride?: number,
  filterType: RevenueFilterType = "month",
  customStartDate?: string,
  customEndDate?: string
): Promise<MonthlyRevenueReport> {
  const defaultSettings = await getMonetizationSettings();
  const effectiveRpm = rpmOverride !== undefined && !isNaN(rpmOverride) ? rpmOverride : defaultSettings.rpmEstimate;

  const now = new Date();
  const targetYear = year || now.getFullYear();
  const targetMonth = month || (now.getMonth() + 1);

  // Date ranges
  const dateRange = getDateRangeForFilter(filterType, {
    year: targetYear,
    month: targetMonth,
    startDate: customStartDate,
    endDate: customEndDate,
  });

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const isCurrentMonth = targetYear === now.getFullYear() && targetMonth === (now.getMonth() + 1);

  // Fetch users
  const articleWhereClause: any = { status: "PUBLISHED" };
  if (dateRange.startDate || dateRange.endDate) {
    articleWhereClause.publishedAt = {};
    if (dateRange.startDate) articleWhereClause.publishedAt.gte = dateRange.startDate;
    if (dateRange.endDate) articleWhereClause.publishedAt.lte = dateRange.endDate;
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      avatarUrl: true,
      role: true,
      customAuthorShare: true,
      _count: {
        select: {
          articles: {
            where: articleWhereClause,
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  let totalViews = 0;
  let grossEstimatedRevenue = 0;
  let totalAuthorShareAmount = 0;
  let totalPlatformShareAmount = 0;

  let todayViews = 0;
  let todayGrossRevenue = 0;
  let todayAuthorShareAmount = 0;
  let todayPlatformShareAmount = 0;

  let currentMonthViews = 0;
  let currentMonthGrossRevenue = 0;
  let currentMonthAuthorShareAmount = 0;
  let currentMonthPlatformShareAmount = 0;

  const authorsBreakdown: AuthorMonthlyBreakdown[] = [];

  for (const user of users) {
    const authorSharePct = user.customAuthorShare ?? defaultSettings.authorSharePercentage;
    const platformSharePct = 100 - authorSharePct;

    // 1. Filtered period views
    const viewWhereClause: any = { authorId: user.id };
    if (dateRange.startDate || dateRange.endDate) {
      viewWhereClause.timestamp = {};
      if (dateRange.startDate) viewWhereClause.timestamp.gte = dateRange.startDate;
      if (dateRange.endDate) viewWhereClause.timestamp.lte = dateRange.endDate;
    }
    const userViews = await prisma.articleView.count({ where: viewWhereClause });

    const userGross = (userViews / 1000) * effectiveRpm;
    const authorAmount = (userGross * authorSharePct) / 100;
    const platformAmount = (userGross * platformSharePct) / 100;

    totalViews += userViews;
    grossEstimatedRevenue += userGross;
    totalAuthorShareAmount += authorAmount;
    totalPlatformShareAmount += platformAmount;

    // 2. Today views
    const userTodayViews = await prisma.articleView.count({
      where: {
        authorId: user.id,
        timestamp: { gte: startOfToday, lte: endOfToday },
      },
    });
    const userTodayGross = (userTodayViews / 1000) * effectiveRpm;
    todayViews += userTodayViews;
    todayGrossRevenue += userTodayGross;
    todayAuthorShareAmount += (userTodayGross * authorSharePct) / 100;
    todayPlatformShareAmount += (userTodayGross * platformSharePct) / 100;

    // 3. Current month views
    const userMonthViews = await prisma.articleView.count({
      where: {
        authorId: user.id,
        timestamp: { gte: startOfCurrentMonth, lte: endOfCurrentMonth },
      },
    });
    const userMonthGross = (userMonthViews / 1000) * effectiveRpm;
    currentMonthViews += userMonthViews;
    currentMonthGrossRevenue += userMonthGross;
    currentMonthAuthorShareAmount += (userMonthGross * authorSharePct) / 100;
    currentMonthPlatformShareAmount += (userMonthGross * platformSharePct) / 100;

    authorsBreakdown.push({
      id: user.id,
      name: user.name,
      username: user.username,
      avatarUrl: user.avatarUrl,
      role: user.role,
      articlesCount: user._count.articles,
      monthlyViews: userViews,
      grossRevenue: Math.round(userGross * 100) / 100,
      authorSharePct,
      platformSharePct,
      authorShareAmount: Math.round(authorAmount * 100) / 100,
      platformShareAmount: Math.round(platformAmount * 100) / 100,
      isCustomShare: user.customAuthorShare !== null && user.customAuthorShare !== undefined,
      status: isCurrentMonth ? "CALCULATED" : "SETTLED",
    });
  }

  // Sort authors by views/revenue descending
  authorsBreakdown.sort((a, b) => b.monthlyViews - a.monthlyViews);

  return {
    year: targetYear,
    month: targetMonth,
    monthName: `${MONTH_NAMES[targetMonth - 1]} ${targetYear}`,
    filterType,
    filterLabel: dateRange.label,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    totalViews,
    grossEstimatedRevenue: Math.round(grossEstimatedRevenue * 100) / 100,
    totalAuthorShareAmount: Math.round(totalAuthorShareAmount * 100) / 100,
    totalPlatformShareAmount: Math.round(totalPlatformShareAmount * 100) / 100,

    todayViews,
    todayGrossRevenue: Math.round(todayGrossRevenue * 100) / 100,
    todayAuthorShareAmount: Math.round(todayAuthorShareAmount * 100) / 100,
    todayPlatformShareAmount: Math.round(todayPlatformShareAmount * 100) / 100,

    currentMonthViews,
    currentMonthGrossRevenue: Math.round(currentMonthGrossRevenue * 100) / 100,
    currentMonthAuthorShareAmount: Math.round(currentMonthAuthorShareAmount * 100) / 100,
    currentMonthPlatformShareAmount: Math.round(currentMonthPlatformShareAmount * 100) / 100,

    authorsCount: authorsBreakdown.length,
    isCurrentMonth,
    rpmEstimate: effectiveRpm,
    authors: authorsBreakdown,
  };
}

/**
 * Returns available monthly options for report filtering (last 12 months).
 */
export function getAvailableMonthlyPeriods(): Array<{ year: number; month: number; label: string }> {
  const periods = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    periods.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
    });
  }

  return periods;
}

export async function calculateAuthorEstimatedRevenue(
  authorId: string,
  options?: {
    filter?: RevenueFilterType;
    year?: number;
    month?: number;
    startDate?: string;
    endDate?: string;
    rpm?: number;
  }
) {
  const defaultSettings = await getMonetizationSettings();
  const effectiveRpm = options?.rpm !== undefined && !isNaN(options.rpm) ? options.rpm : defaultSettings.rpmEstimate;

  const authorUser = await prisma.user.findUnique({
    where: { id: authorId },
    select: { customAuthorShare: true },
  });

  const authorSharePercentage = authorUser?.customAuthorShare ?? defaultSettings.authorSharePercentage;
  const platformSharePercentage = 100 - authorSharePercentage;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const filterType = options?.filter || "month";
  const dateRange = getDateRangeForFilter(filterType, {
    year: options?.year,
    month: options?.month,
    startDate: options?.startDate,
    endDate: options?.endDate,
  });

  // Filtered views
  const filterWhere: any = { authorId };
  if (dateRange.startDate || dateRange.endDate) {
    filterWhere.timestamp = {};
    if (dateRange.startDate) filterWhere.timestamp.gte = dateRange.startDate;
    if (dateRange.endDate) filterWhere.timestamp.lte = dateRange.endDate;
  }
  const filteredViews = await prisma.articleView.count({ where: filterWhere });

  // Today views
  const todayViews = await prisma.articleView.count({
    where: { authorId, timestamp: { gte: startOfToday, lte: endOfToday } },
  });

  // Current month views
  const currentMonthViews = await prisma.articleView.count({
    where: { authorId, timestamp: { gte: startOfCurrentMonth, lte: endOfCurrentMonth } },
  });

  // Total views all time
  const totalViews = await prisma.articleView.count({ where: { authorId } });

  // Revenue calculations
  const calculateRevenue = (views: number) => {
    const gross = (views / 1000) * effectiveRpm;
    const author = (gross * authorSharePercentage) / 100;
    const platform = (gross * platformSharePercentage) / 100;
    return {
      gross: Math.round(gross * 100) / 100,
      author: Math.round(author * 100) / 100,
      platform: Math.round(platform * 100) / 100,
    };
  };

  const filteredCalc = calculateRevenue(filteredViews);
  const todayCalc = calculateRevenue(todayViews);
  const monthCalc = calculateRevenue(currentMonthViews);
  const totalCalc = calculateRevenue(totalViews);

  return {
    authorId,
    rpmEstimate: effectiveRpm,
    filterType,
    filterLabel: dateRange.label,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,

    // Filtered
    filteredViews,
    grossEstimatedRevenue: filteredCalc.gross,
    authorShareAmount: filteredCalc.author,
    platformShareAmount: filteredCalc.platform,

    // Today
    todayViews,
    todayGrossRevenue: todayCalc.gross,
    todayAuthorShareAmount: todayCalc.author,

    // Current Month
    currentMonthViews,
    currentMonthGrossRevenue: monthCalc.gross,
    currentMonthAuthorShareAmount: monthCalc.author,

    // All time
    totalViews,
    totalGrossRevenue: totalCalc.gross,
    totalAuthorShareAmount: totalCalc.author,

    platformSharePercentage,
    authorSharePercentage,
    isCustomShare: authorUser?.customAuthorShare !== null && authorUser?.customAuthorShare !== undefined,
    isEstimate: true,
  };
}

export async function getGlobalRevenueSummary(rpmOverride?: number) {
  const defaultSettings = await getMonetizationSettings();
  const effectiveRpm = rpmOverride !== undefined && !isNaN(rpmOverride) ? rpmOverride : defaultSettings.rpmEstimate;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // Today
  const todayViews = await prisma.articleView.count({
    where: { timestamp: { gte: startOfToday, lte: endOfToday } },
  });
  const todayGrossRevenue = (todayViews / 1000) * effectiveRpm;

  // Current Month
  const currentMonthViews = await prisma.articleView.count({
    where: { timestamp: { gte: startOfCurrentMonth, lte: endOfCurrentMonth } },
  });
  const currentMonthGrossRevenue = (currentMonthViews / 1000) * effectiveRpm;
  const currentMonthAuthorShare = (currentMonthGrossRevenue * defaultSettings.authorSharePercentage) / 100;
  const currentMonthPlatformShare = (currentMonthGrossRevenue * defaultSettings.platformSharePercentage) / 100;

  // All time
  const totalViews = await prisma.articleView.count();
  const grossEstimatedRevenue = (totalViews / 1000) * effectiveRpm;
  const totalAuthorShare = (grossEstimatedRevenue * defaultSettings.authorSharePercentage) / 100;
  const totalPlatformShare = (grossEstimatedRevenue * defaultSettings.platformSharePercentage) / 100;

  const importedRevenueRecords = await prisma.revenueRecord.findMany({
    where: { source: "MANUAL_IMPORT" },
  });
  const totalImportedRevenue = importedRevenueRecords.reduce((acc, curr) => acc + curr.estimatedRevenue, 0);

  return {
    rpmEstimate: effectiveRpm,
    
    // Today
    todayViews,
    todayGrossRevenue: Math.round(todayGrossRevenue * 100) / 100,

    // Current Month (Resets to 0 at start of month!)
    currentMonthViews,
    currentMonthGrossRevenue: Math.round(currentMonthGrossRevenue * 100) / 100,
    currentMonthAuthorShare: Math.round(currentMonthAuthorShare * 100) / 100,
    currentMonthPlatformShare: Math.round(currentMonthPlatformShare * 100) / 100,

    // All time
    totalViews,
    grossEstimatedRevenue: Math.round(grossEstimatedRevenue * 100) / 100,
    totalAuthorShare: Math.round(totalAuthorShare * 100) / 100,
    totalPlatformShare: Math.round(totalPlatformShare * 100) / 100,
    totalImportedRevenue: Math.round(totalImportedRevenue * 100) / 100,

    settings: defaultSettings,
  };
}
