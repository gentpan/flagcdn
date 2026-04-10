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
    copyImgBtn.innerHTML = "<svg class=\"icon-copy\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>";
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
    const fmt = currentFormat === "4x3" ? "" : " fis";
    const html = "<span class=\"fi fi-" + country.code + fmt + "\"></span>";
    navigator.clipboard.writeText(html).then(() => showCopyToast()).catch(() => {});
  }
  function onCopyImgClick(e) {
    e.stopPropagation();
    const base = window.location.origin || "https://flagcdn.io";
    const path = toRootPath(currentFormat === "4x3" ? country.flag_4x3 : country.flag_1x1);
    const imageUrl = path.startsWith("http") ? path : base + path;
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

const GEOJSON_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson";
let countriesGeoJSON = null;
let mapModal = null;
let mapInstance = null;
let mapHighlightLayer = null;
let mapBaseLayer = null;
let mapCurrentProvider = "osm";
let googleMapsLoaded = false;

function createOSMLayer() {
  return L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
  });
}

function createGoogleLayer() {
  if (!window.google || !window.google.maps) return null;
  if (typeof L.gridLayer !== "undefined" && L.gridLayer.googleMutant) {
    return L.gridLayer.googleMutant({ type: "roadmap" });
  }
  return null;
}

function loadGoogleMapsAPI() {
  return new Promise((resolve) => {
    if (window.google && window.google.maps) {
      googleMapsLoaded = true;
      resolve();
      return;
    }
    const key = (window.GOOGLE_MAPS_API_KEY || "").trim();
    if (!key) {
      resolve();
      return;
    }
    const id = "google-maps-api-script";
    if (document.getElementById(id)) {
      if (window.google && window.google.maps) {
        resolve();
      } else {
        const done = () => resolve();
        document.getElementById(id).addEventListener("load", done);
        setTimeout(done, 12000);
      }
      return;
    }
    const timeout = setTimeout(() => resolve(), 12000);
    window.__googleMapsCallback = function () {
      clearTimeout(timeout);
      googleMapsLoaded = true;
      resolve();
    };
    const script = document.createElement("script");
    script.id = id;
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(key) + "&loading=async&callback=__googleMapsCallback";
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      clearTimeout(timeout);
      resolve();
    };
    document.head.appendChild(script);
  });
}

function setMapBaseLayer(provider) {
  if (!mapInstance) return;
  const btns = document.querySelectorAll(".map-layer-btn");
  const mapContainer = mapInstance.getContainer();

  if (provider === "osm") {
    if (mapContainer) mapContainer.classList.remove("map-base-google");
    if (mapBaseLayer) {
      mapInstance.removeLayer(mapBaseLayer);
      mapBaseLayer = null;
    }
    mapBaseLayer = createOSMLayer().addTo(mapInstance);
    mapCurrentProvider = "osm";
    btns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-layer") === "osm"));
    return;
  }
  if (provider === "google") {
    const key = (window.GOOGLE_MAPS_API_KEY || "").trim();
    if (!key) {
      btns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-layer") === "osm"));
      return;
    }
    btns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-layer") === "google"));
    loadGoogleMapsAPI().then(() => {
      const layer = createGoogleLayer();
      if (layer) {
        if (mapBaseLayer) mapInstance.removeLayer(mapBaseLayer);
        mapBaseLayer = layer.addTo(mapInstance);
        mapCurrentProvider = "google";
        if (mapContainer) mapContainer.classList.add("map-base-google");
        setTimeout(() => {
          mapInstance.invalidateSize();
          if (mapContainer) mapContainer.classList.add("map-base-google");
        }, 150);
      } else {
        if (mapContainer) mapContainer.classList.remove("map-base-google");
        if (mapBaseLayer) mapInstance.removeLayer(mapBaseLayer);
        mapBaseLayer = createOSMLayer().addTo(mapInstance);
        mapCurrentProvider = "osm";
        btns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-layer") === "osm"));
      }
    });
  }
}

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

  function initMap() {
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }
    mapBaseLayer = null;
    if (mapHighlightLayer) {
      mapHighlightLayer = null;
    }
    container.innerHTML = "";
    container.classList.remove("map-base-google");
    mapInstance = L.map(container).setView([20, 0], 2);
    mapBaseLayer = createOSMLayer().addTo(mapInstance);
    mapCurrentProvider = "osm";
    document.querySelectorAll(".map-layer-btn").forEach((b) => b.classList.toggle("active", b.getAttribute("data-layer") === "osm"));
  }

  function showCountry(feature) {
    if (!mapInstance) return;
    if (mapHighlightLayer) {
      mapInstance.removeLayer(mapHighlightLayer);
    }
    mapHighlightLayer = L.geoJSON(feature, {
      style: {
        fillColor: "#72BF80",
        fillOpacity: 0.6,
        color: "#72BF80",
        weight: 2
      }
    }).addTo(mapInstance);
    const bounds = mapHighlightLayer.getBounds();
    if (bounds.isValid()) {
      mapInstance.fitBounds(bounds.pad(0.4));
    }
  }

  if (!countriesGeoJSON) {
    initMap();
    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((geojson) => {
        countriesGeoJSON = geojson;
        const codeUpper = country.code.toUpperCase();
        const feature = (geojson.features || []).find(
          (f) => (f.properties && (f.properties.ISO_A2 === codeUpper || f.properties.iso_a2 === codeUpper || (f.properties.ADM0_A3 && f.properties.ADM0_A3.toLowerCase() === country.code.toLowerCase())))
        );
        if (feature) {
          showCountry(feature);
        } else {
          mapInstance.setView([20, 0], 2);
        }
      })
      .catch(() => {
        if (mapInstance) mapInstance.setView([20, 0], 2);
      });
  } else {
    initMap();
    const codeUpper = country.code.toUpperCase();
    const feature = (countriesGeoJSON.features || []).find(
      (f) => (f.properties && (f.properties.ISO_A2 === codeUpper || f.properties.iso_a2 === codeUpper))
    );
    if (feature) {
      showCountry(feature);
    } else {
      mapInstance.setView([20, 0], 2);
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
    mapModal.querySelectorAll(".map-layer-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const layer = btn.getAttribute("data-layer");
        if (layer) setMapBaseLayer(layer);
      });
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
        icon.style.color = "#72BF80";
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
  return fetch(DOWNLOAD_STATS_URL)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
}

function formatFileSize(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(2) + " KB";
  return bytes + " B";
}

function fetchFlagsZipSize() {
  return fetch("/download/flags.zip", { method: "HEAD" })
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
    countEl.textContent = typeof n === "number" && n >= 0 ? n : 0;
  }
  setCount(0);
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
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem(THEME_KEY, theme);
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      btn.title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    }
  }
  btn.addEventListener("click", () => {
    let current = document.documentElement.getAttribute("data-theme");
    if (!current) current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  });
  let current = document.documentElement.getAttribute("data-theme");
  if (!current) current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  if (current) btn.setAttribute("aria-label", current === "dark" ? "Switch to light mode" : "Switch to dark mode");
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
