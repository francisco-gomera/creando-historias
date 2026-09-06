"use client";

import { useEffect, useState } from "react";
import AdsterraAd from "./AdsterraAd";
import { ADSTERRA_KEYS } from "@/lib/adsterra-config";

interface InContentAdProps {
  slotId?: string;
  format?: string;
  className?: string;
  index?: number;
}

/**
 * In-Content Ad placement for article body.
 * Mobile-first in-content placement.
 * Renders two stacked Adsterra banners per ad card for stronger fill inside articles.
 */
export default function InContentAd({ slotId, format, className = "", index = 0 }: InContentAdProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile === null) return null;

  const adConfig = isMobile
    ? {
        key: ADSTERRA_KEYS.headerMobile320x50,
        width: 320,
        height: 50,
      }
    : {
        key: ADSTERRA_KEYS.headerDesktop728x90,
        width: 728,
        height: 90,
      };

  return (
    <div className={`w-full my-5 sm:my-8 flex justify-center ${className}`}>
      <div
        className="inline-flex max-w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-200/70 bg-white p-1.5 text-center shadow-sm dark:border-gray-800/70 dark:bg-gray-900/70 sm:p-2"
        style={{ width: adConfig.width + 16 }}
      >
        <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1 select-none">
          Publicidad
        </span>
        <div
          className="flex max-w-full items-center justify-center overflow-hidden"
          style={{ width: adConfig.width, height: adConfig.height }}
        >
          <AdsterraAd
            adKey={adConfig.key}
            width={adConfig.width}
            height={adConfig.height}
          />
        </div>
        <div
          className="mt-1.5 flex max-w-full items-center justify-center overflow-hidden"
          style={{ width: adConfig.width, height: adConfig.height }}
        >
          <AdsterraAd
            adKey={adConfig.key}
            width={adConfig.width}
            height={adConfig.height}
          />
        </div>
      </div>
    </div>
  );
}
