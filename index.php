<?php
/**
 * 首页：国旗列表与文档入口
 */

$pageTitle = 'Country Flag Icons – Free SVG Flags CDN | flagcdn.io';
$pageDescription = 'Free SVG country flag icons by ISO 3166-1 alpha-2. One-line CSS, 4:3 & 1:1 aspect ratios. Copy HTML or image URL for any country. Fast CDN delivery.';
$pageKeywords = 'country flags, flag icons, SVG flags, ISO 3166, flag CDN, country code flags, free flag icons, national flags, flag emoji, world flags';
$canonicalUrl = 'https://flagcdn.io/';

// 页面额外 head：Leaflet 地图样式。若使用自建 Umami 或已授权域名，可追加统计 script。
$extraHead = '<link rel="stylesheet" href="https://static.bluecdn.com/npm/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />';

require __DIR__ . '/header.php';

// JSON-LD structured data
$extraHead .= '
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "flagcdn.io",
  "url": "https://flagcdn.io",
  "description": "Free SVG country flag icons by ISO 3166-1 alpha-2. One-line CSS, 4:3 & 1:1 aspect ratios. Fast CDN delivery.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "flagcdn.io",
    "url": "https://flagcdn.io"
  },
  "license": "https://opensource.org/licenses/MIT"
}
</script>';

// 页脚脚本：地图与主应用（Google Maps API Key 由 header 中加载的 .env 提供）
$footerScripts = implode("\n    ", [
    '<script src="https://static.bluecdn.com/npm/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>',
    '<script src="https://static.bluecdn.com/npm/leaflet.gridlayer.googlemutant@0.16.0/dist/Leaflet.GoogleMutant.js" crossorigin=""></script>',
    '<script>window.GOOGLE_MAPS_API_KEY = ' . json_encode($googleMapsApiKey ?? '', JSON_UNESCAPED_SLASHES) . ';</script>',
    '<script src="/assets/i18n.js"></script>',
    '<script src="/assets/app.js"></script>',
]);
?>
    <section class="welcome">
      <div class="container welcome-inner">
        <div class="welcome-content">
          <h1 class="welcome-title" data-i18n="hero.title">Flag Icons</h1>
          <p class="welcome-desc" data-i18n="hero.sub">
            Country flags in SVG. Use the code icon to copy HTML, or the copy button to copy image
            URL and country code.
          </p>
          <div class="welcome-cta-row">
            <a href="/docs/" class="welcome-cta"><i class="fa-solid fa-book-open welcome-cta-icon" aria-hidden="true"></i><span data-i18n="hero.cta">View Docs</span></a>
            <a href="/download/flags.zip" class="welcome-cta welcome-cta--download" id="download-flags-btn" download>
              <span class="download-btn-tooltip" id="download-btn-tooltip" role="tooltip">flags.zip</span>
              <span class="download-btn-content">
                <i class="fa-solid fa-download download-btn-icon" aria-hidden="true"></i>
                <span data-i18n="hero.download">Download</span>
              </span>
              <span class="download-btn-number" id="download-count">0</span>
              <span class="download-btn-spinner" aria-hidden="true"></span>
            </a>
          </div>
        </div>
        <div class="welcome-visual">
          <div class="welcome-flags">
            <span class="fi fi-cn" title="4:3"></span>
            <span class="fi fi-us" title="4:3"></span>
            <span class="fi fi-gb" title="4:3"></span>
            <span class="fi fi-jp" title="4:3"></span>
            <span class="fi fi-de" title="4:3"></span>
            <span class="fi fi-fr fis" title="1:1"></span>
            <span class="fi fi-eu fis" title="1:1"></span>
          </div>
        </div>
      </div>
    </section>

    <section class="cf-stats">
      <div class="container">
        <div class="cf-stats-row" id="cf-stats-row">
          <div class="cf-stat">
            <span class="cf-stat-value" id="cf-stat-requests">-</span>
            <span class="cf-stat-label" data-i18n="stats.requests">Requests (30d)</span>
          </div>
          <div class="cf-stat">
            <span class="cf-stat-value" id="cf-stat-visitors">-</span>
            <span class="cf-stat-label" data-i18n="stats.visitors">Unique Visitors (30d)</span>
          </div>
          <div class="cf-stat">
            <span class="cf-stat-value" id="cf-stat-bandwidth">-</span>
            <span class="cf-stat-label" data-i18n="stats.bandwidth">Bandwidth (30d)</span>
          </div>
          <div class="cf-stat">
            <span class="cf-stat-value" id="cf-stat-pageviews">-</span>
            <span class="cf-stat-label" data-i18n="stats.pageviews">Page Views (30d)</span>
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <ul class="features-list">
          <li class="feature-card">
            <span class="feature-card__icon" aria-hidden="true"><i class="fa-solid fa-crop-simple"></i></span>
            <div class="feature-card__body">
              <h3 class="feature-card__title" data-i18n="features.aspectTitle">4:3 & 1:1 aspect ratios</h3>
              <p class="feature-card__desc" data-i18n="features.aspectDesc">Unified proportions for a consistent, clean look across all flags.</p>
            </div>
          </li>
          <li class="feature-card">
            <span class="feature-card__icon" aria-hidden="true"><i class="fa-solid fa-earth-americas"></i></span>
            <div class="feature-card__body">
              <h3 class="feature-card__title" data-i18n="features.isoTitle">ISO 3166-1-alpha-2</h3>
              <p class="feature-card__desc" data-i18n="features.isoDesc">Standard country and territory codes; search and copy HTML or image URL.</p>
            </div>
          </li>
          <li class="feature-card">
            <span class="feature-card__icon" aria-hidden="true"><i class="fa-solid fa-cloud-arrow-down"></i></span>
            <div class="feature-card__body">
              <h3 class="feature-card__title" data-i18n="features.cdnTitle">CDN delivery</h3>
              <p class="feature-card__desc" data-i18n="features.cdnDesc">Fast, stable delivery; one line of CSS to get started.</p>
            </div>
          </li>
          <li class="feature-card">
            <span class="feature-card__icon" aria-hidden="true"><i class="fa-regular fa-copy"></i></span>
            <div class="feature-card__body">
              <h3 class="feature-card__title" data-i18n="features.copyTitle">Copy HTML & URL</h3>
              <p class="feature-card__desc" data-i18n="features.copyDesc">One-click copy of HTML snippet or image URL for any flag below.</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <main class="container main-content">
      <div class="controls">
        <div class="search-box">
          <input type="text" id="search-flag" data-i18n-placeholder="search.placeholder" placeholder="Search..." />
        </div>
        <div class="filter-continent">
          <label for="continent-select" class="filter-label" data-i18n="filter.continent">Continent</label>
          <select id="continent-select" class="continent-select" data-i18n-title="filter.title" title="Filter by continent">
            <option value="" data-i18n="filter.all">All</option>
            <option value="Africa">Africa</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="North America">North America</option>
            <option value="Oceania">Oceania</option>
            <option value="South America">South America</option>
            <option value="Antarctica">Antarctica</option>
            <option value="non-iso">Non-ISO</option>
          </select>
        </div>
      </div>
      <header class="section-header">
        <span class="section-header-icon" aria-hidden="true"><i class="fa-solid fa-flag"></i></span>
        <div class="section-header-text">
          <h2 class="section-title" data-i18n="section.isoFlags">Country flags</h2>
          <p class="section-subtitle" data-i18n="section.isoFlagsSub">ISO 3166-1-alpha-2 country and territory codes.</p>
        </div>
      </header>
      <div id="flags-loading" class="flags-loading" aria-hidden="false">
        <div class="flags-loading-spinner"></div>
      </div>
      <div id="iso-flags" class="flags-grid"></div>
      <header class="section-header">
        <span class="section-header-icon" aria-hidden="true"><i class="fa-solid fa-globe"></i></span>
        <div class="section-header-text">
          <h2 class="section-title" data-i18n="section.otherFlags">Other Flags</h2>
          <p class="section-subtitle" data-i18n="section.otherFlagsSub">Non-ISO flags (regions, organizations, etc.).</p>
        </div>
      </header>
      <div id="non-iso-flags" class="flags-grid"></div>
    </main>

    <div class="format-switch">
      <button id="format-4x3" class="active" title="4:3">4:3</button>
      <button id="format-1x1" title="1:1">1:1</button>
      <button type="button" class="format-switch-backtotop" id="format-switch-backtotop" aria-label="Back to top" title="Back to top" data-i18n-title="footer.backtotop"><i class="fa-solid fa-arrow-up" aria-hidden="true"></i></button>
    </div>

    <div id="copy-toast" class="toast" aria-live="polite">
      <i class="fa-solid fa-check"></i><span data-i18n="toast.copied">Copied</span>
    </div>

    <div id="map-modal" class="map-modal" role="dialog" aria-modal="true" aria-labelledby="map-modal-title" hidden>
      <div class="map-modal-backdrop"></div>
      <div class="map-modal-box">
        <div class="map-modal-header">
          <h2 id="map-modal-title" class="map-modal-title"></h2>
          <div class="map-layer-switcher">
            <button type="button" class="map-layer-btn active" data-layer="osm" title="OpenStreetMap">OSM</button>
            <button type="button" class="map-layer-btn" data-layer="google" title="Google Maps">Google</button>
          </div>
          <button type="button" class="map-modal-close" aria-label="Close"><i class="fa-solid fa-times"></i></button>
        </div>
        <div id="map-container" class="map-container"></div>
      </div>
    </div>

<?php
require __DIR__ . '/footer.php';
