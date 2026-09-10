export const ADSTERRA_ADS_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_ADSTERRA === "true" ||
  process.env.NODE_ENV === "production";

export const ADSTERRA_INTRUSIVE_FORMATS_ENABLED =
  ADSTERRA_ADS_ENABLED && process.env.NEXT_PUBLIC_ADSTERRA_INTRUSIVE_FORMATS !== "false";

export const ADSTERRA_ROUTES_WITHOUT_ADS = [
  "/about",
  "/contact",
  "/cookies",
  "/login",
  "/privacy",
  "/sobre-nosotros",
  "/terms",
] as const;

export const ADSTERRA_KEYS = {
  display468x60: process.env.NEXT_PUBLIC_ADSTERRA_DISPLAY_468X60 || "6dbb818f76a41d9fd7b276a64638934f",
  headerDesktop728x90: process.env.NEXT_PUBLIC_ADSTERRA_HEADER_DESKTOP_728X90 || "7dc4efd221856c7cc01bfcaa22b2c289",
  headerMobile320x50: process.env.NEXT_PUBLIC_ADSTERRA_HEADER_MOBILE_320X50 || "38e93328cc31a4d67bb5967d1a57b595",
  nativeBanner: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER || "666fc12a09a07ad15eeca1a70b387d4b",
  nativeBannerHeader: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_HEADER || process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER || "666fc12a09a07ad15eeca1a70b387d4b",
  nativeBannerSidebar: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_SIDEBAR || "666fc12a09a07ad15eeca1a70b387d4b",
  popunderScript: process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_SCRIPT || "https://wailsilence.com/5a/77/9f/5a779ffcc3c9736641795d9d4408d678.js",
  socialBarScript: process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_SCRIPT || "https://wailsilence.com/6a/94/d8/6a94d8ced66908f1c8e6e72a1022ef24.js",
  smartlinkUrl: process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK_URL || "",
} as const;

export const ADSTERRA_LAYOUT = {
  maxInContentAds: Number(process.env.NEXT_PUBLIC_ADSTERRA_MAX_IN_CONTENT_ADS || 5),
  firstInContentAfterParagraph: Number(process.env.NEXT_PUBLIC_ADSTERRA_FIRST_IN_CONTENT_AFTER_PARAGRAPH || 2),
  paragraphsBetweenInContentAds: Number(process.env.NEXT_PUBLIC_ADSTERRA_PARAGRAPHS_BETWEEN_ADS || 5),
  showStickyBottom: process.env.NEXT_PUBLIC_ADSTERRA_SHOW_STICKY_BOTTOM !== "false",
  showArticleNativeHeader: process.env.NEXT_PUBLIC_ADSTERRA_SHOW_ARTICLE_NATIVE_HEADER !== "false",
  showBelowArticleMobileAds: process.env.NEXT_PUBLIC_ADSTERRA_SHOW_BELOW_ARTICLE_MOBILE_ADS !== "false",
} as const;

export function isAdsterraRouteAllowed(pathname: string | null | undefined) {
  if (!pathname) return false;
  return !ADSTERRA_ROUTES_WITHOUT_ADS.some(
    (blockedPath) => pathname === blockedPath || pathname.startsWith(`${blockedPath}/`)
  );
}
