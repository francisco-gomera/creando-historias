import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function getDeviceType(userAgent: string) {
  return /mobile|android|iphone|ipad|tablet/i.test(userAgent) ? "mobile" : "desktop";
}

export async function POST(req: Request) {
  try {
    const viewer = await getCurrentUser();
    if (viewer?.role === "ADMIN") {
      return NextResponse.json({ success: true, skipped: true, reason: "ADMIN_VIEW" });
    }

    const body = await req.json();
    if (!body?.placementId || typeof body.placementId !== "string") {
      return NextResponse.json({ error: "placementId requerido" }, { status: 400 });
    }

    const userAgent = req.headers.get("user-agent") || "";
    const country = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "UNKNOWN";
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || "anon";
    const minuteBucket = new Date().toISOString().slice(0, 16);
    const anonymousSessionHash = crypto
      .createHash("sha256")
      .update(`${ipAddress}-${userAgent}-${body.placementId}-${body.route || ""}-${minuteBucket}`)
      .digest("hex");

    await prisma.adSlotImpression.create({
      data: {
        placementId: body.placementId.slice(0, 80),
        adKey: typeof body.adKey === "string" ? body.adKey.slice(0, 120) : null,
        articleId: typeof body.articleId === "string" ? body.articleId : null,
        authorId: typeof body.authorId === "string" ? body.authorId : null,
        route: typeof body.route === "string" ? body.route.slice(0, 300) : null,
        country,
        deviceType: getDeviceType(userAgent),
        anonymousSessionHash,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error registrando impresion publicitaria" }, { status: 500 });
  }
}
