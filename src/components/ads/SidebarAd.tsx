"use client";

import AdsterraNativeBanner from "./AdsterraNativeBanner";
import AdSlotTracker from "./AdSlotTracker";
import { ADSTERRA_KEYS } from "@/lib/adsterra-config";

interface SidebarAdProps {
  slotId?: string;
  className?: string;
}

export default function SidebarAd({ slotId, className = "" }: SidebarAdProps) {
  return (
    <div className={`w-full lg:sticky lg:top-20 ${className}`}>
      <div className="w-full min-h-[340px] lg:min-h-[880px] bg-white dark:bg-gray-900/70 border border-gray-200/70 dark:border-gray-800/70 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col items-center justify-start text-center overflow-hidden shadow-sm">
        <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest text-gray-400/80 dark:text-gray-600/80 mb-2.5 select-none">
          Publicidad recomendada
        </span>
        <div className="w-full flex-grow flex flex-col justify-start items-center">
          <AdSlotTracker placementId={slotId || "home-sidebar-native"} adKey={ADSTERRA_KEYS.nativeBanner}>
            <AdsterraNativeBanner />
          </AdSlotTracker>
        </div>
      </div>
    </div>
  );
}
