"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  ADSTERRA_ADS_ENABLED,
  ADSTERRA_KEYS,
  isAdsterraRouteAllowed,
} from "@/lib/adsterra-config";

interface AdsterraNativeBannerProps {
  className?: string;
  adKey?: string;
}

/**
 * Adsterra Native Banner ad component.
 * Supports configurable adKey per placement to allow independent bidding and avoid DOM container collisions.
 */
export default function AdsterraNativeBanner({ className = "", adKey }: AdsterraNativeBannerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const activeKey = adKey || ADSTERRA_KEYS.nativeBanner;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    if (!ADSTERRA_ADS_ENABLED || !isAdsterraRouteAllowed(pathname)) {
      wrapper.innerHTML = "";
      return;
    }

    wrapper.innerHTML = "";

    const containerId = `container-${activeKey}`;
    const existingContainer = document.getElementById(containerId);
    if (existingContainer && !wrapper.contains(existingContainer)) {
      return;
    }

    const container = document.createElement("div");
    container.id = containerId;
    wrapper.appendChild(container);

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = `https://pl31171503.profitableratecpmnetwork.com/${activeKey}/invoke.js`;
    wrapper.appendChild(script);

    return () => {
      wrapper.innerHTML = "";
    };
  }, [pathname, activeKey]);

  return (
    <div
      ref={wrapperRef}
      className={`adsterra-native-banner flex justify-center items-center overflow-hidden w-full max-w-full ${className}`}
    />
  );
}
