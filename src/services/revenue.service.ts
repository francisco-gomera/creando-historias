import { prisma } from "../lib/prisma";
import { AdsterraStatsSummary, getAdsterraStats } from "./adsterra.service";

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

export interface AdSlotPerformance {
  placementId: string;
  internalImpressions: number;
  mobileImpressions: number;
  desktopImpressions: number;
  sharePct: number;
  attributedRevenue: number;
}

export type RevenueFilterType = "today" | "week" | "month" | "year" | "all" | "custom";
export type RevenueSource = "ADSTERRA_API" | "RPM_ESTIMATE";

export interface MonthlyRevenueReport {
  year: number;
  month: number;
  monthName: string;
  filterType: RevenueFilterType;
  filterLabel: string;
  startDate?: Date;
  endDate?: Date;
  totalViews: number;
  grossEstimatedRevenue: number;
  totalAuthorShareAmount: number;
  totalPlatformShareAmount: number;
  totalImpressions: number;
  totalClicks: number;
  ctr: number;
  cpm: number;
  revenueSource: RevenueSource;
  adsterra: AdsterraStatsSummary;
  todayViews: number;
  todayGrossRevenue: number;
  todayAuthorShareAmount: number;
  todayPlatformShareAmount: number;
  todayImpressions: number;
  todayClicks: number;
  currentMonthViews: number;
  currentMonthGrossRevenue: number;
  currentMonthAuthorShareAmount: number;
  currentMonthPlatformShareAmount: number;
  currentMonthImpressions: number;
  currentMonthClicks: number;
  authorsCount: number;
  isCurrentMonth: boolean;
  rpmEstimate: number;
  authors: AuthorMonthlyBreakdown[];
  adSlots: AdSlotPerformance[];
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function resolveRevenue(stats: AdsterraStatsSummary, views: number, rpm: number) {
  if (stats.isLive) {
    return {
      source: "ADSTERRA_API" as const,
      revenue: stats.revenue,
      impressions: stats.impressions,
      clicks: stats.clicks,
      ctr: stats.ctr,
      cpm: stats.cpm,
    };
  }

  return {
    source: "RPM_ESTIMATE" as const,
    revenue: (views / 1000) * rpm,
    impressions: views,
    clicks: 0,
    ctr: 0,
    cpm: rpm,
  };
}

async function countViewsInRange(startDate?: Date, endDate?: Date, authorId?: string) {
  const where: any = {};
  if (authorId) where.authorId = authorId;
  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp.gte = startDate;
    if (endDate) where.timestamp.lte = endDate;
  }
  return prisma.articleView.count({ where });
}

async function getPeriodStats(startDate?: Date, endDate?: Date) {
  return getAdsterraStats({ startDate, endDate, groupBy: "date" });
}

async function getAdSlotPerformance(startDate: Date | undefined, endDate: Date | undefined, grossRevenue: number): Promise<AdSlotPerformance[]> {
  const where: any = {};
  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp.gte = startDate;
    if (endDate) where.timestamp.lte = endDate;
  }

  let impressions: Array<{ placementId: string; deviceType: string }>;

  try {
    impressions = await prisma.adSlotImpression.findMany({
      where,
      select: { placementId: true, deviceType: true },
      take: 100000,
    });
  } catch (error) {
    return [];
  }

  const slotMap = new Map<string, { total: number; mobile: number; desktop: number }>();

  for (const row of impressions) {
    const current = slotMap.get(row.placementId) || { total: 0, mobile: 0, desktop: 0 };
    current.total += 1;
    if (row.deviceType === "mobile") current.mobile += 1;
    else current.desktop += 1;
    slotMap.set(row.placementId, current);
  }

  const totalInternalImpressions = Array.from(slotMap.values()).reduce((sum, slot) => sum + slot.total, 0);

  return Array.from(slotMap.entries())
    .map(([placementId, slot]) => {
      const sharePct = totalInternalImpressions > 0 ? (slot.total / totalInternalImpressions) * 100 : 0;
      return {
        placementId,
        internalImpressions: slot.total,
        mobileImpressions: slot.mobile,
        desktopImpressions: slot.desktop,
        sharePct: Math.round(sharePct * 100) / 100,
        attributedRevenue: roundMoney(totalInternalImpressions > 0 ? grossRevenue * (slot.total / totalInternalImpressions) : 0),
      };
    })
    .sort((a, b) => b.attributedRevenue - a.attributedRevenue || b.internalImpressions - a.internalImpressions);
}

export async function getMonetizationSettings(): Promise<MonetizationSettings> {
  const [platformSetting, authorSetting, rpmSetting] = await Promise.all([
    prisma.platformSetting.findUnique({ where: { key: "platformSharePercentage" } }),
    prisma.platformSetting.findUnique({ where: { key: "authorSharePercentage" } }),
    prisma.platformSetting.findUnique({ where: { key: "rpmEstimate" } }),
  ]);

  return {
    platformSharePercentage: platformSetting ? parseFloat(platformSetting.value) : 30,
    authorSharePercentage: authorSetting ? parseFloat(authorSetting.value) : 70,
    rpmEstimate: rpmSetting ? parseFloat(rpmSetting.value) : 4.5,
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
    return { startDate: start, endDate: end, label: "Ultimos 7 dias" };
  }

  if (filter === "year") {
    const y = options?.year || now.getFullYear();
    const start = new Date(y, 0, 1, 0, 0, 0, 0);
    const end = new Date(y, 11, 31, 23, 59, 59, 999);
    return { startDate: start, endDate: end, label: `Ano ${y}` };
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

  const targetYear = options?.year || now.getFullYear();
  const targetMonth = options?.month || now.getMonth() + 1;
  const start = new Date(targetYear, targetMonth - 1, 1, 0, 0, 0, 0);
  const end = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);
  return { startDate: start, endDate: end, label: `${MONTH_NAMES[targetMonth - 1]} ${targetYear}` };
}

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
  const targetMonth = month || now.getMonth() + 1;
  const dateRange = getDateRangeForFilter(filterType, { year: targetYear, month: targetMonth, startDate: customStartDate, endDate: customEndDate });
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const isCurrentMonth = targetYear === now.getFullYear() && targetMonth === now.getMonth() + 1;

  const [totalViews, todayViews, currentMonthViews, periodStats, todayStats, monthStats] = await Promise.all([
    countViewsInRange(dateRange.startDate, dateRange.endDate),
    countViewsInRange(startOfToday, endOfToday),
    countViewsInRange(startOfCurrentMonth, endOfCurrentMonth),
    getPeriodStats(dateRange.startDate, dateRange.endDate),
    getPeriodStats(startOfToday, endOfToday),
    getPeriodStats(startOfCurrentMonth, endOfCurrentMonth),
  ]);

  const periodRevenue = resolveRevenue(periodStats, totalViews, effectiveRpm);
  const todayRevenue = resolveRevenue(todayStats, todayViews, effectiveRpm);
  const monthRevenue = resolveRevenue(monthStats, currentMonthViews, effectiveRpm);
  const adSlots = await getAdSlotPerformance(dateRange.startDate, dateRange.endDate, periodRevenue.revenue);

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
      _count: { select: { articles: { where: articleWhereClause } } },
    },
    orderBy: { name: "asc" },
  });

  let totalAuthorShareAmount = 0;
  let totalPlatformShareAmount = 0;
  let todayAuthorShareAmount = 0;
  let todayPlatformShareAmount = 0;
  let currentMonthAuthorShareAmount = 0;
  let currentMonthPlatformShareAmount = 0;
  const authorsBreakdown: AuthorMonthlyBreakdown[] = [];

  for (const user of users) {
    const authorSharePct = user.customAuthorShare ?? defaultSettings.authorSharePercentage;
    const platformSharePct = 100 - authorSharePct;
    const [userViews, userTodayViews, userMonthViews] = await Promise.all([
      countViewsInRange(dateRange.startDate, dateRange.endDate, user.id),
      countViewsInRange(startOfToday, endOfToday, user.id),
      countViewsInRange(startOfCurrentMonth, endOfCurrentMonth, user.id),
    ]);

    const userGross = totalViews > 0 ? periodRevenue.revenue * (userViews / totalViews) : 0;
    const authorAmount = (userGross * authorSharePct) / 100;
    const platformAmount = (userGross * platformSharePct) / 100;
    const todayGross = todayViews > 0 ? todayRevenue.revenue * (userTodayViews / todayViews) : 0;
    const monthGross = currentMonthViews > 0 ? monthRevenue.revenue * (userMonthViews / currentMonthViews) : 0;

    totalAuthorShareAmount += authorAmount;
    totalPlatformShareAmount += platformAmount;
    todayAuthorShareAmount += (todayGross * authorSharePct) / 100;
    todayPlatformShareAmount += (todayGross * platformSharePct) / 100;
    currentMonthAuthorShareAmount += (monthGross * authorSharePct) / 100;
    currentMonthPlatformShareAmount += (monthGross * platformSharePct) / 100;

    authorsBreakdown.push({
      id: user.id,
      name: user.name,
      username: user.username,
      avatarUrl: user.avatarUrl,
      role: user.role,
      articlesCount: user._count.articles,
      monthlyViews: userViews,
      grossRevenue: roundMoney(userGross),
      authorSharePct,
      platformSharePct,
      authorShareAmount: roundMoney(authorAmount),
      platformShareAmount: roundMoney(platformAmount),
      isCustomShare: user.customAuthorShare !== null && user.customAuthorShare !== undefined,
      status: isCurrentMonth ? "CALCULATED" : "SETTLED",
    });
  }

  authorsBreakdown.sort((a, b) => b.grossRevenue - a.grossRevenue || b.monthlyViews - a.monthlyViews);

  return {
    year: targetYear,
    month: targetMonth,
    monthName: `${MONTH_NAMES[targetMonth - 1]} ${targetYear}`,
    filterType,
    filterLabel: dateRange.label,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    totalViews,
    grossEstimatedRevenue: roundMoney(periodRevenue.revenue),
    totalAuthorShareAmount: roundMoney(totalAuthorShareAmount),
    totalPlatformShareAmount: roundMoney(totalPlatformShareAmount),
    totalImpressions: periodRevenue.impressions,
    totalClicks: periodRevenue.clicks,
    ctr: periodRevenue.ctr,
    cpm: periodRevenue.cpm,
    revenueSource: periodRevenue.source,
    adsterra: periodStats,
    todayViews,
    todayGrossRevenue: roundMoney(todayRevenue.revenue),
    todayAuthorShareAmount: roundMoney(todayAuthorShareAmount),
    todayPlatformShareAmount: roundMoney(todayPlatformShareAmount),
    todayImpressions: todayRevenue.impressions,
    todayClicks: todayRevenue.clicks,
    currentMonthViews,
    currentMonthGrossRevenue: roundMoney(monthRevenue.revenue),
    currentMonthAuthorShareAmount: roundMoney(currentMonthAuthorShareAmount),
    currentMonthPlatformShareAmount: roundMoney(currentMonthPlatformShareAmount),
    currentMonthImpressions: monthRevenue.impressions,
    currentMonthClicks: monthRevenue.clicks,
    authorsCount: authorsBreakdown.length,
    isCurrentMonth,
    rpmEstimate: effectiveRpm,
    authors: authorsBreakdown,
    adSlots,
  };
}

export function getAvailableMonthlyPeriods(): Array<{ year: number; month: number; label: string }> {
  const periods = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    periods.push({ year: d.getFullYear(), month: d.getMonth() + 1, label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}` });
  }

  return periods;
}

function authorRevenueFromShare(grossRevenue: number, authorViews: number, platformViews: number, authorSharePercentage: number, platformSharePercentage: number) {
  const attributedGross = platformViews > 0 ? grossRevenue * (authorViews / platformViews) : 0;
  return {
    gross: roundMoney(attributedGross),
    author: roundMoney((attributedGross * authorSharePercentage) / 100),
    platform: roundMoney((attributedGross * platformSharePercentage) / 100),
  };
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
  const authorUser = await prisma.user.findUnique({ where: { id: authorId }, select: { customAuthorShare: true } });
  const authorSharePercentage = authorUser?.customAuthorShare ?? defaultSettings.authorSharePercentage;
  const platformSharePercentage = 100 - authorSharePercentage;
  const now = new Date();
  const year = options?.year || now.getFullYear();
  const month = options?.month || now.getMonth() + 1;
  const filterType = options?.filter || "month";
  const dateRange = getDateRangeForFilter(filterType, { year, month, startDate: options?.startDate, endDate: options?.endDate });
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const [
    filteredViews,
    todayViews,
    currentMonthViews,
    totalViews,
    allFilteredViews,
    allTodayViews,
    allCurrentMonthViews,
    allTimeViews,
    periodStats,
    todayStats,
    monthStats,
    allStats,
  ] = await Promise.all([
    countViewsInRange(dateRange.startDate, dateRange.endDate, authorId),
    countViewsInRange(startOfToday, endOfToday, authorId),
    countViewsInRange(startOfCurrentMonth, endOfCurrentMonth, authorId),
    countViewsInRange(undefined, undefined, authorId),
    countViewsInRange(dateRange.startDate, dateRange.endDate),
    countViewsInRange(startOfToday, endOfToday),
    countViewsInRange(startOfCurrentMonth, endOfCurrentMonth),
    countViewsInRange(),
    getPeriodStats(dateRange.startDate, dateRange.endDate),
    getPeriodStats(startOfToday, endOfToday),
    getPeriodStats(startOfCurrentMonth, endOfCurrentMonth),
    getPeriodStats(),
  ]);

  const filteredResolved = resolveRevenue(periodStats, allFilteredViews, effectiveRpm);
  const todayResolved = resolveRevenue(todayStats, allTodayViews, effectiveRpm);
  const monthResolved = resolveRevenue(monthStats, allCurrentMonthViews, effectiveRpm);
  const allResolved = resolveRevenue(allStats, allTimeViews, effectiveRpm);
  const filteredCalc = authorRevenueFromShare(filteredResolved.revenue, filteredViews, allFilteredViews, authorSharePercentage, platformSharePercentage);
  const todayCalc = authorRevenueFromShare(todayResolved.revenue, todayViews, allTodayViews, authorSharePercentage, platformSharePercentage);
  const monthCalc = authorRevenueFromShare(monthResolved.revenue, currentMonthViews, allCurrentMonthViews, authorSharePercentage, platformSharePercentage);
  const totalCalc = authorRevenueFromShare(allResolved.revenue, totalViews, allTimeViews, authorSharePercentage, platformSharePercentage);

  return {
    authorId,
    year,
    month,
    rpmEstimate: effectiveRpm,
    revenueSource: filteredResolved.source,
    adsterra: periodStats,
    totalImpressions: filteredResolved.impressions,
    totalClicks: filteredResolved.clicks,
    ctr: filteredResolved.ctr,
    cpm: filteredResolved.cpm,
    filterType,
    filterLabel: dateRange.label,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    filteredViews,
    grossEstimatedRevenue: filteredCalc.gross,
    authorShareAmount: filteredCalc.author,
    platformShareAmount: filteredCalc.platform,
    todayViews,
    todayGrossRevenue: todayCalc.gross,
    todayAuthorShareAmount: todayCalc.author,
    currentMonthViews,
    currentMonthGrossRevenue: monthCalc.gross,
    currentMonthAuthorShareAmount: monthCalc.author,
    totalViews,
    totalGrossRevenue: totalCalc.gross,
    totalAuthorShareAmount: totalCalc.author,
    platformSharePercentage,
    authorSharePercentage,
    isCustomShare: authorUser?.customAuthorShare !== null && authorUser?.customAuthorShare !== undefined,
    isEstimate: filteredResolved.source === "RPM_ESTIMATE",
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

  const [todayViews, currentMonthViews, totalViews, todayStats, monthStats, allStats] = await Promise.all([
    countViewsInRange(startOfToday, endOfToday),
    countViewsInRange(startOfCurrentMonth, endOfCurrentMonth),
    countViewsInRange(),
    getPeriodStats(startOfToday, endOfToday),
    getPeriodStats(startOfCurrentMonth, endOfCurrentMonth),
    getPeriodStats(),
  ]);

  const todayRevenue = resolveRevenue(todayStats, todayViews, effectiveRpm);
  const monthRevenue = resolveRevenue(monthStats, currentMonthViews, effectiveRpm);
  const allRevenue = resolveRevenue(allStats, totalViews, effectiveRpm);

  return {
    rpmEstimate: effectiveRpm,
    revenueSource: allRevenue.source,
    adsterra: allStats,
    todayViews,
    todayGrossRevenue: roundMoney(todayRevenue.revenue),
    todayImpressions: todayRevenue.impressions,
    todayClicks: todayRevenue.clicks,
    currentMonthViews,
    currentMonthGrossRevenue: roundMoney(monthRevenue.revenue),
    currentMonthAuthorShare: roundMoney((monthRevenue.revenue * defaultSettings.authorSharePercentage) / 100),
    currentMonthPlatformShare: roundMoney((monthRevenue.revenue * defaultSettings.platformSharePercentage) / 100),
    currentMonthImpressions: monthRevenue.impressions,
    currentMonthClicks: monthRevenue.clicks,
    totalViews,
    grossEstimatedRevenue: roundMoney(allRevenue.revenue),
    totalAuthorShare: roundMoney((allRevenue.revenue * defaultSettings.authorSharePercentage) / 100),
    totalPlatformShare: roundMoney((allRevenue.revenue * defaultSettings.platformSharePercentage) / 100),
    totalImportedRevenue: 0,
    settings: defaultSettings,
  };
}
