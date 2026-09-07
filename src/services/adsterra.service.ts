const ADSTERRA_API_BASE = "https://api3.adsterratools.com/publisher";

export interface AdsterraStatsRow {
  label: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpm: number;
  revenue: number;
}

export interface AdsterraStatsSummary {
  isConfigured: boolean;
  isLive: boolean;
  error?: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpm: number;
  revenue: number;
  rows: AdsterraStatsRow[];
}

interface StatsOptions {
  startDate?: Date;
  endDate?: Date;
  groupBy?: "date" | "domain" | "placement" | "country" | "placement_sub_id";
  domain?: string;
  placement?: string;
  country?: string;
}

function formatApiDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    let normalized = value
      .trim()
      .replace(/[$%\s]/g, "");

    const hasComma = normalized.includes(",");
    const hasDot = normalized.includes(".");
    if (hasComma && hasDot) {
      normalized =
        normalized.lastIndexOf(",") > normalized.lastIndexOf(".")
          ? normalized.replace(/\./g, "").replace(",", ".")
          : normalized.replace(/,/g, "");
    } else if (hasComma) {
      normalized = normalized.replace(",", ".");
    }

    const parsed = parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function readField(item: Record<string, unknown>, aliases: string[]): unknown {
  for (const alias of aliases) {
    if (item[alias] !== undefined) return item[alias];
  }

  const lowerAliasSet = new Set(aliases.map((alias) => alias.toLowerCase()));
  const matchedKey = Object.keys(item).find((key) => lowerAliasSet.has(key.toLowerCase()));
  return matchedKey ? item[matchedKey] : undefined;
}

function getRows(payload: unknown): any[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of ["items", "data", "rows", "result", "statistics", "stats"]) {
      if (Array.isArray(record[key])) return record[key] as any[];
    }
    if (
      readField(record, ["impressions", "impression", "shows"]) !== undefined ||
      readField(record, ["revenue", "profit", "earnings"]) !== undefined ||
      readField(record, ["cpm", "CPM", "ecpm", "eCPM", "e_cpm"]) !== undefined
    ) {
      return [record];
    }
  }
  return [];
}

function normalizeStats(payload: unknown, isConfigured: boolean): AdsterraStatsSummary {
  const rows = getRows(payload).map((row) => {
    const item = row as Record<string, unknown>;
    const labelValue =
      readField(item, ["date", "domain", "domain_id", "placement", "placement_id", "country", "placement_sub_id", "title"]) ??
      "Total";
    const impressions = toNumber(readField(item, ["impressions", "impression", "shows"]));
    const clicks = toNumber(readField(item, ["clicks", "click"]));
    const revenue = toNumber(readField(item, ["revenue", "profit", "earnings"]));
    const ctr = toNumber(readField(item, ["ctr", "CTR"]));
    const cpmFromApi = toNumber(readField(item, ["cpm", "CPM", "ecpm", "eCPM", "e_cpm"]));

    return {
      label: String(labelValue),
      impressions,
      clicks,
      ctr: ctr || (impressions > 0 ? (clicks / impressions) * 100 : 0),
      cpm: cpmFromApi || (impressions > 0 ? (revenue / impressions) * 1000 : 0),
      revenue,
    };
  });

  const impressions = rows.reduce((sum, row) => sum + row.impressions, 0);
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const revenue = rows.reduce((sum, row) => sum + row.revenue, 0);
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const calculatedCpm = impressions > 0 ? (revenue / impressions) * 1000 : 0;
  const weightedApiCpm =
    impressions > 0
      ? rows.reduce((sum, row) => sum + row.cpm * row.impressions, 0) / impressions
      : rows.length > 0
        ? rows.reduce((sum, row) => sum + row.cpm, 0) / rows.length
        : 0;
  const cpm = calculatedCpm || weightedApiCpm;

  return {
    isConfigured,
    isLive: true,
    impressions,
    clicks,
    ctr: Math.round(ctr * 100) / 100,
    cpm: Math.round(cpm * 100) / 100,
    revenue: Math.round(revenue * 100) / 100,
    rows,
  };
}

export async function getAdsterraStats(options: StatsOptions = {}): Promise<AdsterraStatsSummary> {
  const apiKey = process.env.ADSTERRA_API_KEY;

  if (!apiKey) {
    return {
      isConfigured: false,
      isLive: false,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cpm: 0,
      revenue: 0,
      rows: [],
    };
  }

  const params = new URLSearchParams();
  const domain = options.domain || process.env.ADSTERRA_DOMAIN_ID;
  const placement = options.placement || process.env.ADSTERRA_PLACEMENT_ID;
  const country = options.country || process.env.ADSTERRA_COUNTRY;

  if (domain) params.set("domain", domain);
  if (placement) params.set("placement", placement);
  if (country) params.set("country", country);
  if (options.startDate) params.set("start_date", formatApiDate(options.startDate));
  if (options.endDate) params.set("finish_date", formatApiDate(options.endDate));

  const groupBy = options.groupBy || "date";
  params.append("group_by[]", groupBy);

  try {
    const response = await fetch(`${ADSTERRA_API_BASE}/stats.json?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-Key": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        isConfigured: true,
        isLive: false,
        error: `Adsterra respondio con estado ${response.status}`,
        impressions: 0,
        clicks: 0,
        ctr: 0,
        cpm: 0,
        revenue: 0,
        rows: [],
      };
    }

    return normalizeStats(await response.json(), true);
  } catch (error: any) {
    return {
      isConfigured: true,
      isLive: false,
      error: error?.message || "No se pudo conectar con Adsterra",
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cpm: 0,
      revenue: 0,
      rows: [],
    };
  }
}
