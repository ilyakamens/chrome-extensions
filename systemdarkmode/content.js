const STYLE_ID = "system-dark-mode";

const CSS = `
@media (prefers-color-scheme: dark) {
  html {
    filter: invert(1) hue-rotate(180deg) !important;
  }
  img, video, picture, svg, [role="img"], [aria-label="photo" i],
  /* Avoid double re-invert on Google Maps where background-image divs are nested inside role="img" */
  [style*="background-image"]:not([role="img"] *) {
    filter: invert(1) hue-rotate(180deg) !important;
  }
}`;

function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);
}

function removeStyle() {
  document.getElementById(STYLE_ID)?.remove();
}

function siteHasDarkMode() {
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta && meta.content.includes("dark")) return true;
  const cs = getComputedStyle(document.documentElement).colorScheme;
  if (cs && cs.includes("dark")) return true;
  for (const el of [document.body, document.documentElement]) {
    if (!el) continue;
    const bg = getComputedStyle(el).backgroundColor;
    const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) continue;
    const alpha = match[4] !== undefined ? +match[4] : 1;
    if (alpha < 0.5) continue;
    const luminance = (0.2126 * +match[1] + 0.7152 * +match[2] + 0.0722 * +match[3]) / 255;
    if (luminance <= 0.2) return true;
  }
  return false;
}

async function apply() {
  const domain = location.hostname;
  const storage = await chrome.storage.local.get(["disabledDomains", "enabledDomains"]);
  const disabledDomains = storage.disabledDomains || [];
  const enabledDomains = storage.enabledDomains || [];

  const autoSkipped = siteHasDarkMode();
  document.documentElement.dataset.systemDarkModeAutoSkipped = autoSkipped;

  if (autoSkipped) {
    if (enabledDomains.includes(domain)) {
      injectStyle();
    } else {
      removeStyle();
    }
  } else {
    if (disabledDomains.includes(domain)) {
      removeStyle();
    } else {
      injectStyle();
    }
  }
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "toggle") apply();
});

apply();
document.addEventListener("DOMContentLoaded", apply);
