"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ADSTERRA_ADS_ENABLED,
  ADSTERRA_INTRUSIVE_FORMATS_ENABLED,
  ADSTERRA_KEYS,
  isAdsterraRouteAllowed,
} from "@/lib/adsterra-config";

const POPUNDER_STORAGE_KEY = "adsterra_popunder_last_shown";
const POPUNDER_COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 horas de enfriamiento

function appendAdsterraScript(id: string, src: string) {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.setAttribute("data-cfasync", "false");
  script.src = src;
  document.body.appendChild(script);
}

function shouldLoadPopunder(): boolean {
  try {
    if (typeof window === "undefined") return false;
    // 1. Si ya se disparó en la sesión/pestaña actual, no volver a cargarlo
    if (sessionStorage.getItem("adsterra_popunder_session_fired") === "true") {
      return false;
    }
    // 2. Control de enfriamiento para no repetir al recargar o reabrir
    const lastShown = localStorage.getItem(POPUNDER_STORAGE_KEY);
    if (lastShown) {
      const elapsed = Date.now() - parseInt(lastShown, 10);
      if (elapsed < POPUNDER_COOLDOWN_MS) {
        return false;
      }
    }
  } catch {
    // Si cookies o storage están bloqueados
  }
  return true;
}

function markPopunderFired() {
  try {
    localStorage.setItem(POPUNDER_STORAGE_KEY, Date.now().toString());
    sessionStorage.setItem("adsterra_popunder_session_fired", "true");
  } catch {}
}

export default function PublicAdScripts() {
  const pathname = usePathname();

  useEffect(() => {
    if (!ADSTERRA_ADS_ENABLED || !isAdsterraRouteAllowed(pathname)) return;
    if (!ADSTERRA_INTRUSIVE_FORMATS_ENABLED) return;

    // Social Bar (e Interstitial): Activo en todos los dispositivos (móvil, tablet y escritorio)
    appendAdsterraScript("adsterra-social-bar", ADSTERRA_KEYS.socialBarScript);

    // Popunder controlado: Disponible en móvil y escritorio con protección anti-secuestro de clics
    if (!shouldLoadPopunder()) {
      return;
    }

    const isMobile = window.innerWidth < 1024;

    const setupPopunder = () => {
      appendAdsterraScript("adsterra-popunder", ADSTERRA_KEYS.popunderScript);

      const handleFirstInteraction = () => {
        markPopunderFired();
        // En móviles, remover el nodo del script tras 2 segundos para liberar los clics posteriores
        if (isMobile) {
          setTimeout(() => {
            const el = document.getElementById("adsterra-popunder");
            if (el) el.remove();
          }, 2000);
        }
        window.removeEventListener("click", handleFirstInteraction, true);
        window.removeEventListener("touchend", handleFirstInteraction, true);
      };

      window.addEventListener("click", handleFirstInteraction, true);
      window.addEventListener("touchend", handleFirstInteraction, true);
    };

    // En móviles damos 2.5 segundos de cortesía para que el usuario pueda empezar a leer sin interrupciones inmediatas
    let timer: NodeJS.Timeout | null = null;
    if (isMobile) {
      timer = setTimeout(setupPopunder, 2500);
    } else {
      setupPopunder();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
