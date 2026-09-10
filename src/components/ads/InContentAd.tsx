"use client";

import { useEffect, useState } from "react";
import AdsterraAd from "./AdsterraAd";
import AdSlotTracker from "./AdSlotTracker";
import { ADSTERRA_KEYS } from "@/lib/adsterra-config";

interface InContentAdProps {
  slotId?: string;
  format?: string;
  className?: string;
  index?: number;
  articleId?: string;
  authorId?: string;
}


/**
 * In-Content Ad placement for article body.
 * Mobile-first in-content placement.
 * Renders two stacked Adsterra banners per ad card for stronger fill inside articles.
 */
export default function InContentAd({ slotId, format, className = "", index = 0, articleId, authorId }: InContentAdProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile === null) return null;

  const ad1 = isMobile
    ? { key: ADSTERRA_KEYS.banner300x250, width: 300, height: 250 }
    : { key: ADSTERRA_KEYS.headerDesktop728x90, width: 728, height: 90 };

  const ad2 = isMobile
    ? { key: ADSTERRA_KEYS.headerMobile320x50, width: 320, height: 50 }
    : { key: ADSTERRA_KEYS.display468x60, width: 468, height: 60 };

  return (
    <div className={`w-full my-5 sm:my-8 flex justify-center ${className}`}>
      <div
        className="inline-flex max-w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-200/70 bg-white p-1.5 text-center shadow-sm dark:border-gray-800/70 dark:bg-gray-900/70 sm:p-2"
        style={{ width: ad1.width + 16 }}
      >
        <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1 select-none">
          Publicidad
        </span>
        <AdSlotTracker placementId={slotId || `article-in-content-${index + 1}-a`} adKey={ad1.key} articleId={articleId} authorId={authorId}>
          <div className="flex max-w-full items-center justify-center overflow-hidden" style={{ width: ad1.width, height: ad1.height }}>
            <AdsterraAd adKey={ad1.key} width={ad1.width} height={ad1.height} />
          </div>
        </AdSlotTracker>
        <div
          className="mt-2 flex max-w-full items-center justify-center overflow-hidden"
          style={{ width: ad2.width, height: ad2.height }}
        >
          <AdSlotTracker placementId={slotId || `article-in-content-${index + 1}-b`} adKey={ad2.key} articleId={articleId} authorId={authorId}>
            <AdsterraAd adKey={ad2.key} width={ad2.width} height={ad2.height} />
          </AdSlotTracker>
        </div>
      </div>
    </div>
  );
}
