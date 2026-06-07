<?php
/**
 * 国旗浏览页 —— 浏览 270 面旗帜
 *   /flags/  →  flags.php
 */
$pageTitle = 'Browse All Country Flags – 270 SVG, PNG, WebP, AVIF | flagcdn.io';
$pageDescription = 'Browse all 270 country flag icons. Each flag has its own page with copy-inline-SVG, custom-size download, and direct CDN URLs.';
$pageKeywords = 'flag browser, country flags, all flags, world flags, SVG download, flag CDN, custom size flags, PNG, WebP, AVIF';
$canonicalUrl = 'https://flagcdn.io/flags/';
$baseHref = '/';

$countries = json_decode((string) file_get_contents(__DIR__ . '/data/country.json'), true);
if (!is_array($countries)) {
    $countries = [];
}
// 按英文名排序，更易浏览
usort($countries, function ($a, $b) {
    return strcmp($a['name'] ?? '', $b['name'] ?? '');
});

// 收集所有大洲
$continents = [];
foreach ($countries as $c) {
    $co = $c['continent'] ?? '';
    if ($co !== '' && !in_array($co, $continents, true)) {
        $continents[] = $co;
    }
}

require __DIR__ . '/header.php';
?>
<style>
  .flags-page { padding-bottom: 3rem; font-family: "Lexend Deca", "PingFang SC", "Microsoft JhengHei", sans-serif; line-height: 1.5; }
  .flags-hero { padding: 2.5rem 0 1.5rem; text-align: center; }
  .flags-hero h1 { color: var(--bs-primary, #0f3a5f); font-size: 2rem; font-weight: 700; margin: 0 0 0.5rem; }
  .flags-hero p { color: var(--bs-tertiary-color, #6b7d92); margin: 0 0 1.5rem; }
  .flags-search-wrap { max-width: 480px; margin: 0 auto; position: relative; }
  .flags-search-wrap i { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--bs-tertiary-color, #6b7d92); pointer-events: none; }
  .flags-search { width: 100%; padding: 0.7rem 1rem 0.7rem 2.5rem; border: 1px solid var(--bs-border-color, #dde4ec); border-radius: 6px; background: var(--bs-surface, #fff); color: var(--bs-body-color, #0f1f2e); font-size: 0.95rem; font-family: inherit; }
  .flags-search:focus { outline: 0; border-color: var(--bs-primary, #0f3a5f); box-shadow: 0 0 0 3px rgba(15, 58, 95, 0.12); }

  .flags-toolbar { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between; margin: 1.5rem 0 1rem; }
  .filter-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .chip { padding: 0.35rem 0.8rem; border: 1px solid var(--bs-border-color, #dde4ec); border-radius: 999px; background: var(--bs-surface, #fff); color: var(--bs-secondary-color, #3a4d63); font-size: 0.8rem; cursor: pointer; font-family: inherit; transition: all 0.15s; }
  .chip:hover { border-color: var(--bs-primary, #0f3a5f); color: var(--bs-primary, #0f3a5f); }
  .chip.is-active { background: var(--bs-primary, #0f3a5f); border-color: var(--bs-primary, #0f3a5f); color: #fff; }
  .flags-count { color: var(--bs-tertiary-color, #6b7d92); font-size: 0.85rem; }

  .flags-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.6rem; margin-top: 1rem; }
  .flag-grid-card { display: flex !important; flex-direction: row !important; align-items: center; gap: 0.8rem; padding: 0.6rem 0.75rem; border: 1px solid var(--bs-border-color, #dde4ec); border-radius: 6px; background: var(--bs-surface, #fff); text-decoration: none; color: inherit; transition: all 0.15s; min-width: 0; }
  .flag-grid-card:hover { border-color: var(--bs-primary, #0f3a5f); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(15, 31, 46, 0.08); }
  .flag-grid-card .fgc-thumb { display: block; flex-shrink: 0; width: 48px; height: 36px; background: #fafbfc; border: 1px solid var(--bs-border-color, #dde4ec); border-radius: 2px; box-shadow: 0 1px 2px rgba(15, 31, 46, 0.04); object-fit: cover; }
  .flag-grid-card .fgc-meta { min-width: 0; flex: 1; }
  .flag-grid-card .fgc-code { font-size: 0.7rem; color: var(--bs-tertiary-color, #6b7d92); font-family: ui-monospace, "JetBrains Mono", monospace; letter-spacing: 0.04em; }
  .flag-grid-card .fgc-name { font-size: 0.85rem; color: var(--bs-emphasis-color, #0a1620); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .flag-grid-card.is-hidden { display: none; }
  .flags-empty { text-align: center; padding: 3rem 1rem; color: var(--bs-tertiary-color, #6b7d92); display: none; }
  .flags-empty.is-visible { display: block; }

  @media (max-width: 640px) {
    .flags-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
    .flag-grid-card { padding: 0.5rem; }
  }
</style>

<main class="flags-page">
  <section class="flags-hero">
    <div class="container">
      <h1 data-i18n="flags.title">国旗浏览器</h1>
      <p data-i18n="flags.subtitle">点击任意旗帜 → 复制 inline SVG · 下载 SVG / PNG / WebP / AVIF 自定义尺寸</p>
      <div class="flags-search-wrap">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="search" class="flags-search" id="flags-search" placeholder="搜索国家名 / 代码 / 首都…" autocomplete="off">
      </div>
    </div>
  </section>

  <div class="container">
    <div class="flags-toolbar">
      <div class="filter-chips" id="continent-chips">
        <button class="chip is-active" data-continent="all">全部</button>
        <?php foreach ($continents as $co): ?>
          <button class="chip" data-continent="<?php echo htmlspecialchars($co, ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($co, ENT_QUOTES, 'UTF-8'); ?></button>
        <?php endforeach; ?>
      </div>
      <div class="flags-count" id="flags-count"></div>
    </div>

    <div class="flags-grid" id="flags-grid">
      <?php foreach ($countries as $c): ?>
        <a class="flag-grid-card" href="/flag/<?php echo urlencode($c['code']); ?>/"
           data-cc="<?php echo htmlspecialchars($c['code'], ENT_QUOTES, 'UTF-8'); ?>"
           data-name="<?php echo htmlspecialchars($c['name'], ENT_QUOTES, 'UTF-8'); ?>"
           data-name-zh="<?php echo htmlspecialchars($c['name_zh'] ?? '', ENT_QUOTES, 'UTF-8'); ?>"
           data-capital="<?php echo htmlspecialchars($c['capital'] ?? '', ENT_QUOTES, 'UTF-8'); ?>"
           data-continent="<?php echo htmlspecialchars($c['continent'] ?? '', ENT_QUOTES, 'UTF-8'); ?>">
          <img class="fgc-thumb" loading="lazy" width="48" height="36" alt=""
               src="/flags/4x3/<?php echo urlencode($c['code']); ?>.svg">
          <div class="fgc-meta">
            <div class="fgc-code"><?php echo strtoupper(htmlspecialchars($c['code'], ENT_QUOTES, 'UTF-8')); ?></div>
            <div class="fgc-name"><?php echo htmlspecialchars($c['name'], ENT_QUOTES, 'UTF-8'); ?></div>
          </div>
        </a>
      <?php endforeach; ?>
    </div>

    <div class="flags-empty" id="flags-empty">
      <i class="fa-solid fa-flag" style="font-size:2rem;opacity:0.4;display:block;margin-bottom:0.5rem;"></i>
      没找到匹配的国家
    </div>
  </div>
</main>

<?php
$footerScripts = '<script src="/assets/flags-grid.js"></script>';
require __DIR__ . '/footer.php';
?>
