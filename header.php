<?php
require_once __DIR__ . '/includes/site-config.php';
$pageTitle = isset($pageTitle) ? $pageTitle : 'Flag Icons | flagcdn.io';
$pageDescription = isset($pageDescription) ? $pageDescription : '';
$pageKeywords = isset($pageKeywords) ? $pageKeywords : '';
$canonicalUrl = isset($canonicalUrl) ? $canonicalUrl : '';
$extraHead = isset($extraHead) ? $extraHead : '';
$bodyAttr = isset($bodyAttr) ? $bodyAttr : '';
$siteName = 'flagcdn.io';
$visitorCountryCode = '';

if (!empty($_SERVER['HTTP_CF_IPCOUNTRY'])) {
    $cfCountry = strtoupper(trim((string) $_SERVER['HTTP_CF_IPCOUNTRY']));
    if (preg_match('/^[A-Z]{2}$/', $cfCountry) && $cfCountry !== 'XX' && $cfCountry !== 'T1') {
        $visitorCountryCode = strtolower($cfCountry);
    }
}
?>
<!doctype html>
<html lang="en">
  <head>
<?php if (!empty($baseHref)): ?>
    <base href="<?php echo htmlspecialchars($baseHref, ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title><?php echo htmlspecialchars($pageTitle); ?></title>
<?php if (!empty($pageDescription)): ?>
    <meta name="description" content="<?php echo htmlspecialchars($pageDescription, ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>
<?php if (!empty($pageKeywords)): ?>
    <meta name="keywords" content="<?php echo htmlspecialchars($pageKeywords, ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>
<?php if (!empty($canonicalUrl)): ?>
    <link rel="canonical" href="<?php echo htmlspecialchars($canonicalUrl, ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>
    <meta name="robots" content="index, follow">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="<?php echo htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:title" content="<?php echo htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?>">
<?php if (!empty($pageDescription)): ?>
    <meta property="og:description" content="<?php echo htmlspecialchars($pageDescription, ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>
<?php if (!empty($canonicalUrl)): ?>
    <meta property="og:url" content="<?php echo htmlspecialchars($canonicalUrl, ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?>">
<?php if (!empty($pageDescription)): ?>
    <meta name="twitter:description" content="<?php echo htmlspecialchars($pageDescription, ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="preconnect" href="https://fonts.bluecdn.com" crossorigin />
    <link rel="preconnect" href="https://icons.bluecdn.com" crossorigin />
    <link rel="dns-prefetch" href="https://api.github.com" />
    <link href="https://fonts.bluecdn.com/css2?family=Lexend+Deca:wght@400;500;600;700;800&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <link href="https://icons.bluecdn.com/fontawesome-pro/css/all.min.css" rel="stylesheet" />
    <link href="/css/flag-icons.min.css" rel="stylesheet" />
    <link href="/assets/main.css" rel="stylesheet" />
    <script>
      (function(){ var t = localStorage.getItem("flagcdn-theme"); if (t === "dark" || t === "light") document.documentElement.setAttribute("data-theme", t); })();
    </script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8025712972152197" crossorigin="anonymous"></script>
    <script defer src="https://tongji.giantaccel.com/script.js" data-website-id="95c95579-a91d-435c-a3c0-01f5d328f956"></script>
    <?php echo $extraHead; ?>
  </head>
  <body<?php echo $bodyAttr ? ' ' . $bodyAttr : ''; ?>>
    <header class="floating-nav" id="floating-nav">
      <div class="floating-nav__container">
        <div class="floating-nav__bar">
          <a class="floating-nav__logo" href="/">
            <span class="fi fi-<?php echo $visitorCountryCode ? htmlspecialchars($visitorCountryCode, ENT_QUOTES, 'UTF-8') : 'un'; ?> floating-nav__logo-flag" id="visitor-flag" aria-hidden="true"></span>
            <span class="floating-nav__logo-text">flagcdn<span class="floating-nav__logo-tld">.io</span></span>
          </a>
          <nav class="floating-nav__links" aria-label="Main">
            <a href="/flags/" class="floating-nav__link"><i class="fa-solid fa-flag" aria-hidden="true"></i> Flags</a>
            <a href="/docs/" class="floating-nav__link"><i class="fa-solid fa-file-lines" aria-hidden="true"></i> <span data-i18n="hero.cta">Docs</span></a>
            <a href="/changelog/" class="floating-nav__link"><i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i> <span data-i18n="changelog.title">Changelog</span></a>
            <a href="/issues/" class="floating-nav__link"><i class="fa-solid fa-comment-dots" aria-hidden="true"></i> <span data-i18n="issues.title">Feedback</span></a>
          </nav>
          <div class="floating-nav__actions">
            <span class="floating-nav__badge" id="header-requests-badge" title="API requests (7 days)"><i class="fa-solid fa-bolt" aria-hidden="true"></i> <span id="header-requests-count">-</span></span>
            <div class="lang-switcher lang-dropdown">
              <button type="button" class="lang-dropdown-trigger floating-nav__icon-btn" id="lang-dropdown-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Select language">
                <span class="fi fi-gb lang-dropdown-flag" id="lang-dropdown-flag" aria-hidden="true"></span>
              </button>
              <ul class="lang-dropdown-menu" id="lang-dropdown-menu" role="listbox" aria-labelledby="lang-dropdown-trigger" tabindex="-1">
                <li class="lang-dropdown-option" role="option" data-lang-btn="en" data-lang-flag="gb" data-lang-label="English"><span class="fi fi-gb"></span><span class="lang-option-name">English</span></li>
                <li class="lang-dropdown-option" role="option" data-lang-btn="zh" data-lang-flag="cn" data-lang-label="中文"><span class="fi fi-cn"></span><span class="lang-option-name">中文</span></li>
                <li class="lang-dropdown-option" role="option" data-lang-btn="ja" data-lang-flag="jp" data-lang-label="日本語"><span class="fi fi-jp"></span><span class="lang-option-name">日本語</span></li>
                <li class="lang-dropdown-option" role="option" data-lang-btn="de" data-lang-flag="de" data-lang-label="Deutsch"><span class="fi fi-de"></span><span class="lang-option-name">Deutsch</span></li>
                <li class="lang-dropdown-option" role="option" data-lang-btn="ru" data-lang-flag="ru" data-lang-label="Русский"><span class="fi fi-ru"></span><span class="lang-option-name">Русский</span></li>
                <li class="lang-dropdown-option" role="option" data-lang-btn="ar" data-lang-flag="sa" data-lang-label="العربية"><span class="fi fi-sa"></span><span class="lang-option-name">العربية</span></li>
              </ul>
            </div>
            <a href="<?php echo FLAGCDN_GITHUB_URL; ?>" class="floating-nav__icon-btn" target="_blank" rel="noopener noreferrer" title="GitHub" data-github-repo="<?php echo FLAGCDN_GITHUB_REPO; ?>"><i class="fa-brands fa-github" aria-hidden="true"></i><span class="github-stars-count" id="github-stars"></span></a>
            <button type="button" class="floating-nav__hamburger" id="nav-hamburger" aria-label="Menu" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
          </div>
        </div>
      </div>
      <div class="floating-nav__mobile" id="nav-mobile" hidden>
        <a href="/flags/" class="floating-nav__mobile-link"><i class="fa-solid fa-flag"></i> Flags</a>
        <a href="/docs/" class="floating-nav__mobile-link"><i class="fa-solid fa-file-lines"></i> Docs</a>
        <a href="/changelog/" class="floating-nav__mobile-link"><i class="fa-solid fa-clock-rotate-left"></i> Changelog</a>
        <a href="/issues/" class="floating-nav__mobile-link"><i class="fa-solid fa-comment-dots"></i> Feedback</a>
      </div>
    </header>
    <div class="floating-nav__spacer" aria-hidden="true"></div>
