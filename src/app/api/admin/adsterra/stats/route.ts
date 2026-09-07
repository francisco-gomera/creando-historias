import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAdsterraStats } from "@/services/adsterra.service";

function parseDate(value: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
}

export async function GET(req: Request) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const url = new URL(req.url);
  const stats = await getAdsterraStats({
    startDate: parseDate(url.searchParams.get("startDate")),
    endDate: parseDate(url.searchParams.get("endDate")),
    groupBy: (url.searchParams.get("groupBy") as any) || "date",
    domain: url.searchParams.get("domain") || undefined,
    placement: url.searchParams.get("placement") || undefined,
    country: url.searchParams.get("country") || undefined,
  });

  return NextResponse.json(stats);
}
