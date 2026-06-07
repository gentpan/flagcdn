<?php
/**
 * 单个国家详情页 —— 复制 inline SVG / 自定义尺寸下载 / CDN URL
 *   /flag/{cc}/  → flag.php?cc={cc}
 */
declare(strict_types=1);

require __DIR__ . '/includes/raster.php';

$cc = isset($_GET['cc']) ? (string) $_GET['cc'] : '';
if (!preg_match('/^[a-z0-9][a-z0-9-]{0,15}$/', $cc)) {
    http_response_code(404);
    $pageTitle = 'Flag Not Found | flagcdn.io';
    require __DIR__ . '/header.php';
    echo '<main class="container" style="padding:4rem 1rem;text-align:center;"><h1>404 — Flag not found</h1><p>Invalid country code.</p><p><a href="/flags/">← Back to all flags</a></p></main>';
    require __DIR__ . '/footer.php';
    exit;
}

$root = __DIR__;
$countries = json_decode((string) file_get_contents($root . '/data/country.json'), true);
if (!is_array($countries)) {
    $countries = [];
}

$country = null;
foreach ($countries as $c) {
    if (($c['code'] ?? '') === $cc) {
        $country = $c;
        break;
    }
}

// 兼容 lipis 的非 ISO 扩展（arab/asean/eu/un/xx）—— 不在 country.json 里也允许
$srcSvg1x1 = $root . '/flags/1x1/' . $cc . '.svg';
$srcSvg4x3 = $root . '/flags/4x3/' . $cc . '.svg';
$isInJson  = $country !== null;

if (!$isInJson && !is_file($srcSvg1x1)) {
    http_response_code(404);
    $pageTitle = 'Flag Not Found | flagcdn.io';
    require __DIR__ . '/header.php';
    echo '<main class="container" style="padding:4rem 1rem;text-align:center;"><h1>404 — Flag not found</h1><p>No flag exists for code <code>' . htmlspecialchars($cc, ENT_QUOTES, 'UTF-8') . '</code>.</p><p><a href="/flags/">← Back to all flags</a></p></main>';
    require __DIR__ . '/footer.php';
    exit;
}

$name = $isInJson ? ($country['name'] ?? strtoupper($cc)) : strtoupper($cc);
$capital = $isInJson ? ($country['capital'] ?? '') : '';
$continent = $isInJson ? ($country['continent'] ?? '') : '';
$iso = $isInJson ? (bool) ($country['iso'] ?? false) : false;
$ccUpper = strtoupper($cc);

// 读取 SVG 内容（给"复制代码"用）
$svg1x1Content = is_file($srcSvg1x1) ? (string) file_get_contents($srcSvg1x1) : '';
$svg4x3Content = is_file($srcSvg4x3) ? (string) file_get_contents($srcSvg4x3) : '';

// 同大洲的其他国家（最多 11 个 + 当前 = 12）
$related = [];
if ($continent !== '') {
    foreach ($countries as $c) {
        if (($c['code'] ?? '') === $cc) continue;
        if (($c['continent'] ?? '') === $continent) {
            $related[] = $c;
        }
    }
    usort($related, function ($a, $b) {
        return strcmp($a['name'] ?? '', $b['name'] ?? '');
    });
    $related = array_slice($related, 0, 11);
}

$pageTitle = $ccUpper . ' Flag – ' . $name . ' SVG, PNG, WebP, AVIF Download | flagcdn.io';
$pageDescription = 'Download the ' . $name . ' flag in SVG, PNG, WebP and AVIF formats at any custom size. Copy inline SVG code for direct use in HTML. ISO 3166-1 code: ' . $ccUpper . '.';
$pageKeywords = strtolower($name) . ' flag, ' . $ccUpper . ' flag, country flag, SVG flag, ' . ($continent ? strtolower($continent) . ' flag, ' : '') . 'flag icon, flag download';
$canonicalUrl = 'https://flagcdn.io/flag/' . $cc . '/';
$baseHref = '/';
?>
<style>
  .flag-page { padding-bottom: 3rem; font-family: "Lexend Deca", "PingFang SC", "Microsoft JhengHei", sans-serif; line-height: 1.5; }
  .flag-hero { padding: 2rem 0 1.5rem; }
  .flag-hero-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 2rem; align-items: center; }
  .flag-preview-large { background: linear-gradient(45deg, #fafbfc 25%, transparent 25%, transparent 75%, #fafbfc 75%, #fafbfc), linear-gradient(45deg, #fafbfc 25%, #f0f3f7 25%, #f0f3f7 75%, #fafbfc 75%, #fafbfc); background-size: 16px 16px; background-position: 0 0, 8px 8px; border: 1px solid var(--bs-border-color, #dde4ec); border-radius: 10px; padding: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
  .flag-preview-large img { display: block; box-shadow: 0 4px 16px rgba(15, 31, 46, 0.1); max-width: 100%; height: auto; }
  .flag-preview-large .ratio-label { font-size: 0.7rem; color: var(--bs-tertiary-color, #6b7d92); font-family: ui-monospace, "JetBrains Mono", monospace; }
  .flag-info h1 { color: var(--bs-emphasis-color, #0a1620); font-size: 2.2rem; font-weight: 700; margin: 0 0 0.3rem; }
  .flag-info .cc-badge { display: inline-block; padding: 3px 8px; background: var(--bs-success-bg-subtle, #e6eef5); color: var(--bs-primary, #0f3a5f); border-radius: 3px; font-family: ui-monospace, "JetBrains Mono", monospace; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.05em; margin-right: 0.5rem; vertical-align: middle; }
  .flag-info .iso-badge { display: inline-block; padding: 2px 7px; background: var(--bs-accent, #14532d); color: #fff; border-radius: 3px; font-size: 0.7rem; font-weight: 600; vertical-align: middle; }
  .flag-info .names { color: var(--bs-secondary-color, #3a4d63); margin: 0.6rem 0 0.3rem; font-size: 0.95rem; }
  .flag-info .names span { display: inline-block; margin-right: 0.8rem; }
  .flag-info .meta { color: var(--bs-tertiary-color, #6b7d92); font-size: 0.85rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--bs-border-color, #dde4ec); }
  .flag-info .meta div { display: inline-block; margin-right: 1.5rem; }
  .flag-info .meta strong { color: var(--bs-secondary-color, #3a4d63); font-weight: 600; margin-right: 0.3rem; }

  .flag-section { background: var(--bs-surface, #fff); border: 1px solid var(--bs-border-color, #dde4ec); border-radius: 10px; padding: 1.5rem; margin: 1.25rem 0; }
  .flag-section h2 { margin: 0 0 1rem; font-size: 1.1rem; color: var(--bs-emphasis-color, #0a1620); display: flex; align-items: center; gap: 0.5rem; }
  .flag-section h2 i { color: var(--bs-primary, #0f3a5f); font-size: 1rem; }

  .copy-section .copy-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem; }
  .copy-tabs { display: flex; gap: 0.3rem; }
  .copy-tabs button { padding: 0.35rem 0.75rem; border: 1px solid var(--bs-border-color, #dde4ec); background: var(--bs-surface, #fff); color: var(--bs-secondary-color, #3a4d63); border-radius: 4px; font-size: 0.8rem; cursor: pointer; font-family: inherit; }
  .copy-tabs button.is-active { background: var(--bs-primary, #0f3a5f); border-color: var(--bs-primary, #0f3a5f); color: #fff; }
  .copy-tabs button:hover:not(.is-active) { border-color: var(--bs-primary, #0f3a5f); }
  .code-block { background: #0a1620; color: #c8d6e0; padding: 1rem; border-radius: 6px; font-family: ui-monospace, "JetBrains Mono", monospace; font-size: 0.78rem; line-height: 1.55; overflow: auto; max-height: 320px; white-space: pre; word-break: break-all; }
  .copy-btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.9rem; background: var(--bs-accent, #14532d); color: #fff; border: 0; border-radius: 5px; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: inherit; }
  .copy-btn:hover { filter: brightness(1.1); }
  .copy-btn i { font-size: 0.85rem; }

  .download-section .controls { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }
  .ctrl-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
  .ctrl-label { font-size: 0.85rem; color: var(--bs-tertiary-color, #6b7d92); min-width: 80px; }
  .chip-group { display: flex; flex-wrap: wrap; gap: 0.3rem; }
  .chip-group button { padding: 0.4rem 0.7rem; border: 1px solid var(--bs-border-color, #dde4ec); background: var(--bs-surface, #fff); color: var(--bs-secondary-color, #3a4d63); border-radius: 4px; font-size: 0.8rem; cursor: pointer; font-family: ui-monospace, "JetBrains Mono", monospace; transition: all 0.15s; }
  .chip-group button:hover { border-color: var(--bs-primary, #0f3a5f); }
  .chip-group button.is-active { background: var(--bs-primary, #0f3a5f); border-color: var(--bs-primary, #0f3a5f); color: #fff; }
  .size-input { width: 80px; padding: 0.4rem 0.5rem; border: 1px solid var(--bs-border-color, #dde4ec); border-radius: 4px; font-size: 0.8rem; font-family: ui-monospace, "JetBrains Mono", monospace; }
  .size-input:focus { outline: 0; border-color: var(--bs-primary, #0f3a5f); }
  .download-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
  .download-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; background: var(--bs-primary, #0f3a5f); color: #fff; border: 0; border-radius: 6px; font-size: 0.9rem; font-weight: 600; cursor: pointer; font-family: inherit; text-decoration: none; }
  .download-btn:hover { background: var(--bs-primary-hover, #0a2a47); }
  .download-btn-secondary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; background: var(--bs-surface, #fff); color: var(--bs-primary, #0f3a5f); border: 1px solid var(--bs-border-color, #dde4ec); border-radius: 6px; font-size: 0.9rem; cursor: pointer; font-family: inherit; }
  .download-btn-secondary:hover { border-color: var(--bs-primary, #0f3a5f); background: var(--bs-success-bg-subtle, #e6eef5); }

  .url-list { display: flex; flex-direction: column; gap: 0.4rem; }
  .url-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: var(--bs-success-bg-subtle, #e6eef5); border-radius: 5px; font-family: ui-monospace, "JetBrains Mono", monospace; font-size: 0.8rem; }
  .url-item code { flex: 1; color: var(--bs-primary, #0f3a5f); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .url-item button { background: none; border: 0; cursor: pointer; color: var(--bs-primary, #0f3a5f); padding: 0.2rem 0.4rem; font-size: 0.85rem; }
  .url-item button:hover { color: var(--bs-accent, #14532d); }

  .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.5rem; }
  .related-card { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border: 1px solid var(--bs-border-color, #dde4ec); border-radius: 5px; text-decoration: none; color: inherit; transition: all 0.15s; background: var(--bs-surface, #fff); }
  .related-card:hover { border-color: var(--bs-primary, #0f3a5f); transform: translateY(-1px); }
  .related-card img { display: block; border: 1px solid var(--bs-border-color, #dde4ec); border-radius: 2px; }
  .related-card .related-meta { min-width: 0; flex: 1; }
  .related-card .related-code { font-size: 0.65rem; color: var(--bs-tertiary-color, #6b7d92); font-family: ui-monospace, "JetBrains Mono", monospace; }
  .related-card .related-name { font-size: 0.8rem; color: var(--bs-emphasis-color, #0a1620); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }

  .toast { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%) translateY(20px); background: var(--bs-emphasis-color, #0a1620); color: #fff; padding: 0.6rem 1.2rem; border-radius: 6px; font-size: 0.85rem; opacity: 0; pointer-events: none; transition: all 0.2s; z-index: 10000; }
  .toast.is-visible { opacity: 1; transform: translateX(-50%) translateY(0); }

  @media (max-width: 720px) {
    .flag-hero-grid { grid-template-columns: 1fr; gap: 1.5rem; }
    .flag-info h1 { font-size: 1.7rem; }
    .flag-section { padding: 1rem; }
  }
</style>

<?php
// JSON-LD 结构化数据
$jsonLd = [
    '@context' => 'https://schema.org',
    '@type' => 'ImageObject',
    'name' => $name . ' flag',
    'description' => $pageDescription,
    'contentUrl' => 'https://flagcdn.io/flags/1x1/' . $cc . '.svg',
    'thumbnailUrl' => 'https://flagcdn.io/flags/4x3/' . $cc . '.svg',
    'encodingFormat' => 'image/svg+xml',
    'keywords' => $pageKeywords,
    'creator' => ['@type' => 'Organization', 'name' => 'flagcdn.io'],
    'license' => 'https://opensource.org/licenses/MIT',
];
if ($continent) {
    $jsonLd['contentLocation'] = ['@type' => 'Place', 'name' => $name, 'address' => $capital];
}
$extraHead = '<script type="application/ld+json">' . json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>';

require __DIR__ . '/header.php';
?>

<main class="flag-page">
  <div class="container">
    <section class="flag-hero">
      <div class="flag-hero-grid">
        <div class="flag-preview-large">
          <img id="flag-1x1-preview" src="<?php echo htmlspecialchars(raster_public_url('1x1', 256, $cc, 'png'), ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8'); ?> flag 1:1" width="256" height="256">
          <span class="ratio-label">1 × 1 (512 × 512 source)</span>
          <img id="flag-4x3-preview" src="<?php echo htmlspecialchars(raster_public_url('4x3', 256, $cc, 'png'), ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8'); ?> flag 4:3" width="256" height="192" style="margin-top:0.5rem;">
          <span class="ratio-label">4 × 3 (640 × 480 source)</span>
        </div>
        <div class="flag-info">
          <h1>
            <span class="cc-badge"><?php echo htmlspecialchars($ccUpper, ENT_QUOTES, 'UTF-8'); ?></span>
            <?php echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8'); ?>
            <?php if ($iso): ?><span class="iso-badge" title="ISO 3166-1">ISO</span><?php endif; ?>
          </h1>
          <?php if ($isInJson): ?>
            <div class="names">
              <?php if (!empty($country['name_zh'])): ?><span>🇨🇳 <?php echo htmlspecialchars($country['name_zh'], ENT_QUOTES, 'UTF-8'); ?></span><?php endif; ?>
              <?php if (!empty($country['name_ja'])): ?><span>🇯🇵 <?php echo htmlspecialchars($country['name_ja'], ENT_QUOTES, 'UTF-8'); ?></span><?php endif; ?>
              <?php if (!empty($country['name_de'])): ?><span>🇩🇪 <?php echo htmlspecialchars($country['name_de'], ENT_QUOTES, 'UTF-8'); ?></span><?php endif; ?>
            </div>
          <?php endif; ?>
          <p style="color:var(--bs-secondary-color,#3a4d63);margin-top:0.5rem;">
            Copy the inline <strong>SVG</strong> code or download as <strong>PNG</strong> / <strong>WebP</strong> / <strong>AVIF</strong> at any custom size. Free, MIT-licensed, hosted on a fast global CDN.
          </p>
          <div class="meta">
            <?php if ($capital): ?><div><strong>Capital:</strong><?php echo htmlspecialchars($capital, ENT_QUOTES, 'UTF-8'); ?></div><?php endif; ?>
            <?php if ($continent): ?><div><strong>Continent:</strong><?php echo htmlspecialchars($continent, ENT_QUOTES, 'UTF-8'); ?></div><?php endif; ?>
            <div><strong>ISO 3166-1:</strong><?php echo $iso ? 'alpha-2' : 'extension (non-ISO)'; ?></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Copy SVG code section -->
    <section class="flag-section copy-section">
      <h2><i class="fa-solid fa-code"></i> Copy inline SVG code</h2>
      <div class="copy-header">
        <span style="color:var(--bs-tertiary-color,#6b7d92);font-size:0.85rem;">Paste directly into HTML — works in all modern browsers.</span>
        <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
          <div class="copy-tabs" id="ratio-tabs">
            <button type="button" data-ratio="1x1" class="is-active">1×1</button>
            <button type="button" data-ratio="4x3">4×3</button>
          </div>
          <div class="copy-tabs" id="format-tabs">
            <button type="button" data-format="formatted" class="is-active">格式化</button>
            <button type="button" data-format="minified">压缩</button>
          </div>
          <button type="button" class="copy-btn" id="copy-svg-btn">
            <i class="fa-regular fa-copy"></i> Copy SVG
          </button>
        </div>
      </div>
      <pre class="code-block" id="code-block"><code><?php echo htmlspecialchars($svg1x1Content, ENT_QUOTES, 'UTF-8'); ?></code></pre>
    </section>

    <!-- Download section -->
    <section class="flag-section download-section">
      <h2><i class="fa-solid fa-download"></i> Download at custom size</h2>
      <div class="controls">
        <div class="ctrl-row">
          <span class="ctrl-label">比例 Ratio</span>
          <div class="chip-group" id="dl-ratio">
            <button type="button" data-value="1x1" class="is-active">1×1</button>
            <button type="button" data-value="4x3">4×3</button>
          </div>
        </div>
        <div class="ctrl-row">
          <span class="ctrl-label">尺寸 Size</span>
          <div class="chip-group" id="dl-size">
            <button type="button" data-value="16">16</button>
            <button type="button" data-value="24">24</button>
            <button type="button" data-value="32">32</button>
            <button type="button" data-value="48">48</button>
            <button type="button" data-value="64" class="is-active">64</button>
            <button type="button" data-value="128">128</button>
            <button type="button" data-value="256">256</button>
            <button type="button" data-value="512">512</button>
            <input type="number" class="size-input" id="dl-size-custom" min="8" max="2048" placeholder="自定义">
          </div>
        </div>
        <div class="ctrl-row">
          <span class="ctrl-label">格式 Format</span>
          <div class="chip-group" id="dl-fmt">
            <button type="button" data-value="svg">SVG</button>
            <button type="button" data-value="png" class="is-active">PNG</button>
            <button type="button" data-value="webp">WebP</button>
            <button type="button" data-value="avif">AVIF</button>
          </div>
        </div>
      </div>
      <div class="download-actions">
        <button type="button" class="download-btn" id="download-btn">
          <i class="fa-solid fa-download"></i> <span id="download-btn-label">下载 PNG 64×64</span>
        </button>
        <button type="button" class="download-btn-secondary" id="copy-url-btn">
          <i class="fa-solid fa-link"></i> 复制下载 URL
        </button>
      </div>
    </section>

    <!-- Direct CDN URL section -->
    <section class="flag-section">
      <h2><i class="fa-solid fa-cloud-arrow-down"></i> Direct CDN URLs</h2>
      <p style="color:var(--bs-tertiary-color,#6b7d92);font-size:0.9rem;margin:0 0 1rem;">Use these URLs directly in <code>&lt;img src&gt;</code> or CSS <code>background-image</code>. All responses are CDN-cached for 30 days and include CORS headers.</p>
      <div class="url-list">
        <div class="url-item">
          <code id="url-1x1-svg">https://flagcdn.io/flags/1x1/<?php echo htmlspecialchars($cc, ENT_QUOTES, 'UTF-8'); ?>.svg</code>
          <button type="button" data-copy="url-1x1-svg" title="Copy"><i class="fa-regular fa-copy"></i></button>
        </div>
        <div class="url-item">
          <code id="url-4x3-svg">https://flagcdn.io/flags/4x3/<?php echo htmlspecialchars($cc, ENT_QUOTES, 'UTF-8'); ?>.svg</code>
          <button type="button" data-copy="url-4x3-svg" title="Copy"><i class="fa-regular fa-copy"></i></button>
        </div>
        <div class="url-item">
          <code id="url-short">https://flagcdn.io/<?php echo htmlspecialchars($cc, ENT_QUOTES, 'UTF-8'); ?>.svg</code>
          <button type="button" data-copy="url-short" title="Copy"><i class="fa-regular fa-copy"></i></button>
        </div>
        <div class="url-item">
          <code id="url-css">https://flagcdn.io/css/flag-icons.min.css (use &lt;span class="fi fi-<?php echo htmlspecialchars($cc, ENT_QUOTES, 'UTF-8'); ?>"&gt;)</code>
          <button type="button" data-copy="url-css" title="Copy"><i class="fa-regular fa-copy"></i></button>
        </div>
      </div>
    </section>

    <!-- Related flags -->
    <?php if (!empty($related)): ?>
      <section class="flag-section">
        <h2><i class="fa-solid fa-earth-americas"></i> Other <?php echo htmlspecialchars($continent, ENT_QUOTES, 'UTF-8'); ?> flags</h2>
        <div class="related-grid">
          <?php foreach ($related as $r): ?>
            <a class="related-card" href="/flag/<?php echo urlencode($r['code']); ?>/">
              <img src="<?php echo htmlspecialchars(raster_public_url('1x1', 48, $r['code'], 'png'), ENT_QUOTES, 'UTF-8'); ?>" alt="" width="28" height="28" loading="lazy">
              <div class="related-meta">
                <div class="related-code"><?php echo strtoupper(htmlspecialchars($r['code'], ENT_QUOTES, 'UTF-8')); ?></div>
                <div class="related-name"><?php echo htmlspecialchars($r['name'], ENT_QUOTES, 'UTF-8'); ?></div>
              </div>
            </a>
          <?php endforeach; ?>
        </div>
      </section>
    <?php endif; ?>

    <p style="text-align:center;margin-top:2rem;color:var(--bs-tertiary-color,#6b7d92);font-size:0.85rem;">
      <a href="/flags/">← Browse all flags</a>
    </p>
  </div>
</main>

<div class="toast" id="toast"></div>

<?php
// 注入 SVG 内容到 JS 变量（供前端切换 ratio/format）
$jsData = [
    'cc' => $cc,
    'svg1x1' => $svg1x1Content,
    'svg4x3' => $svg4x3Content,
];
$footerScripts = '<script>window.__flagData = ' . json_encode($jsData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . ';</script>' . "\n"
    . '<script src="/assets/flag-detail.js"></script>';
require __DIR__ . '/footer.php';
?>
