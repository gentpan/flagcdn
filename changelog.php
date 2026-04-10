<?php
$pageTitle = 'Changelog – Fix & Update Log | flagcdn.io';
$pageDescription = 'Track all fixes, updates, and improvements made to flagcdn.io flag icons and site features.';
$pageKeywords = 'changelog, updates, fixes, flagcdn changelog, flag icons updates';
$canonicalUrl = 'https://flagcdn.io/changelog/';
$baseHref = '/';
$extraHead = '<style>
    :root {
      --cl-accent: #1971c2;
      --cl-muted: #6c757d;
      --cl-line: var(--bs-border-color, #e9ecef);
      --cl-tag-svg: #d63384;
      --cl-tag-svg-bg: rgba(214, 51, 132, 0.08);
      --cl-tag-css: #0d6efd;
      --cl-tag-css-bg: rgba(13, 110, 253, 0.08);
      --cl-tag-data: #e67700;
      --cl-tag-data-bg: rgba(230, 119, 0, 0.08);
      --cl-tag-site: #198754;
      --cl-tag-site-bg: rgba(25, 135, 84, 0.08);
      --cl-tag-i18n: #6f42c1;
      --cl-tag-i18n-bg: rgba(111, 66, 193, 0.08);
    }
    [data-theme="dark"] {
      --cl-tag-svg-bg: rgba(214, 51, 132, 0.15);
      --cl-tag-css-bg: rgba(13, 110, 253, 0.15);
      --cl-tag-data-bg: rgba(230, 119, 0, 0.15);
      --cl-tag-site-bg: rgba(25, 135, 84, 0.15);
      --cl-tag-i18n-bg: rgba(111, 66, 193, 0.15);
    }
    .changelog { padding-bottom: 2rem; font-family: "Outfit", "PingFang SC", "Microsoft YaHei", sans-serif; line-height: 1.5; }
    .changelog-date { font-size: 1.15rem; font-weight: 600; margin: 2rem 0 0.75rem; padding-bottom: 0.35rem; border-bottom: 1px solid var(--cl-line); color: var(--bs-emphasis-color, #212529); }
    .changelog-date:first-child { margin-top: 0; }
    .changelog-list { list-style: none; margin: 0 0 1.5rem; padding: 0; }
    .changelog-item { display: flex; align-items: flex-start; gap: 0.5rem; padding: 0.45rem 0; border-bottom: 1px dashed var(--cl-line); font-size: 0.95rem; }
    .changelog-item:last-child { border-bottom: none; }
    .changelog-tag { display: inline-block; flex-shrink: 0; padding: 0.1rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
    .changelog-tag--svg { color: var(--cl-tag-svg); background: var(--cl-tag-svg-bg); }
    .changelog-tag--css { color: var(--cl-tag-css); background: var(--cl-tag-css-bg); }
    .changelog-tag--data { color: var(--cl-tag-data); background: var(--cl-tag-data-bg); }
    .changelog-tag--site { color: var(--cl-tag-site); background: var(--cl-tag-site-bg); }
    .changelog-tag--i18n { color: var(--cl-tag-i18n); background: var(--cl-tag-i18n-bg); }
    .changelog-text { flex: 1; color: var(--bs-body-color, #212529); }
    .changelog-code { font-family: "Paper Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.85rem; padding: 0.1rem 0.35rem; background: var(--bs-surface, #f8f9fa); border: 1px solid var(--cl-line); border-radius: 4px; }
    .changelog-flag { vertical-align: middle; margin: 0 0.15rem; }
  </style>';
$bodyAttr = 'data-i18n-page-title="changelog.titleFull"';
require __DIR__ . '/header.php';
?>
  <section class="welcome welcome--compact">
    <div class="container">
      <h1 class="welcome-title welcome-title--compact" data-i18n="changelog.title">Changelog</h1>
      <p class="welcome-desc" data-i18n="changelog.heroSub">Fixes, updates, and improvements to flagcdn.io</p>
    </div>
  </section>

  <main class="container changelog">

    <h2 class="changelog-date">2026-03-19</h2>
    <ul class="changelog-list">
      <li class="changelog-item">
        <span class="changelog-tag changelog-tag--svg">SVG</span>
        <span class="changelog-text">Fix <span class="fi fi-gy changelog-flag"></span> <code class="changelog-code">gy</code> (Guyana) — green background started at x=2.4 (4:3) / x=2 (1:1), leaving a transparent gap on the left edge. Now fills full viewBox.</span>
      </li>
      <li class="changelog-item">
        <span class="changelog-tag changelog-tag--site">Site</span>
        <span class="changelog-text">Add Changelog page to track all fixes and updates.</span>
      </li>
      <li class="changelog-item">
        <span class="changelog-tag changelog-tag--site">Site</span>
        <span class="changelog-text">Add Feedback page — users can report flag errors, request new flags, and submit suggestions.</span>
      </li>
      <li class="changelog-item">
        <span class="changelog-tag changelog-tag--site">Site</span>
        <span class="changelog-text">Add project description and Star CTA to the announce bar on homepage.</span>
      </li>
      <li class="changelog-item">
        <span class="changelog-tag changelog-tag--site">Site</span>
        <span class="changelog-text">Add footer navigation with Docs, Changelog, and Feedback links.</span>
      </li>
    </ul>

  </main>

<?php
$footerClass = 'docs-footer';
$showFooterNav = true;
$footerScripts = '<script src="/assets/i18n.js"></script>';
require __DIR__ . '/footer.php';
?>
