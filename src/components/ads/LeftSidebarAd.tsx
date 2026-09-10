"use client";

import AdsterraAd from "./AdsterraAd";
import AdSlotTracker from "./AdSlotTracker";
import { ADSTERRA_KEYS, ADSTERRA_LAYOUT } from "@/lib/adsterra-config";

import SidebarDesktopBanners from "./SidebarDesktopBanners";

interface LeftSidebarAdProps {
  className?: string;
  mobile?: boolean;
  articleId?: string;
  authorId?: string;
}

export default function LeftSidebarAd({ className = "", mobile = false, articleId, authorId }: LeftSidebarAdProps) {
  if (mobile && !ADSTERRA_LAYOUT.showBelowArticleMobileAds) return null;

  if (mobile) {
    return (
      <div className={`w-full ${className}`}>
        <div className="w-full bg-white dark:bg-gray-900/70 border border-gray-200/70 dark:border-gray-800/70 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col items-center justify-start text-center overflow-hidden shadow-sm">
          <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest text-gray-400/80 dark:text-gray-600/80 mb-2.5 select-none">
            Publicidad
          </span>

          <div className="w-full flex flex-col items-center gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={`mobile-below-content-ad-${index}`}
                className="w-full max-w-[320px] rounded-lg border border-gray-100/80 dark:border-gray-800/80 bg-gray-50/70 dark:bg-gray-950/30 p-1.5 overflow-hidden"
              >
                <div className="flex h-[50px] w-full items-center justify-center overflow-hidden">
                  <AdSlotTracker
                    placementId={`article-mobile-below-content-${index + 1}`}
                    adKey={ADSTERRA_KEYS.headerMobile320x50}
                    articleId={articleId}
                    authorId={authorId}
                  >
                    <AdsterraAd adKey={ADSTERRA_KEYS.headerMobile320x50} width={320} height={50} />
                  </AdSlotTracker>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desktop left sidebar: todos los tamaños de banner apilados
  return (
    <div className={`w-full ${className}`}>
      <SidebarDesktopBanners prefix="article-left-sidebar" articleId={articleId} authorId={authorId} />
    </div>
  );
}
