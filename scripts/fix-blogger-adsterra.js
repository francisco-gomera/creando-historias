const fs = require("fs");
const path = require("path");

const file = path.resolve(__dirname, "..", "blogger-adsterra-fixed.xml");
let xml = fs.readFileSync(file, "utf8");

const css = `

/* Adsterra layout ported from Proyecto Adsense */
.blogger-ad-top {
  width: 100%;
  max-width: 960px;
  margin: 12px auto 18px;
  padding: 0 8px;
  box-sizing: border-box;
}
.blogger-ad-card {
  box-sizing: border-box;
  width: 100%;
  max-width: 744px;
  margin: 0 auto;
  padding: 6px 8px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-align: center;
  background: #fff;
  border: 1px solid rgba(229, 231, 235, .9);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .06);
}
.blogger-ad-label {
  display: block;
  margin: 0 0 5px;
  color: #9ca3af;
  font: 700 9px/1.2 Roboto, sans-serif;
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
}
.blogger-native-ad {
  max-width: 100%;
  min-height: 340px;
  align-items: stretch;
  justify-content: flex-start;
}
.blogger-native-ad .blogger-ad-slot {
  max-width: 100%;
  min-height: 320px;
  align-items: stretch;
}
#container-666fc12a09a07ad15eeca1a70b387d4b {
  width: 100% !important;
  min-height: 320px !important;
}
[class*="container-666fc12a09a07ad15eeca1a70b387d4b__stand"] {
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
  width: 100% !important;
}
[class*="container-666fc12a09a07ad15eeca1a70b387d4b__bn-container"] {
  width: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  border-radius: 12px !important;
  overflow: hidden !important;
  background: rgba(255, 255, 255, .9) !important;
  border: 1px solid rgba(229, 231, 235, .9) !important;
  padding: 8px !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .05) !important;
}
[class*="container-666fc12a09a07ad15eeca1a70b387d4b__img-container"] {
  width: 100% !important;
  height: 135px !important;
  border-radius: 10px !important;
  overflow: hidden !important;
}
[class*="container-666fc12a09a07ad15eeca1a70b387d4b__img"] {
  width: 100% !important;
  height: 100% !important;
  background-size: cover !important;
  background-position: center !important;
}
[class*="container-666fc12a09a07ad15eeca1a70b387d4b__title"] {
  width: 100% !important;
  margin-top: 8px !important;
  padding: 0 2px !important;
  color: #111827 !important;
  font-size: 13px !important;
  line-height: 1.35 !important;
  font-weight: 700 !important;
  text-align: left !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
}
[class*="container-666fc12a09a07ad15eeca1a70b387d4b__link"] {
  position: absolute !important;
  inset: 0 !important;
  z-index: 10 !important;
}
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
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -10px 28px rgba(17, 24, 39, .16);
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
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 999px;
  background: #f3f4f6;
  color: #6b7280;
  font: 700 16px/22px Arial, sans-serif;
  cursor: pointer;
}
@media (max-width: 639px) {
  .blogger-ad-card {
    max-width: 338px;
    padding: 5px 7px 7px;
    border-radius: 10px;
  }
  .blogger-ad-slot {
    max-width: 320px;
  }
  .blogger-in-content-ad {
    margin: 22px auto;
  }
  [class*="container-666fc12a09a07ad15eeca1a70b387d4b__img-container"] {
    height: 112px !important;
  }
}
@media (min-width: 1024px) {
  .blogger-native-ad {
    min-height: 760px;
  }
  .blogger-native-ad .blogger-ad-slot,
  #container-666fc12a09a07ad15eeca1a70b387d4b {
    min-height: 720px !important;
  }
}
`;

const helperScript = `
    <script>
//<![CDATA[
(function () {
  var keys = {
    display468x60: "6dbb818f76a41d9fd7b276a64638934f",
    headerDesktop728x90: "7dc4efd221856c7cc01bfcaa22b2c289",
    headerMobile320x50: "38e93328cc31a4d67bb5967d1a57b595",
    nativeBanner: "666fc12a09a07ad15eeca1a70b387d4b"
  };
  var displayQueue = Promise.resolve();

  function createScript(src) {
    var script = document.createElement("script");
    script.src = src;
    script.async = false;
    return script;
  }

  function loadDisplay(slot, key, width, height) {
    if (!slot || slot.getAttribute("data-adsterra-loaded") === "true") return;
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
    var key = isMobile ? keys.headerMobile320x50 : keys.headerDesktop728x90;
    var width = isMobile ? 320 : 728;
    var height = isMobile ? 50 : 90;
    var scope = root || document;

    scope.querySelectorAll("[data-adsterra-responsive='leaderboard']").forEach(function (slot) {
      loadDisplay(slot, key, width, height);
    });
  }

  function loadNative() {
    var slot = document.querySelector("[data-adsterra-native='true']");
    if (!slot || slot.getAttribute("data-adsterra-loaded") === "true") return;
    slot.setAttribute("data-adsterra-loaded", "true");
    slot.innerHTML = "";

    var container = document.createElement("div");
    container.id = "container-" + keys.nativeBanner;
    slot.appendChild(container);

    var invoke = document.createElement("script");
    invoke.async = true;
    invoke.setAttribute("data-cfasync", "false");
    invoke.src = "https://pl31171503.profitableratecpmnetwork.com/" + keys.nativeBanner + "/invoke.js";
    slot.appendChild(invoke);
  }

  function makeCard(label, kind) {
    var card = document.createElement("div");
    card.className = "blogger-ad-card " + (kind || "");

    var text = document.createElement("span");
    text.className = "blogger-ad-label";
    text.textContent = label;
    card.appendChild(text);

    var slot = document.createElement("div");
    slot.className = "blogger-ad-slot";
    slot.setAttribute("data-adsterra-responsive", "leaderboard");
    card.appendChild(slot);

    return card;
  }

  function injectArticleAds() {
    if (!document.body.classList.contains("item-view")) return;

    var content = document.querySelector(".post-body.entry-content, .post-body, article .post-body");
    if (!content || content.getAttribute("data-adsterra-in-content") === "true") return;
    content.setAttribute("data-adsterra-in-content", "true");

    var blocks = Array.prototype.filter.call(content.children, function (node) {
      return /^(P|DIV)$/i.test(node.tagName) && node.textContent.trim().length > 60;
    });
    if (blocks.length < 3) return;

    var inserted = 0;
    for (var index = 1; index < blocks.length && inserted < 5; index += 5) {
      var wrap = document.createElement("div");
      wrap.className = "blogger-in-content-ad";
      wrap.appendChild(makeCard("Publicidad", ""));
      blocks[index].insertAdjacentElement("afterend", wrap);
      loadResponsiveSlots(wrap);
      inserted += 1;
    }
  }

  function createSticky() {
    if (window.innerWidth >= 1024 || document.getElementById("blogger-adsterra-sticky")) return;

    var sticky = document.createElement("div");
    sticky.id = "blogger-adsterra-sticky";
    sticky.className = "blogger-sticky-ad is-visible";

    var close = document.createElement("button");
    close.className = "blogger-sticky-close";
    close.type = "button";
    close.setAttribute("aria-label", "Cerrar anuncio");
    close.textContent = "x";
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

    loadDisplay(slot, keys.display468x60, 468, 60);
  }

  function hydrateAds() {
    loadResponsiveSlots(document);
    loadNative();
    injectArticleAds();
    createSticky();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hydrateAds);
  } else {
    hydrateAds();
  }
}());
//]]>
    </script>`;

const topSlot = `
    <div class='blogger-ad-top'>
      <div class='blogger-ad-card'>
        <span class='blogger-ad-label'>Publicidad</span>
        <div class='blogger-ad-slot' data-adsterra-responsive='leaderboard'/>
      </div>
    </div>`;

xml = xml.replace(
  /\s*<script async='async' data-cfasync='false' src='https:\/\/wailsilence\.com\/4fba865c26acc098d8ec6e1b07d7c2e6\/invoke\.js'\/>\s*/g,
  "\n"
);
xml = xml.replace(
  /\s*<script src='https:\/\/wailsilence\.com\/77\/3b\/99\/773b991f34f1eed5a26702fcf381ddbb\.js'\/>\s*/g,
  "\n"
);
xml = xml.replace(
  /\s*<script src='https:\/\/wailsilence\.com\/e3\/06\/83\/e306837ae4a50c6b6d01cac9f0d37cc7\.js'\/>\s*/g,
  "\n"
);
xml = xml.replace(
  /\s*<a href='https:\/\/wailsilence\.com\/a3qs01vu49\?key=8a5a48df96ccdf9869ab2c26d12e5b18' rel='noopener noreferrer' target='_blank'>[\s\S]*?<\/a>\s*/g,
  "\n"
);

xml = xml.replace(
  /\s*<script>\s*atOptions = \{[\s\S]*?98d5e298bab5736f40fa7666b0a43356\/invoke\.js'\/>\s*/m,
  "\n" + topSlot + "\n"
);

xml = xml.replace("]]></b:skin>", css + "\n]]></b:skin>");
xml = xml.replace("</head>", helperScript + "\n  </head>");

xml = xml.replace(
  /<b:widget-setting name='content'><!\[CDATA\[<script async="async" data-cfasync="false" src="https:\/\/wailsilence\.com\/4fba865c26acc098d8ec6e1b07d7c2e6\/invoke\.js"><\/script>\s*<div id="container-4fba865c26acc098d8ec6e1b07d7c2e6"><\/div>\]\]><\/b:widget-setting>/,
  '<b:widget-setting name=\'content\'><![CDATA[<div class="blogger-ad-card blogger-native-ad"><span class="blogger-ad-label">Publicidad recomendada</span><div class="blogger-ad-slot" data-adsterra-native="true"></div></div>]]></b:widget-setting>'
);

xml = xml.replace(
  /<b:widget-setting name='content'><!\[CDATA\[<script src="https:\/\/wailsilence\.com\/77\/3b\/99\/773b991f34f1eed5a26702fcf381ddbb\.js"><\/script>\]\]><\/b:widget-setting>/,
  '<b:widget-setting name=\'content\'><![CDATA[]]></b:widget-setting>'
);

xml = xml.replace(
  /\s*<div id='container-4fba865c26acc098d8ec6e1b07d7c2e6'\/>\s*/g,
  "\n"
);

xml = xml.replace(
  "\n  </body>",
  "\n    <script async='async' src='https://wailsilence.com/5a/77/9f/5a779ffcc3c9736641795d9d4408d678.js'/>\n    <script async='async' src='https://wailsilence.com/6a/94/d8/6a94d8ced66908f1c8e6e72a1022ef24.js'/>\n  </body>"
);

fs.writeFileSync(file, xml, "utf8");
