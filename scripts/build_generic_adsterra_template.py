import re

def build_template():
    with open("tema_blogger_moderno.xml", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Configuración Centralizada de Adsterra y Script Motor
    adsterra_config_and_script = """
    <!-- =========================================================================
         ⚙️ PANEL DE CONFIGURACIÓN CENTRALIZADA DE ADSTERRA (PLANTILLA GENÉRICA)
         Instrucciones: Solo debes cambiar las claves (keys) entre comillas por las
         de tu cuenta de Adsterra. Si no usas algún tipo de anuncio, déjalo como "".
         ========================================================================= -->
    <script type='text/javascript'>
    //<![CDATA[
    window.ADSTERRA_CONFIG = {
      // 1. Banner Nativo Superior (Header Native Banner)
      nativeBannerKey: "666fc12a09a07ad15eeca1a70b387d4b",
      nativeBannerDomain: "pl31171503.profitableratecpmnetwork.com",

      // 2. Banner Responsivo: Desktop (728x90) y Móvil (320x50)
      // Se muestra en cabecera y dentro de los artículos
      desktopLeaderboard728x90: "7dc4efd221856c7cc01bfcaa22b2c289",
      mobileBanner320x50: "38e93328cc31a4d67bb5967d1a57b595",

      // 3. Banner Flotante Fijo Inferior en Celulares (Sticky Mobile Ad con botón 'X')
      mobileStickyKey: "6dbb818f76a41d9fd7b276a64638934f",
      mobileStickyWidth: 468,
      mobileStickyHeight: 60,

      // 4. Anuncios dentro del contenido de los artículos (In-Content)
      enableInContentAds: true,
      paragraphsBetweenAds: 4,
      maxInContentAds: 5,

      // 5. Social Bar (Opcional - Formato push flotante)
      socialBarUrl: "",

      // 6. Popunder (Opcional - Ventana emergente)
      popunderUrl: ""
    };
    //]]>
    </script>

    <!-- MOTOR DE CARGA DINÁMICA DE ANUNCIOS ADSTERRA -->
    <script type='text/javascript'>
    //<![CDATA[
    (function () {
      var cfg = window.ADSTERRA_CONFIG || {};
      var displayQueue = Promise.resolve();

      function createScript(src, async) {
        var script = document.createElement("script");
        script.src = src;
        script.async = typeof async === "boolean" ? async : false;
        return script;
      }

      function loadDisplay(slot, key, width, height) {
        if (!slot || !key || key.trim() === "" || slot.getAttribute("data-adsterra-loaded") === "true") return;
        slot.setAttribute("data-adsterra-loaded", "true");
        slot.innerHTML = "";

        displayQueue = displayQueue.catch(function () {}).then(function () {
          return new Promise(function (resolve) {
            if (!document.documentElement.contains(slot)) {
              resolve();
              return;
            }

            window.atOptions = {
              key: key,
              format: "iframe",
              height: height,
              width: width,
              params: {}
            };

            var invoke = createScript("https://wailsilence.com/" + key + "/invoke.js");
            invoke.onload = resolve;
            invoke.onerror = resolve;
            slot.appendChild(invoke);
          });
        });
      }

      function loadResponsiveSlots(root) {
        var isMobile = window.innerWidth < 640;
        var key = isMobile ? (cfg.mobileBanner320x50 || cfg.desktopLeaderboard728x90) : (cfg.desktopLeaderboard728x90 || cfg.mobileBanner320x50);
        if (!key || key.trim() === "") return;

        var width = isMobile ? 320 : 728;
        var height = isMobile ? 50 : 90;
        var scope = root || document;

        scope.querySelectorAll("[data-adsterra-responsive='leaderboard']").forEach(function (slot) {
          loadDisplay(slot, key, width, height);
        });
      }

      function loadNative() {
        var key = cfg.nativeBannerKey;
        if (!key || key.trim() === "") return;

        var slot = document.querySelector(".js-adsterra-native-header, [data-adsterra-native='true']");
        if (!slot || slot.getAttribute("data-adsterra-loaded") === "true") return;
        slot.setAttribute("data-adsterra-loaded", "true");
        slot.innerHTML = "";

        var container = document.createElement("div");
        container.id = "container-" + key;
        slot.appendChild(container);

        var domain = cfg.nativeBannerDomain || "pl31171503.profitableratecpmnetwork.com";
        var invoke = document.createElement("script");
        invoke.async = true;
        invoke.setAttribute("data-cfasync", "false");
        invoke.src = "https://" + domain + "/" + key + "/invoke.js";
        slot.appendChild(invoke);
      }

      function makeCard(label) {
        var card = document.createElement("div");
        card.className = "blogger-ad-card";

        var text = document.createElement("span");
        text.className = "blogger-ad-label";
        text.textContent = label || "Publicidad recomendada";
        card.appendChild(text);

        for (var i = 0; i < 2; i += 1) {
          var slot = document.createElement("div");
          slot.className = "blogger-ad-slot";
          slot.setAttribute("data-adsterra-responsive", "leaderboard");
          card.appendChild(slot);
        }

        return card;
      }

      function injectArticleAds() {
        if (!cfg.enableInContentAds) return;
        if (!document.body.classList.contains("item-view")) return;

        var content = document.querySelector(".post-body.entry-content, .post-body, article .post-body");
        if (!content || content.getAttribute("data-adsterra-in-content") === "true") return;
        content.setAttribute("data-adsterra-in-content", "true");

        var blocks = Array.prototype.filter.call(content.children, function (node) {
          return /^(P|DIV)$/i.test(node.tagName) && node.textContent.trim().length > 50;
        });
        if (blocks.length < 2) return;

        var step = cfg.paragraphsBetweenAds || 4;
        var maxAds = cfg.maxInContentAds || 5;
        var inserted = 0;

        for (var index = 1; index < blocks.length && inserted < maxAds; index += step) {
          var wrap = document.createElement("div");
          wrap.className = "blogger-in-content-ad";
          wrap.appendChild(makeCard("Publicidad recomendada"));
          blocks[index].insertAdjacentElement("afterend", wrap);
          loadResponsiveSlots(wrap);
          inserted += 1;
        }
      }

      function createSticky() {
        var key = cfg.mobileStickyKey || cfg.mobileBanner320x50;
        if (!key || key.trim() === "") return;
        if (window.innerWidth >= 1024 || document.getElementById("blogger-adsterra-sticky")) return;

        var sticky = document.createElement("div");
        sticky.id = "blogger-adsterra-sticky";
        sticky.className = "blogger-sticky-ad is-visible";

        var close = document.createElement("button");
        close.className = "blogger-sticky-close";
        close.type = "button";
        close.setAttribute("aria-label", "Cerrar anuncio");
        close.innerHTML = "&times;";
        close.onclick = function () {
          sticky.className = "blogger-sticky-ad";
        };
        sticky.appendChild(close);

        var card = document.createElement("div");
        card.className = "blogger-ad-card";
        var slot = document.createElement("div");
        slot.className = "blogger-ad-slot";
        card.appendChild(slot);
        sticky.appendChild(card);
        document.body.appendChild(sticky);

        var w = cfg.mobileStickyWidth || 320;
        var h = cfg.mobileStickyHeight || 50;
        loadDisplay(slot, key, w, h);
      }

      function loadOptionalScripts() {
        if (cfg.popunderUrl && cfg.popunderUrl.trim() !== "") {
          var sPop = createScript(cfg.popunderUrl, true);
          document.head.appendChild(sPop);
        }
        if (cfg.socialBarUrl && cfg.socialBarUrl.trim() !== "") {
          var sSoc = createScript(cfg.socialBarUrl, true);
          document.head.appendChild(sSoc);
        }
      }

      function hydrateAds() {
        loadResponsiveSlots(document);
        loadNative();
        injectArticleAds();
        createSticky();
        loadOptionalScripts();
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", hydrateAds);
      } else {
        hydrateAds();
      }
    }());
    //]]>
    </script>
"""

    # 2. Estilos CSS para Adsterra
    adsterra_css = """
/* ==========================================================================
   SISTEMA DE ANUNCIOS ADSTERRA (DISTRIBUCIÓN GENÉRICA)
   ========================================================================== */
.blogger-ad-top {
  width: 100%;
  max-width: 1180px;
  margin: 12px auto 20px;
  padding: 0 12px;
  box-sizing: border-box;
}
.blogger-ad-top .blogger-ad-card {
  max-width: 1120px;
}
.blogger-ad-top .blogger-ad-slot {
  max-width: 100%;
}
.blogger-native-header-ad {
  min-height: 320px;
  padding: 12px;
}
.blogger-native-header-ad .blogger-ad-slot {
  min-height: 300px;
}
.blogger-ad-card {
  box-sizing: border-box;
  width: 100%;
  max-width: 744px;
  margin: 0 auto;
  padding: 8px 12px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-align: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}
.blogger-ad-label {
  display: block;
  margin: 0 0 6px;
  color: #94a3b8;
  font: 700 9px/1.2 'Segoe UI', Roboto, sans-serif;
  letter-spacing: .08em;
  text-transform: uppercase;
  pointer-events: none;
}
.blogger-ad-slot {
  width: 100%;
  max-width: 728px;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  touch-action: pan-y;
}
.blogger-ad-slot iframe,
.blogger-sticky-ad iframe {
  max-width: 100% !important;
  touch-action: pan-y;
}
.blogger-ad-slot iframe[width="728"][height="90"] {
  width: 728px !important;
  height: 90px !important;
}
.blogger-ad-slot iframe[width="468"][height="60"] {
  width: 468px !important;
  height: 60px !important;
}
.blogger-ad-slot iframe[width="320"][height="50"] {
  width: 320px !important;
  height: 50px !important;
}
.blogger-in-content-ad {
  margin: 28px auto;
  clear: both;
}
.blogger-in-content-ad .blogger-ad-card {
  gap: 6px;
}
.blogger-native-ad {
  max-width: 100%;
  min-height: 320px;
  align-items: stretch;
  justify-content: flex-start;
}
.blogger-native-ad .blogger-ad-slot {
  max-width: 100%;
  min-height: 300px;
  align-items: stretch;
}

/* Reglas genéricas para Native Banners de Adsterra (compatibles con cualquier clave) */
[id^="container-"] {
  width: 100% !important;
  min-height: 300px !important;
}
[class*="__stand"] {
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
  width: 100% !important;
}
[class*="__bn-container"] {
  width: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  border-radius: 12px !important;
  overflow: hidden !important;
  background: rgba(255, 255, 255, .95) !important;
  border: 1px solid #e2e8f0 !important;
  padding: 10px !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .04) !important;
}
[class*="__img-container"] {
  width: 100% !important;
  height: 135px !important;
  border-radius: 10px !important;
  overflow: hidden !important;
}
[class*="__img"] {
  width: 100% !important;
  height: 100% !important;
  background-size: cover !important;
  background-position: center !important;
}
[class*="__title"] {
  width: 100% !important;
  margin-top: 8px !important;
  padding: 0 2px !important;
  color: #0f172a !important;
  font-size: 13px !important;
  line-height: 1.35 !important;
  font-weight: 700 !important;
  text-align: left !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
}
[class*="__link"] {
  position: absolute !important;
  inset: 0 !important;
  z-index: 10 !important;
}
@media (min-width: 640px) {
  [class*="__stand"] {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 16px !important;
  }
}
@media (min-width: 960px) {
  [class*="__stand"] {
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  }
}

/* Anuncio Sticky flotante en móvil */
.blogger-sticky-ad {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: none;
  justify-content: center;
  align-items: center;
  padding: 4px 34px 6px 8px;
  background: rgba(255, 255, 255, .96);
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -8px 24px rgba(15, 23, 42, .12);
  box-sizing: border-box;
}
.blogger-sticky-ad.is-visible {
  display: flex;
}
.blogger-sticky-ad .blogger-ad-card {
  max-width: 486px;
  padding: 4px 8px;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  background: transparent;
}
.blogger-sticky-close {
  position: absolute;
  top: 6px;
  right: 8px;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 50%;
  background: #f1f5f9;
  color: #475569;
  font: 700 16px/24px Arial, sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.blogger-sticky-close:hover {
  background: #e2e8f0;
  color: #0f172a;
}
@media (max-width: 639px) {
  .blogger-ad-card {
    max-width: 340px;
    padding: 6px 8px 8px;
    border-radius: 12px;
  }
  .blogger-sticky-ad {
    padding: 4px 28px 4px 4px;
  }
}
"""

    # Inyectar CSS de Adsterra al final de b:skin antes de ]]>
    skin_end = content.find("]]></b:skin>")
    if skin_end != -1:
        content = content[:skin_end] + "\n" + adsterra_css + "\n" + content[skin_end:]

    # Inyectar la configuración y el motor de Adsterra antes de </head>
    head_end = content.find("</head>")
    if head_end != -1:
        content = content[:head_end] + "\n" + adsterra_config_and_script + "\n" + content[head_end:]

    # Inyectar el banner superior nativo justo después del inicio del body
    # buscamos <b:include name='skipNavigation'/>
    skip_nav = "<b:include name='skipNavigation'/>"
    top_banner_html = """
    <!-- BANNER SUPERIOR NATIVO DE ADSTERRA -->
    <div class='blogger-ad-top'>
      <div class='blogger-ad-card blogger-native-ad blogger-native-header-ad'>
        <span class='blogger-ad-label'>Publicidad recomendada</span>
        <div class='blogger-ad-slot js-adsterra-native-header'></div>
      </div>
    </div>
"""
    if skip_nav in content:
        content = content.replace(skip_nav, top_banner_html + "\n    " + skip_nav)

    with open("tema_blogger_generico_adsterra.xml", "w", encoding="utf-8") as f:
        f.write(content)

    print("Archivo tema_blogger_generico_adsterra.xml generado exitosamente!")

if __name__ == "__main__":
    build_template()
