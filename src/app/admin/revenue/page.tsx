import { getMonthlyRevenueReport, getAvailableMonthlyPeriods, RevenueFilterType } from "@/services/revenue.service";
import AdminRevenueReportClient from "./AdminRevenueReportClient";

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

export default async function AdminRevenuePage({ searchParams }: Props) {
  const year = searchParams.year ? parseInt(searchParams.year, 10) : undefined;
  const month = searchParams.month ? parseInt(searchParams.month, 10) : undefined;
  const rpm = searchParams.rpm ? parseFloat(searchParams.rpm) : undefined;
  const filterType = (searchParams.filter || "month") as RevenueFilterType;

  const report = await getMonthlyRevenueReport(
    year,
    month,
    rpm,
    filterType,
    searchParams.startDate,
    searchParams.endDate
  );
  const periods = getAvailableMonthlyPeriods();

  return <AdminRevenueReportClient report={report} periods={periods} />;
}
