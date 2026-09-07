"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface AdSlotTrackerProps {
  placementId: string;
  adKey?: string;
  articleId?: string;
  authorId?: string;
  children: React.ReactNode;
  className?: string;
}

export default function AdSlotTracker({
  placementId,
  adKey,
  articleId,
  authorId,
  children,
  className = "",
}: AdSlotTrackerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    let tracked = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || entry.intersectionRatio < 0.5 || tracked) return;
        tracked = true;
        observer.disconnect();

        const payload = JSON.stringify({
          placementId,
          adKey,
          articleId,
          authorId,
          route: pathname,
        });

        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/analytics/ad-impression", new Blob([payload], { type: "application/json" }));
          return;
        }

        fetch("/api/analytics/ad-impression", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => undefined);
      },
      { threshold: [0.5] }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [adKey, articleId, authorId, pathname, placementId]);

  return (
    <div ref={ref} className={className} data-ad-placement={placementId}>
      {children}
    </div>
  );
}
