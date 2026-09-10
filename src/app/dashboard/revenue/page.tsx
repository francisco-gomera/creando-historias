import { getCurrentUser } from "@/lib/auth";
import { calculateAuthorEstimatedRevenue, getAvailableMonthlyPeriods, RevenueFilterType } from "@/services/revenue.service";
import AuthorRevenueClient from "./AuthorRevenueClient";

interface Props {
  searchParams: {
    year?: string;
    month?: string;
    rpm?: string;
    filter?: string;
    startDate?: string;
    endDate?: string;
  };
}

export default async function AuthorRevenuePage({ searchParams }: Props) {
  const user = (await getCurrentUser())!;
  const year = searchParams.year ? parseInt(searchParams.year, 10) : undefined;
  const month = searchParams.month ? parseInt(searchParams.month, 10) : undefined;
  const rpm = searchParams.rpm ? parseFloat(searchParams.rpm) : undefined;
  const filterType = (searchParams.filter || "month") as RevenueFilterType;

  const revenue = await calculateAuthorEstimatedRevenue(user.userId, {
    filter: filterType,
    year,
    month,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    rpm,
  });

  const periods = getAvailableMonthlyPeriods();

  const safeRevenue = {
    authorId: revenue.authorId,
    year: revenue.year,
    month: revenue.month,
    revenueSource: revenue.revenueSource,
    rpmEstimate: revenue.rpmEstimate,
    filterType: revenue.filterType,
    filterLabel: revenue.filterLabel,
    filteredViews: revenue.filteredViews,
    authorShareAmount: revenue.authorShareAmount,
    todayViews: revenue.todayViews,
    todayAuthorShareAmount: revenue.todayAuthorShareAmount,
    currentMonthViews: revenue.currentMonthViews,
    currentMonthAuthorShareAmount: revenue.currentMonthAuthorShareAmount,
    totalViews: revenue.totalViews,
    totalAuthorShareAmount: revenue.totalAuthorShareAmount,
    authorSharePercentage: revenue.authorSharePercentage,
  };

  return <AuthorRevenueClient revenue={safeRevenue} periods={periods} />;
}
