"use client";

import { useEffect, useState } from "react";
import AdsterraAd from "./AdsterraAd";
import AdSlotTracker from "./AdSlotTracker";
import { ADSTERRA_KEYS } from "@/lib/adsterra-config";

interface HeaderBannerAdProps {
  slotId?: string;
  className?: string;
  articleId?: string;
  authorId?: string;
}

/**
 * Responsive Header Banner Ad:
 * Follows Adsterra's best practice combination:
 * - Desktop & Tablet (>= 640px): 728x90 Leaderboard (key: 7dc4efd221856c7cc01bfcaa22b2c289)
 * - Mobile (< 640px): 320x50 Mobile Leaderboard (key: 38e93328cc31a4d67bb5967d1a57b595)
 * Dynamically mounts ONLY the matching device script to prevent atOptions collisions and save bandwidth.
 */
export default function HeaderBannerAd({ slotId, className = "", articleId, authorId }: HeaderBannerAdProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className={`w-full max-w-5xl mx-auto px-2 sm:px-4 pt-2 pb-1 sm:py-3 ${className}`}>
      <div className="w-full bg-white dark:bg-gray-900/70 border border-gray-200/70 dark:border-gray-800/70 rounded-xl sm:rounded-2xl py-1.5 px-2 sm:px-3 flex flex-col items-center justify-center text-center overflow-hidden shadow-sm">
        <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest text-gray-400/80 dark:text-gray-600/80 mb-1 select-none">
          Publicidad
        </span>

        {/* Desktop & Tablet: 728x90 Leaderboard */}
        {isMobile === false && (
          <div
            className="flex justify-center items-center w-full min-h-[90px] overflow-hidden"
            style={{ touchAction: "pan-y" }}
          >
            <AdSlotTracker placementId={slotId || "header-desktop-728x90"} adKey={ADSTERRA_KEYS.headerDesktop728x90} articleId={articleId} authorId={authorId}>
              <AdsterraAd adKey={ADSTERRA_KEYS.headerDesktop728x90} width={728} height={90} />
            </AdSlotTracker>
          </div>
        )}

        {/* Mobile: 320x50 Mobile Leaderboard */}
        {isMobile === true && (
          <div
            className="flex justify-center items-center w-full min-h-[50px] overflow-hidden"
            style={{ touchAction: "pan-y" }}
          >
            <AdSlotTracker placementId={slotId || "header-mobile-320x50"} adKey={ADSTERRA_KEYS.headerMobile320x50} articleId={articleId} authorId={authorId}>
              <AdsterraAd adKey={ADSTERRA_KEYS.headerMobile320x50} width={320} height={50} />
            </AdSlotTracker>
          </div>
        )}
      </div>
    </div>
  );
}
