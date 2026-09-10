import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function getDeviceType(userAgent: string) {
  return /mobile|android|iphone|ipad|tablet/i.test(userAgent) ? "mobile" : "desktop";
}

export async function POST(req: Request) {
  try {
    // 1. Safe body extraction (beacons can send raw strings or empty payloads)
    let body: any = null;
    try {
      const rawText = await req.text();
      if (rawText) {
        body = JSON.parse(rawText);
      }
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }

    if (!body?.placementId || typeof body.placementId !== "string") {
      return NextResponse.json({ ok: false, error: "placementId required" }, { status: 400 });
    }

    // 2. Ignore admin impressions to prevent skewing analytics
    try {
      const viewer = await getCurrentUser();
      if (viewer?.role === "ADMIN") {
        return NextResponse.json({ success: true, skipped: true, reason: "ADMIN_VIEW" });
      }
    } catch {
      // Ignore auth parsing failures for public analytics
    }

    const userAgent = req.headers.get("user-agent") || "";
    const country = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "UNKNOWN";
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || "anon";
    const minuteBucket = new Date().toISOString().slice(0, 16);
    const anonymousSessionHash = crypto
      .createHash("sha256")
      .update(`${ipAddress}-${userAgent}-${body.placementId}-${body.route || ""}-${minuteBucket}`)
      .digest("hex");

    // 3. Database write with resilient error handling
    try {
      await prisma.adSlotImpression.create({
        data: {
          placementId: String(body.placementId).slice(0, 80),
          adKey: typeof body.adKey === "string" ? body.adKey.slice(0, 120) : null,
          articleId: typeof body.articleId === "string" && body.articleId.trim().length > 0 ? body.articleId.slice(0, 60) : null,
          authorId: typeof body.authorId === "string" && body.authorId.trim().length > 0 ? body.authorId.slice(0, 60) : null,
          route: typeof body.route === "string" ? body.route.slice(0, 300) : null,
          country: String(country).slice(0, 10),
          deviceType: getDeviceType(userAgent),
          anonymousSessionHash,
        },
      });
    } catch (dbError: any) {
      console.error("[AdImpressionAnalytics] DB insert error:", dbError?.message || dbError);
      // Return 202 Accepted so telemetry/beacon never causes 5xx error spikes on Vercel
      return NextResponse.json(
        { success: false, handled: true, reason: "STORAGE_DEGRADED" },
        { status: 202 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (unexpectedError: any) {
    console.error("[AdImpressionAnalytics] Unexpected error:", unexpectedError?.message || unexpectedError);
    // Fail softly for analytics to protect uptime SLA and avoid 5xx alert loops
    return NextResponse.json(
      { success: false, handled: true },
      { status: 200 }
    );
  }
}
