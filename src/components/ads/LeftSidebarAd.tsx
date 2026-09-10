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

  return (
    <div className={`w-full ${className}`}>
      <SidebarDesktopBanners
        prefix={mobile ? "article-mobile-below-content" : "article-left-sidebar"}
        articleId={articleId}
        authorId={authorId}
      />
    </div>
  );
}
