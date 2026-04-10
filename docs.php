<?php
$pageTitle = 'How to Use Flag Icons – CSS & HTML Guide | flagcdn.io';
$pageDescription = 'Add country flag icons to your site in one line. Include flag-icons CSS, use fi and fi-xx classes, or link to SVG URLs. 4:3 and 1:1 aspect ratios, ISO 3166-1 codes.';
$pageKeywords = 'flag icons usage, flag CSS, country flag HTML, SVG flag URL, ISO 3166 flags, flag-icons CDN, embed flags';
$canonicalUrl = 'https://flagcdn.io/docs/';
$baseHref = '/';
$extraHead = '<style>
    :root {
      --fa-family-classic: "Font Awesome 7 Pro";
      --accent-dark: #008858;
      --text: var(--bs-body-color, #1c4741);
      --line-strong: var(--bs-border-color, #9ebcb6);
      --pane-bg: var(--bs-success-bg-subtle, #e3f9e9);
      --muted: var(--bs-tertiary-color, #5e827d);
      --accent: var(--bs-accent, #2ba471);
      --font-body: "Lexend Deca", "PingFang SC", "Microsoft JhengHei", "Microsoft YaHei", sans-serif;
    }
    html[data-theme="dark"] {
      --accent-dark: #56c08d;
      --pane-bg: var(--bs-surface, #343a40);
    }
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme]) {
        --accent-dark: #56c08d;
        --pane-bg: var(--bs-surface, #343a40);
      }
    }
    .docs { padding-bottom: 2rem; font-family: var(--font-body); line-height: 1.4; }
    .docs h2 { font-size: 1.25rem; margin: 2rem 0 0.75rem; padding-bottom: 0.35rem; border-bottom: 1px solid var(--line-strong, #9ebcb6); color: var(--text, #1c4741); }
    .docs h2:first-child { margin-top: 0; }
    .docs p { margin-bottom: 1rem; }
    .docs ul { margin: 0 0 1rem 1.25rem; }
    .docs li { margin-bottom: 0.35rem; }
    .docs .code { font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; display: inline; padding: 0.15rem 0.4rem; background: var(--pane-bg, #e6efed); font-size: 0.875rem; border: 1px solid var(--line-strong, #9ebcb6); }
    .docs .example { margin: 1rem 0; }
    .docs .example span { margin-right: 0.5rem; vertical-align: middle; }
    .docs a {
      font-family: var(--font-body);
      font-size: 15px;
      color: color-mix(in srgb, var(--accent-dark) 72%, var(--text) 28%);
      text-decoration: none;
      border-bottom: 1px dotted color-mix(in srgb, var(--line-strong) 60%, var(--accent-dark) 40%);
    }
    .docs a:hover { border-bottom-style: solid; }
    .docs a .docs-link-icon { margin-left: 0.25em; font-size: 0.8em; opacity: 0.8; vertical-align: middle; }
    .code-block {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.5rem 0 1rem;
      padding: 0.4rem 0.6rem;
      border: 1px solid var(--line-strong, #9ebcb6);
      background: var(--pane-bg, #e6efed);
      border-radius: 4px;
    }
    .code-block pre {
      flex: 1;
      margin: 0;
      padding: 0;
      font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.875rem;
      overflow-x: auto;
      background: none;
      border: none;
      white-space: nowrap;
    }
    .code-copy-btn {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--muted, #5e827d);
      transition: color 0.2s;
    }
    .code-copy-btn:hover { color: var(--accent-dark, #0b6f45); }
    .code-copy-btn.copied { color: var(--accent, #0f8b57); }
    .docs-cdn-label { margin-top: 1.25rem; margin-bottom: 0.35rem; font-size: 0.9rem; color: var(--muted, #5e827d); }
    .docs-cdn-label:first-of-type { margin-top: 0; }
  </style>';
$bodyAttr = 'data-i18n-page-title="docs.titleFull"';
require __DIR__ . '/header.php';
?>
  <section class="welcome welcome--compact">
    <div class="container">
      <h1 class="welcome-title welcome-title--compact" data-i18n="docs.title">Docs</h1>
      <p class="welcome-desc" data-i18n="docs.heroSub">How to include and use flag icons on flagcdn.io</p>
    </div>
  </section>

  <main class="container docs">
    <h2 data-i18n="docs.section1Title">1. Include CSS</h2>
    <p data-i18n-html="docs.section1Intro">Add the stylesheet in your page <code class="code">&lt;head&gt;</code> (choose one):</p>

    <p class="docs-cdn-label" data-i18n="docs.section1Cdn"><strong>This site CDN (recommended)</strong></p>
    <div class="code-block">
      <pre>&lt;link rel="stylesheet" href="https://flagcdn.io/css/flag-icons.min.css" /&gt;</pre>
      <button type="button" class="code-copy-btn" data-copy="&lt;link rel=&quot;stylesheet&quot; href=&quot;https://flagcdn.io/css/flag-icons.min.css&quot; /&gt;" aria-label="Copy"><i class="fa-regular fa-copy" aria-hidden="true"></i></button>
    </div>

    <p class="docs-cdn-label" data-i18n="docs.section1Relative">Or use a relative path (same origin):</p>
    <div class="code-block">
      <pre>&lt;link rel="stylesheet" href="./css/flag-icons.min.css" /&gt;</pre>
      <button type="button" class="code-copy-btn" data-copy="&lt;link rel=&quot;stylesheet&quot; href=&quot;./css/flag-icons.min.css&quot; /&gt;" aria-label="Copy"><i class="fa-regular fa-copy" aria-hidden="true"></i></button>
    </div>

    <p class="docs-cdn-label"><strong>jsDelivr</strong></p>
    <div class="code-block">
      <pre>&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flag-icons@7/css/flag-icons.min.css" /&gt;</pre>
      <button type="button" class="code-copy-btn" data-copy="&lt;link rel=&quot;stylesheet&quot; href=&quot;https://cdn.jsdelivr.net/npm/flag-icons@7/css/flag-icons.min.css&quot; /&gt;" aria-label="Copy"><i class="fa-regular fa-copy" aria-hidden="true"></i></button>
    </div>

    <p class="docs-cdn-label"><strong>jsDelivr (static.bluecdn.com)</strong></p>
    <div class="code-block">
      <pre>&lt;link rel="stylesheet" href="https://static.bluecdn.com/npm/flag-icons@7/css/flag-icons.min.css" /&gt;</pre>
      <button type="button" class="code-copy-btn" data-copy="&lt;link rel=&quot;stylesheet&quot; href=&quot;https://static.bluecdn.com/npm/flag-icons@7/css/flag-icons.min.css&quot; /&gt;" aria-label="Copy"><i class="fa-regular fa-copy" aria-hidden="true"></i></button>
    </div>

    <p class="docs-cdn-label"><strong>cdnjs</strong></p>
    <div class="code-block">
      <pre>&lt;link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flag-icons/7.5.0/css/flag-icons.min.css" /&gt;</pre>
      <button type="button" class="code-copy-btn" data-copy="&lt;link rel=&quot;stylesheet&quot; href=&quot;https://cdnjs.cloudflare.com/ajax/libs/flag-icons/7.5.0/css/flag-icons.min.css&quot; /&gt;" aria-label="Copy"><i class="fa-regular fa-copy" aria-hidden="true"></i></button>
    </div>

    <p class="docs-cdn-label"><strong>cdnjs (cndjs.bluecdn.com)</strong></p>
    <div class="code-block">
      <pre>&lt;link rel="stylesheet" href="https://cndjs.bluecdn.com/ajax/libs/flag-icons/7.5.0/css/flag-icons.min.css" /&gt;</pre>
      <button type="button" class="code-copy-btn" data-copy="&lt;link rel=&quot;stylesheet&quot; href=&quot;https://cndjs.bluecdn.com/ajax/libs/flag-icons/7.5.0/css/flag-icons.min.css&quot; /&gt;" aria-label="Copy"><i class="fa-regular fa-copy" aria-hidden="true"></i></button>
    </div>

    <h2 data-i18n="docs.section2Title">2. HTML usage</h2>
    <p data-i18n-html="docs.section2Intro">Use the <code class="code">fi</code> and <code class="code">fi-xx</code> classes, where <code class="code">xx</code> is the ISO 3166-1-alpha-2 country code (lowercase).</p>
    <p data-i18n="docs.section2AspectNote">We provide two aspect ratios: 4:3 (default) and 1:1. Many other flag CDNs use SVGs with inconsistent or incorrect proportions; we normalize all flags to 4:3 for a cleaner, more consistent look.</p>
    <p data-i18n="docs.section2_4x3"><strong>4:3 aspect (default)</strong></p>
    <div class="code-block">
      <pre>&lt;span class="fi fi-us"&gt;&lt;/span&gt; <span data-i18n="docs.exampleUs">United States</span></pre>
      <button type="button" class="code-copy-btn" data-copy="&lt;span class=&quot;fi fi-us&quot;&gt;&lt;/span&gt;" aria-label="Copy"><i class="fa-regular fa-copy" aria-hidden="true"></i></button>
    </div>
    <div class="example"><span class="fi fi-us"></span> <span data-i18n="docs.exampleUs">United States</span></div>
    <p data-i18n-html="docs.section2_1x1"><strong>1:1 square</strong>: add <code class="code">fis</code> to the class.</p>
    <div class="code-block">
      <pre>&lt;span class="fi fi-us fis"&gt;&lt;/span&gt; <span data-i18n="docs.exampleUs">United States</span></pre>
      <button type="button" class="code-copy-btn" data-copy="&lt;span class=&quot;fi fi-us fis&quot;&gt;&lt;/span&gt;" aria-label="Copy"><i class="fa-regular fa-copy" aria-hidden="true"></i></button>
    </div>
    <div class="example"><span class="fi fi-us fis"></span> <span data-i18n="docs.exampleUs">United States</span></div>

    <h2 data-i18n="docs.section3Title">3. As background image</h2>
    <p data-i18n-html="docs.section3Intro">Use the <code class="code">fib</code> class when using the flag as a background, and set width/height or padding as needed.</p>
    <div class="code-block">
      <pre>&lt;span class="fi fi-cn fib" style="width:32px;height:24px;display:inline-block;"&gt;&lt;/span&gt;</pre>
      <button type="button" class="code-copy-btn" data-copy="&lt;span class=&quot;fi fi-cn fib&quot; style=&quot;width:32px;height:24px;display:inline-block;&quot;&gt;&lt;/span&gt;" aria-label="Copy"><i class="fa-regular fa-copy" aria-hidden="true"></i></button>
    </div>

    <h2 data-i18n="docs.section4Title">4. Country codes</h2>
    <p data-i18n="docs.section4Intro">On the homepage you can search and copy HTML for any flag. Common examples:</p>
    <ul>
      <li data-i18n-html="docs.section4Line1"><code class="code">cn</code> China · <code class="code">us</code> United States · <code class="code">gb</code> United Kingdom · <code class="code">jp</code> Japan</li>
      <li data-i18n-html="docs.section4Line2"><code class="code">de</code> Germany · <code class="code">fr</code> France · <code class="code">eu</code> European Union</li>
    </ul>

    <h2 data-i18n="docs.section5Title">5. Direct SVG URL</h2>
    <p data-i18n-html="docs.section5UrlIntro">You can link to a flag SVG directly by using the explicit asset path. Use it in <code class="code">&lt;img src="..."&gt;</code> or as background-image.</p>
    <p class="docs-cdn-label" data-i18n="docs.section5ExplicitPath"><strong>4:3 / 1:1 (explicit path)</strong></p>
    <div class="code-block">
      <pre>https://flagcdn.io/flags/4x3/cn.svg</pre>
      <button type="button" class="code-copy-btn" data-copy="https://flagcdn.io/flags/4x3/cn.svg" aria-label="Copy"><i class="fa-regular fa-copy" aria-hidden="true"></i></button>
    </div>
    <div class="code-block">
      <pre>https://flagcdn.io/flags/1x1/cn.svg</pre>
      <button type="button" class="code-copy-btn" data-copy="https://flagcdn.io/flags/1x1/cn.svg" aria-label="Copy"><i class="fa-regular fa-copy" aria-hidden="true"></i></button>
    </div>

    <h2 data-i18n="docs.section6Title">6. License and contact</h2>
    <p data-i18n-html="docs.section6Line1">Icons are from <a href="https://github.com/lipis/flag-icons" target="_blank" rel="noopener">flag-icons</a>, MIT license.</p>
    <p data-i18n-html="docs.section6Line2">Site: <a href="https://flagcdn.io">flagcdn.io</a>. Questions or feedback: <a href="mailto:support@flagcdn.io">support@flagcdn.io</a>.</p>
  </main>

  <div id="copy-toast" class="toast" aria-live="polite"><i class="fa-solid fa-check"></i><span data-i18n="toast.copied">Copied</span></div>

<?php
$footerClass = 'docs-footer';
$showFooterNav = true;
ob_start();
?>
  <script src="/assets/i18n.js"></script>
  <script>
    (function () {
      var toast = document.getElementById("copy-toast");
      var timer = null;
      function showToast() {
        if (!toast) return;
        toast.classList.add("show");
        clearTimeout(timer);
        timer = setTimeout(function () { toast.classList.remove("show"); }, 2000);
      }
      document.querySelectorAll(".code-copy-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var text = this.getAttribute("data-copy");
          if (!text) return;
          navigator.clipboard.writeText(text).then(function () {
            showToast();
            var icon = btn.querySelector("i");
            var orig = icon.className;
            btn.classList.add("copied");
            icon.className = "fa-solid fa-check";
            icon.style.color = "#2ba471";
            setTimeout(function () {
              btn.classList.remove("copied");
              icon.className = orig;
              icon.style.color = "";
            }, 2000);
          });
        });
      });
      (function addDocsLinkIcons() {
        var icon = document.createElement("i");
        icon.className = "fa-sharp fa-thin fa-square-arrow-up-right docs-link-icon";
        icon.setAttribute("aria-hidden", "true");
        document.querySelectorAll(".docs a").forEach(function (a) {
          if (!a.querySelector(".docs-link-icon")) {
            a.appendChild(icon.cloneNode(true));
          }
        });
      })();
    })();
  </script>
<?php
$footerScripts = ob_get_clean();
require __DIR__ . '/footer.php';
?>
