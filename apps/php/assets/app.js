const loadJSON = (path) =>
  fetch(path)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);

/** 将相对路径转为站根路径，避免在 /docs/ 等子路径下请求到错误 URL */
const toRootPath = (path) => {
  if (!path || typeof path !== "string") return path || "";
  if (path.startsWith("http") || path.startsWith("//")) return path;
  return path.startsWith("/") ? path : "/" + path;
};

const isoGrid = document.getElementById("iso-flags");
const nonIsoGrid = document.getElementById("non-iso-flags");
const searchInput = document.getElementById("search-flag");
const continentSelect = document.getElementById("continent-select");
const format4x3Btn = document.getElementById("format-4x3");
const format1x1Btn = document.getElementById("format-1x1");
const copyToast = document.getElementById("copy-toast");
const copyFormatSelect = document.getElementById("copy-format");
const copyWidthSelect = document.getElementById("copy-width");

const copyImageFormats = new Set(["svg", "png", "webp", "avif"]);
const copyImageWidths = new Set([16, 24, 32, 48, 64, 128, 256, 512]);

function getCopySettings() {
  const format = copyImageFormats.has(copyFormatSelect?.value) ? copyFormatSelect.value : "svg";
  const selectedWidth = Number(copyWidthSelect?.value);
  return { format, width: copyImageWidths.has(selectedWidth) ? selectedWidth : 64 };
}

function getFlagImageUrl(country, settings = getCopySettings()) {
  const path = settings.format === "svg"
    ? toRootPath(currentFormat === "4x3" ? country.flag_4x3 : country.flag_1x1)
    : `/i/${currentFormat}/${settings.width}/${country.code}.${settings.format}?v=lossless-1`;
  return new URL(path, window.location.origin || "https://flagcdn.io").href;
}

function escapeHtmlAttribute(value) {
  return String(value).replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;" })[character]);
}

let currentFormat = "4x3";
let allFlags = [];
let toastTimer;

function getCountryDisplayName(country) {
  const lang = typeof I18n !== "undefined" ? I18n.getLang() : "en";
  if (lang === "zh" && country.name_zh) return country.name_zh;
  if (lang === "ja" && country.name_ja) return country.name_ja;
  if (lang === "de" && country.name_de) return country.name_de;
  if (lang === "ru" && country.name_ru) return country.name_ru;
  if (lang === "ar" && country.name_ar) return country.name_ar;
  return country.name || "";
}

function getCountryDisplayNameFromCard(card) {
  const lang = typeof I18n !== "undefined" ? I18n.getLang() : "en";
  const key = lang === "zh" ? "nameZhDisplay" : lang === "ja" ? "nameJaDisplay" : lang === "de" ? "nameDeDisplay" : lang === "ru" ? "nameRuDisplay" : lang === "ar" ? "nameArDisplay" : "nameEn";
  return card.dataset[key] || card.dataset.nameEn || "";
}

function showCopyToast() {
  if (!copyToast) return;
  copyToast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => copyToast.classList.remove("show"), 2000);
}

function createFlagCard(country) {
  const card = document.createElement("div");
  card.className = "flag-card";
  card.dataset.code = country.code;
  card.dataset.name = (country.name || "").toLowerCase();
  card.dataset.nameEn = country.name || "";
  card.dataset.nameZh = (country.name_zh || country.name || "").toLowerCase();
  card.dataset.nameZhDisplay = country.name_zh || country.name || "";
  card.dataset.nameJa = (country.name_ja || country.name || "").toLowerCase();
  card.dataset.nameJaDisplay = country.name_ja || country.name || "";
  card.dataset.nameDe = (country.name_de || country.name || "").toLowerCase();
  card.dataset.nameDeDisplay = country.name_de || country.name || "";
  card.dataset.nameRu = (country.name_ru || country.name || "").toLowerCase();
  card.dataset.nameRuDisplay = country.name_ru || country.name || "";
  card.dataset.nameAr = (country.name_ar || country.name || "").toLowerCase();
  card.dataset.nameArDisplay = country.name_ar || country.name || "";
  card.dataset.codeLower = (country.code || "").toLowerCase();
  const continent = country.continent || (country.name === "Antarctica" ? "Antarctica" : "non-iso");
  card.dataset.continent = continent;

  const wrap4 = document.createElement("div");
  wrap4.className = "flag-img-container";
  const wrap1 = document.createElement("div");
  wrap1.className = "flag-img-container flag-img-square";
  wrap1.style.display = "none";

  const img4 = document.createElement("img");
  img4.src = toRootPath(country.flag_4x3);
  img4.alt = country.name;
  img4.loading = "lazy";
  const img1 = document.createElement("img");
  img1.src = toRootPath(country.flag_1x1);
  img1.alt = country.name;
  img1.loading = "lazy";

  wrap4.appendChild(img4);
  wrap1.appendChild(img1);

  function makeFrostBar() {
    const bar = document.createElement("div");
    bar.className = "flag-frosted-bar";
    const actions = document.createElement("div");
    actions.className = "flag-card-actions";
    const codeBtn = document.createElement("button");
    codeBtn.type = "button";
    codeBtn.className = "flag-action-btn";
    codeBtn.dataset.i18nTitle = "action.copyCode";
    codeBtn.title = (typeof I18n !== "undefined" && I18n.t("action.copyCode")) || "Copy HTML code";
    codeBtn.setAttribute("aria-label", (typeof I18n !== "undefined" && I18n.t("action.copyCode")) || "Copy HTML code");
    codeBtn.innerHTML = "<i class=\"fa-solid fa-code\"></i>";
    const copyImgBtn = document.createElement("button");
    copyImgBtn.type = "button";
    copyImgBtn.className = "flag-action-btn flag-action-copy-img";
    copyImgBtn.dataset.i18nTitle = "action.copyImageUrl";
    copyImgBtn.title = (typeof I18n !== "undefined" && I18n.t("action.copyImageUrl")) || "Copy image URL";
    copyImgBtn.setAttribute("aria-label", (typeof I18n !== "undefined" && I18n.t("action.copyImageUrl")) || "Copy image URL");
    copyImgBtn.innerHTML = "<i class=\"fa-regular fa-clone\" aria-hidden=\"true\"></i>";
    const mapBtn = document.createElement("button");
    mapBtn.type = "button";
    mapBtn.className = "flag-action-btn flag-action-map";
    mapBtn.title = "Show on map";
    mapBtn.setAttribute("aria-label", "Show on map");
    mapBtn.innerHTML = "<i class=\"fa-solid fa-earth-americas\"></i>";
    actions.append(codeBtn, copyImgBtn, mapBtn);
    bar.append(actions);
    return { bar, codeBtn, copyImgBtn, mapBtn };
  }

  const frost4 = makeFrostBar();
  const frost1 = makeFrostBar();
  wrap4.appendChild(frost4.bar);
  wrap1.appendChild(frost1.bar);

  const info = document.createElement("div");
  info.className = "flag-info";
  const codeBadge = document.createElement("span");
  codeBadge.className = "flag-code-badge";
  codeBadge.textContent = country.code.toUpperCase();
  const nameEl = document.createElement("div");
  nameEl.className = "flag-name";
  const displayName = getCountryDisplayName(country);
  nameEl.textContent = displayName;
  nameEl.title = displayName;
  info.append(codeBadge, nameEl);
  card.append(wrap4, wrap1, info);

  function onCodeClick(e) {
    e.stopPropagation();
    const settings = getCopySettings();
    const fmt = currentFormat === "4x3" ? "" : " fis";
    const height = currentFormat === "4x3" ? settings.width * 3 / 4 : settings.width;
    const html = settings.format === "svg"
      ? "<span class=\"fi fi-" + country.code + fmt + "\"></span>"
      : `<img src="${escapeHtmlAttribute(getFlagImageUrl(country, settings))}" width="${settings.width}" height="${height}" alt="${escapeHtmlAttribute(getCountryDisplayName(country))}">`;
    navigator.clipboard.writeText(html).then(() => showCopyToast()).catch(() => {});
  }
  function onCopyImgClick(e) {
    e.stopPropagation();
    const imageUrl = getFlagImageUrl(country);
    navigator.clipboard.writeText(imageUrl).then(() => showCopyToast()).catch(() => {});
  }
  function onMapClick(e) {
    e.stopPropagation();
    openMapModal(country);
  }
  [frost4, frost1].forEach((f) => {
    f.codeBtn.addEventListener("click", onCodeClick);
    f.copyImgBtn.addEventListener("click", onCopyImgClick);
    f.mapBtn.addEventListener("click", onMapClick);
  });

  return card;
}

function filterFlags() {
  const q = (searchInput.value || "").trim().toLowerCase();
  const continent = (continentSelect && continentSelect.value) || "";
  allFlags.forEach(({ el, name, code, continent: c, nameZh, nameJa, nameDe, nameRu, nameAr }) => {
    const matchSearch = !q || name.includes(q) || (nameZh && nameZh.includes(q)) || (nameJa && nameJa.includes(q)) || (nameDe && nameDe.includes(q)) || (nameRu && nameRu.includes(q)) || (nameAr && nameAr.includes(q)) || code.includes(q);
    const matchContinent = !continent || c === continent;
    el.style.display = matchSearch && matchContinent ? "" : "none";
  });
}

function setFormat(format) {
  currentFormat = format;
  format4x3Btn.classList.toggle("active", format === "4x3");
  format1x1Btn.classList.toggle("active", format === "1x1");
  document.querySelectorAll(".flag-img-container:not(.flag-img-square)").forEach(el => {
    el.style.display = format === "4x3" ? "block" : "none";
  });
  document.querySelectorAll(".flag-img-square").forEach(el => {
    el.style.display = format === "1x1" ? "block" : "none";
  });
}

function hideFlagsLoading() {
  const el = document.getElementById("flags-loading");
  if (el) {
    el.classList.add("flags-loading-done");
    el.setAttribute("aria-hidden", "true");
  }
}

let debounceTimer;
function debounce(fn, ms) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fn, ms);
}

searchInput.addEventListener("input", () => debounce(filterFlags, 150));
if (continentSelect) continentSelect.addEventListener("change", filterFlags);
if (copyFormatSelect && copyWidthSelect) {
  copyFormatSelect.addEventListener("change", () => {
    copyWidthSelect.disabled = getCopySettings().format === "svg";
  });
}
format4x3Btn.addEventListener("click", () => setFormat("4x3"));
format1x1Btn.addEventListener("click", () => setFormat("1x1"));

const formatSwitchBacktotop = document.getElementById("format-switch-backtotop");
if (formatSwitchBacktotop) {
  function updateBacktotopVisibility() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || window.pageYOffset;
    const scrollMax = doc.scrollHeight - doc.clientHeight;
    const ratio = scrollMax > 0 ? scrollTop / scrollMax : 0;
    formatSwitchBacktotop.classList.toggle("is-visible", ratio > 0.3);
  }
  window.addEventListener("scroll", updateBacktotopVisibility, { passive: true });
  formatSwitchBacktotop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


let mapInstance = null;

function openMapModal(country) {
  const modal = document.getElementById("map-modal");
  const titleEl = document.getElementById("map-modal-title");
  const container = document.getElementById("map-container");
  if (!modal || !titleEl || !container) return;

  const displayName = getCountryDisplayName(country);
  titleEl.textContent = displayName + " (" + country.code.toUpperCase() + ")";
  modal.hidden = false;
  modal.classList.add("map-modal-open");
  document.body.style.overflow = "hidden";

  if (mapInstance) { mapInstance.remove(); mapInstance = null; }
  container.innerHTML = "";
  mapInstance = L.map(container).setView([20, 0], 2);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance);

  if (Array.isArray(country.latlng) && country.latlng.length === 2) {
    const [lat, lng] = country.latlng;
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      const zoom = country.area > 1000000 ? 3 : country.area > 100000 ? 5 : 6;
      mapInstance.setView([lat, lng], zoom);
    }
  }
}

function closeMapModal() {
  const modal = document.getElementById("map-modal");
  if (!modal) return;
  modal.hidden = true;
  modal.classList.remove("map-modal-open");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  mapModal = document.getElementById("map-modal");
  if (mapModal) {
    const backdrop = mapModal.querySelector(".map-modal-backdrop");
    const closeBtn = mapModal.querySelector(".map-modal-close");
    if (backdrop) backdrop.addEventListener("click", closeMapModal);
    if (closeBtn) closeBtn.addEventListener("click", closeMapModal);
    mapModal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMapModal();
    });
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".code-copy-btn");
    if (!btn || !btn.dataset.copy) return;
    e.preventDefault();
    const text = btn.getAttribute("data-copy");
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      showCopyToast();
      const icon = btn.querySelector("i");
      const orig = icon ? icon.className : "";
      btn.classList.add("copied");
      if (icon) {
        icon.className = "fa-solid fa-check";
        icon.style.color = "#6b7d8e";
      }
      setTimeout(() => {
        btn.classList.remove("copied");
        if (icon) {
          icon.className = orig;
          icon.style.color = "";
        }
      }, 2000);
    }).catch(() => {});
  });
});

async function init() {
  const countries = await loadJSON("/data/country.json");

  hideFlagsLoading();

  if (!countries || !countries.length) return;
  countries.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  countries.forEach(c => {
    const card = createFlagCard(c);
    if (c.iso) isoGrid.appendChild(card);
    else nonIsoGrid.appendChild(card);
    allFlags.push({
      el: card,
      name: (c.name || "").toLowerCase(),
      nameZh: (c.name_zh || "").toLowerCase(),
      nameJa: (c.name_ja || "").toLowerCase(),
      nameDe: (c.name_de || "").toLowerCase(),
      nameRu: (c.name_ru || "").toLowerCase(),
      nameAr: (c.name_ar || "").toLowerCase(),
      code: (c.code || "").toLowerCase(),
      continent: c.continent || (c.name === "Antarctica" ? "Antarctica" : "non-iso")
    });
  });
}

const DOWNLOAD_STATS_URL = "/api/download-count.php";

function loadDownloadStats() {
  return fetch(DOWNLOAD_STATS_URL, { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
}

function formatFileSize(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(2) + " KB";
  return bytes + " B";
}

function fetchFlagsZipSize() {
  return fetch(document.getElementById("download-flags-btn")?.getAttribute("href") || "/download/flags-all-formats.zip", { method: "HEAD" })
    .then((r) => {
      const len = r.headers.get("Content-Length");
      return len ? parseInt(len, 10) : null;
    })
    .catch(() => null);
}

function initDownloadCount() {
  const btn = document.getElementById("download-flags-btn");
  const countEl = document.getElementById("download-count");
  if (!btn || !countEl) return;
  function setCount(n) {
    countEl.textContent = typeof n === "number" && n >= 0 ? n : "-";
  }
  setCount(null);
  loadDownloadStats().then((data) => {
    if (data && typeof data.count === "number") setCount(data.count);
  }).catch(() => {});
  const tooltipEl = document.getElementById("download-btn-tooltip");
  if (tooltipEl) {
    fetchFlagsZipSize().then((bytes) => {
      const sizeStr = bytes != null ? formatFileSize(bytes) : "";
      tooltipEl.textContent = sizeStr ? "flags.zip · " + sizeStr : "flags.zip";
    }).catch(() => {
      tooltipEl.textContent = "flags.zip";
    });
  }
  document.querySelectorAll("[data-download-format]").forEach((link) => {
    link.addEventListener("click", () => {
      fetch(DOWNLOAD_STATS_URL, { method: "POST", keepalive: true, cache: "no-store" })
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (typeof data?.count === "number") setCount(data.count); })
        .catch(() => {});
    });
  });
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (btn.classList.contains("is-loading")) return;
    btn.classList.add("is-loading");
    fetch(DOWNLOAD_STATS_URL, { method: "POST" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.count === "number") setCount(data.count);
      })
      .catch(() => {});
    setTimeout(() => {
      const href = btn.getAttribute("href");
      if (href) {
        const a = document.createElement("a");
        a.href = toRootPath(href);
        a.download = "";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      btn.classList.remove("is-loading");
    }, 400);
  });
}

const THEME_KEY = "flagcdn-theme";

function initTheme() {
  const btns = [document.getElementById("theme-toggle"), document.getElementById("theme-toggle-side")].filter(Boolean);
  if (!btns.length) return;
  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem(THEME_KEY, theme);
      btns.forEach(b => {
        b.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
        b.title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
      });
    }
  }
  function toggle() {
    let current = document.documentElement.getAttribute("data-theme");
    if (!current) current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
  }
  btns.forEach(b => b.addEventListener("click", toggle));
  let current = document.documentElement.getAttribute("data-theme");
  if (!current) current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  btns.forEach(b => {
    b.setAttribute("aria-label", current === "dark" ? "Switch to light mode" : "Switch to dark mode");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDownloadCount();
  initTheme();
});
document.addEventListener("DOMContentLoaded", init);

document.addEventListener("i18n:changed", function () {
  if (typeof I18n === "undefined") return;
  document.querySelectorAll(".flag-action-btn[data-i18n-title]").forEach(function (btn) {
    var key = btn.getAttribute("data-i18n-title");
    var text = I18n.t(key);
    if (text) {
      btn.title = text;
      btn.setAttribute("aria-label", text);
    }
  });
  document.querySelectorAll(".flag-card").forEach(function (card) {
    var nameEl = card.querySelector(".flag-name");
    if (!nameEl) return;
    var displayName = getCountryDisplayNameFromCard(card);
    if (displayName) {
      nameEl.textContent = displayName;
      nameEl.title = displayName;
    }
  });
});
