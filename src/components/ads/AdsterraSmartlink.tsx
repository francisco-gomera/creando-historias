"use client";

import { ADSTERRA_ADS_ENABLED, ADSTERRA_KEYS } from "@/lib/adsterra-config";
import { ExternalLink, Sparkles } from "lucide-react";

interface AdsterraSmartlinkProps {
  variant?: "card" | "button" | "banner";
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function AdsterraSmartlink({
  variant = "card",
  className = "",
  title = "Historias y temas destacados para ti",
  subtitle = "Explora contenido exclusivo y tendencias recomendadas por nuestros editores",
}: AdsterraSmartlinkProps) {
  const smartlinkUrl = ADSTERRA_KEYS.smartlinkUrl;

  // Si no hay enlace configurado o los anuncios están deshabilitados, no renderizar
  if (!ADSTERRA_ADS_ENABLED || !smartlinkUrl || smartlinkUrl.trim() === "") {
    return null;
  }

  if (variant === "button") {
    return (
      <a
        href={smartlinkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 group ${className}`}
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        <span>Descubrir más contenido</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
      </a>
    );
  }

  if (variant === "banner") {
    return (
      <a
        href={smartlinkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-500/30 hover:border-purple-400/60 shadow-md transition-all duration-300 hover:scale-[1.01] group ${className}`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-purple-400 transition">
                {title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold flex-shrink-0 group-hover:bg-purple-500 transition">
            <span>Ver</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </a>
    );
  }

  // Variant "card" por defecto
  return (
    <div
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-purple-200 dark:border-purple-900/50 bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-purple-950/20 dark:via-gray-900 dark:to-indigo-950/20 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Recomendado</span>
        </span>
        <span className="text-[9px] uppercase tracking-widest text-gray-400">Enlace patrocinado</span>
      </div>

      <h4 className="font-serif text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        {subtitle}
      </p>

      <a
        href={smartlinkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-xs transition hover:shadow-md active:scale-95 group"
      >
        <span>Explorar ahora</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
      </a>
    </div>
  );
}
