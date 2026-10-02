<?php
/**
 * 首页：国旗列表与文档入口
 */

$pageTitle = 'Country Flag Icons – Free SVG Flags CDN | flagcdn.io';
$pageDescription = 'Free SVG country flag icons by ISO 3166-1 alpha-2. One-line CSS, 4:3 & 1:1 aspect ratios. Copy HTML or image URL for any country. Fast CDN delivery.';
$pageKeywords = 'country flags, flag icons, SVG flags, ISO 3166, flag CDN, country code flags, free flag icons, national flags, flag emoji, world flags';
$canonicalUrl = 'https://flagcdn.io/';

$extraHead = '<link rel="stylesheet" href="/assets/leaflet/leaflet.css" />';

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

// 页脚脚本：Leaflet 地图与主应用
$footerScripts = implode("\n    ", [
    '<script src="/assets/leaflet/leaflet.js"></script>',
    '<script src="/assets/i18n.js?v=' . rawurlencode((string) filemtime(__DIR__ . '/assets/i18n.js')) . '"></script>',
    '<script src="/assets/app.js?v=' . rawurlencode((string) filemtime(__DIR__ . '/assets/app.js')) . '"></script>',
]);
?>
    <section class="welcome">
      <div class="container welcome-inner">
        <div class="welcome-content">
          <h1 class="welcome-title" data-i18n="hero.title">Flag Icons</h1>
          <p class="welcome-desc" data-i18n="hero.sub">
            Country flags in SVG, PNG, WebP and AVIF. Choose a format below, then copy HTML or an image URL.
          </p>
          <div class="welcome-cta-row">
            <a href="/docs/" class="welcome-cta">
              <i class="fa-solid fa-file-lines welcome-cta-fa" aria-hidden="true"></i>
              <span data-i18n="hero.cta">View Docs</span>
            </a>
            <a href="/download/flags-all-formats.zip" class="welcome-cta welcome-cta--download" id="download-flags-btn" download>
              <span class="download-btn-tooltip" id="download-btn-tooltip" role="tooltip">flags.zip</span>
              <span class="download-btn-content">
                <i class="fa-solid fa-arrow-down-to-line welcome-cta-fa download-btn-icon" aria-hidden="true"></i>
                <span data-i18n="hero.download">Download</span>
              </span>
              <span class="download-btn-number" id="download-count">-</span>
              <span class="download-btn-spinner" aria-hidden="true"></span>
            </a>
          </div>
          <div class="download-format-options" aria-label="Download formats">
            <span data-i18n="hero.formats">All formats above, or choose:</span>
            <a href="/download/flags-svg.zip" class="download-format-link" data-download-format="svg" download>SVG</a>
            <a href="/download/flags-png.zip" class="download-format-link" data-download-format="png" download>PNG</a>
            <a href="/download/flags-webp.zip" class="download-format-link" data-download-format="webp" download>WebP</a>
            <a href="/download/flags-avif.zip" class="download-format-link" data-download-format="avif" download>AVIF</a>
          </div>
          <p class="download-format-summary" data-i18n="hero.assetSummary">543 SVGs · 13,032 raster images · 8 sizes (16–512px)</p>
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

    <section class="bento">
      <div class="container bento-grid">
        <div class="bento-card bento-feat">
          <div class="bento-feat-header"><i class="fa-solid fa-flag bento-feat-icon" aria-hidden="true"></i><h3 class="bento-feat-title" data-i18n="bento.flagsTitle">543 SVGs</h3></div>
          <p class="bento-feat-desc" data-i18n="bento.flagsDesc">271 flag codes, two ratios, and one original variant.</p>
        </div>
        <div class="bento-card bento-feat">
          <div class="bento-feat-header"><i class="fa-solid fa-crop-simple bento-feat-icon" aria-hidden="true"></i><h3 class="bento-feat-title" data-i18n="bento.ratioTitle">4:3 & 1:1</h3></div>
          <p class="bento-feat-desc" data-i18n="bento.ratioDesc">Two aspect ratios. Uniform sizing for clean, aligned layouts.</p>
        </div>
        <div class="bento-card bento-feat">
          <div class="bento-feat-header"><i class="fa-solid fa-bolt bento-feat-icon" aria-hidden="true"></i><h3 class="bento-feat-title" data-i18n="bento.cdnTitle">CDN Powered</h3></div>
          <p class="bento-feat-desc" data-i18n="bento.cdnDesc">Global edge delivery via Cloudflare. One CSS link to get started.</p>
        </div>
        <div class="bento-card bento-feat">
          <div class="bento-feat-header"><i class="fa-solid fa-clipboard bento-feat-icon" aria-hidden="true"></i><h3 class="bento-feat-title" data-i18n="bento.copyTitle">Click to Copy</h3></div>
          <p class="bento-feat-desc" data-i18n="bento.copyDesc">Choose a format, then copy HTML or an image URL with a single click.</p>
        </div>
        <div class="bento-card bento-feat">
          <div class="bento-feat-header"><i class="fa-solid fa-earth-americas bento-feat-icon" aria-hidden="true"></i><h3 class="bento-feat-title" data-i18n="bento.mapTitle">Map View</h3></div>
          <p class="bento-feat-desc" data-i18n="bento.mapDesc">Explore country locations on an interactive map.</p>
        </div>
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
      <div class="copy-options" aria-describedby="copy-options-hint">
        <div class="copy-option-field">
          <label for="copy-format" class="filter-label" data-i18n="copy.format">Copy format</label>
          <select id="copy-format" class="copy-select">
            <option value="svg">SVG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
            <option value="avif">AVIF</option>
          </select>
        </div>
        <div class="copy-option-field">
          <label for="copy-width" class="filter-label" data-i18n="copy.width">Image width</label>
          <select id="copy-width" class="copy-select" disabled>
            <option value="16">16px</option>
            <option value="24">24px</option>
            <option value="32">32px</option>
            <option value="48">48px</option>
            <option value="64" selected>64px</option>
            <option value="128">128px</option>
            <option value="256">256px</option>
            <option value="512">512px</option>
          </select>
        </div>
        <p id="copy-options-hint" class="copy-options-hint" data-i18n="copy.hint">Card buttons copy HTML or an image URL in your selected format.</p>
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
      <button type="button" class="theme-toggle-side" id="theme-toggle-side" aria-label="Toggle theme" title="Toggle light/dark theme"><i class="fa-solid fa-moon theme-toggle-icon theme-toggle-icon--dark" aria-hidden="true"></i><i class="fa-solid fa-sun theme-toggle-icon theme-toggle-icon--light" aria-hidden="true"></i></button>
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
          <button type="button" class="map-modal-close" aria-label="Close"><i class="fa-solid fa-times"></i></button>
        </div>
        <div id="map-container" class="map-container"></div>
      </div>
    </div>

<?php
require __DIR__ . '/footer.php';
