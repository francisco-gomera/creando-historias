"use client";

import AdsterraAd from "./AdsterraAd";
import AdSlotTracker from "./AdSlotTracker";
import { ADSTERRA_KEYS } from "@/lib/adsterra-config";

interface SidebarDesktopBannersProps {
  prefix?: string;
  articleId?: string;
  authorId?: string;
  className?: string;
}

/**
 * SidebarDesktopBanners
 * Stacks all desktop-compatible Adsterra banner formats underneath the primary widget:
 * 1. 300x250 (Robapáginas / Medium Rectangle)
 * 2. 160x600 (Rascacielos / Wide Skyscraper)
 * 3. 160x300 (Medio rascacielos / Vertical Banner)
 * 4. 320x50 (Banner horizontal compacto)
 * 5. 468x60 (Banner completo adaptado al ancho del lateral)
 */
export default function SidebarDesktopBanners({
  prefix = "sidebar",
  articleId,
  authorId,
  className = "",
}: SidebarDesktopBannersProps) {
  return (
    <div className={`hidden lg:flex flex-col items-center w-full space-y-5 ${className}`}>
      {/* 300x250 - Robapáginas / Medium Rectangle */}
      <div className="w-full bg-white dark:bg-gray-900/70 border border-gray-200/70 dark:border-gray-800/70 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center overflow-hidden shadow-sm">
        <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest text-gray-400/80 dark:text-gray-600/80 mb-2 select-none">
          Publicidad
        </span>
        <div className="w-[300px] h-[250px] max-w-full flex items-center justify-center overflow-hidden">
          <AdSlotTracker
            placementId={`${prefix}-banner-300x250`}
            adKey={ADSTERRA_KEYS.banner300x250}
            articleId={articleId}
            authorId={authorId}
          >
            <AdsterraAd
              adKey={ADSTERRA_KEYS.banner300x250}
              width={300}
              height={250}
            />
          </AdSlotTracker>
        </div>
      </div>

      {/* 160x600 - Rascacielos / Wide Skyscraper */}
      <div className="w-full bg-white dark:bg-gray-900/70 border border-gray-200/70 dark:border-gray-800/70 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center overflow-hidden shadow-sm">
        <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest text-gray-400/80 dark:text-gray-600/80 mb-2 select-none">
          Publicidad
        </span>
        <div className="w-[160px] h-[600px] max-w-full flex items-center justify-center overflow-hidden">
          <AdSlotTracker
            placementId={`${prefix}-banner-160x600`}
            adKey={ADSTERRA_KEYS.banner160x600}
            articleId={articleId}
            authorId={authorId}
          >
            <AdsterraAd
              adKey={ADSTERRA_KEYS.banner160x600}
              width={160}
              height={600}
            />
          </AdSlotTracker>
        </div>
      </div>

      {/* 160x300 - Medio Rascacielos / Vertical */}
      <div className="w-full bg-white dark:bg-gray-900/70 border border-gray-200/70 dark:border-gray-800/70 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center overflow-hidden shadow-sm">
        <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest text-gray-400/80 dark:text-gray-600/80 mb-2 select-none">
          Publicidad
        </span>
        <div className="w-[160px] h-[300px] max-w-full flex items-center justify-center overflow-hidden">
          <AdSlotTracker
            placementId={`${prefix}-banner-160x300`}
            adKey={ADSTERRA_KEYS.banner160x300}
            articleId={articleId}
            authorId={authorId}
          >
            <AdsterraAd
              adKey={ADSTERRA_KEYS.banner160x300}
              width={160}
              height={300}
            />
          </AdSlotTracker>
        </div>
      </div>

      {/* 320x50 - Banner Horizontal */}
      <div className="w-full bg-white dark:bg-gray-900/70 border border-gray-200/70 dark:border-gray-800/70 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center overflow-hidden shadow-sm">
        <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest text-gray-400/80 dark:text-gray-600/80 mb-2 select-none">
          Publicidad
        </span>
        <div className="w-full max-w-[320px] h-[50px] flex items-center justify-center overflow-hidden">
          <AdSlotTracker
            placementId={`${prefix}-banner-320x50`}
            adKey={ADSTERRA_KEYS.headerMobile320x50}
            articleId={articleId}
            authorId={authorId}
          >
            <AdsterraAd
              adKey={ADSTERRA_KEYS.headerMobile320x50}
              width={320}
              height={50}
            />
          </AdSlotTracker>
        </div>
      </div>

      {/* 468x60 - Banner Completo Escalado a 300px */}
      <div className="w-full bg-white dark:bg-gray-900/70 border border-gray-200/70 dark:border-gray-800/70 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center overflow-hidden shadow-sm">
        <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest text-gray-400/80 dark:text-gray-600/80 mb-2 select-none">
          Publicidad
        </span>
        <div className="w-full max-w-[300px] h-[45px] flex items-center justify-center overflow-hidden">
          <div className="w-[468px] h-[60px] transform scale-[0.62] origin-center -my-2.5 shrink-0 flex items-center justify-center">
            <AdSlotTracker
              placementId={`${prefix}-banner-468x60`}
              adKey={ADSTERRA_KEYS.display468x60}
              articleId={articleId}
              authorId={authorId}
            >
              <AdsterraAd
                adKey={ADSTERRA_KEYS.display468x60}
                width={468}
                height={60}
              />
            </AdSlotTracker>
          </div>
        </div>
      </div>
    </div>
  );
}
