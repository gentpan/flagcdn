<?php
$pageTitle = isset($pageTitle) ? $pageTitle : 'Flag Icons | flagcdn.io';
$pageDescription = isset($pageDescription) ? $pageDescription : '';
$pageKeywords = isset($pageKeywords) ? $pageKeywords : '';
$canonicalUrl = isset($canonicalUrl) ? $canonicalUrl : '';
$extraHead = isset($extraHead) ? $extraHead : '';
$bodyAttr = isset($bodyAttr) ? $bodyAttr : '';
$siteName = 'flagcdn.io';
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
    <link rel="icon" href="/favicon.ico" />
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
    <script defer src="https://tongji.giantaccel.com/script.js" data-website-id="95c95579-a91d-435c-a3c0-01f5d328f956"></script>
    <?php echo $extraHead; ?>
  </head>
  <body<?php echo $bodyAttr ? ' ' . $bodyAttr : ''; ?>>
    <header class="site-header">
      <div class="container site-header-inner">
        <a class="site-logo" href="/"><span class="hero-logo-flag fi" id="visitor-flag" aria-hidden="true"></span><span class="site-logo-text">flagcdn.io</span></a>
        <nav class="site-nav-center">
          <a href="/changelog/" class="site-nav-link" title="Changelog"><i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i> <span data-i18n="changelog.title">Changelog</span></a>
          <a href="/issues/" class="site-nav-link" title="Feedback"><i class="fa-solid fa-comment-dots" aria-hidden="true"></i> <span data-i18n="issues.title">Feedback</span></a>
        </nav>
        <nav class="site-nav">
          <div class="lang-switcher lang-dropdown">
            <button type="button" class="lang-dropdown-trigger site-nav-icon" id="lang-dropdown-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Select language">
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
          <a href="https://github.com/lipis/flag-icons" class="site-nav-link site-nav-link--github" target="_blank" rel="noopener noreferrer" title="Flag Icons on GitHub" aria-label="Flag Icons on GitHub" data-github-repo="lipis/flag-icons"><i class="fa-brands fa-github" aria-hidden="true"></i><span class="hero-github-stars-wrap"><i class="fa-solid fa-star hero-github-star-icon" aria-hidden="true"></i><span class="hero-github-stars" id="github-stars" aria-hidden="true"></span></span></a>
        </nav>
      </div>
    </header>
    <div class="announce-bar">
      <div class="announce-bar__wrap">
        <div class="announce-bar-inner">
          <div class="announce-content">
            <p class="announce-about" data-i18n-html="announce.about">Based on <a href="https://github.com/lipis/flag-icons" target="_blank" rel="noopener noreferrer">lipis/flag-icons</a>. We added more flags, fixed SVG errors, and provide free CDN. A non-profit community project.</p>
            <p class="announce-release"><span id="announce-release-content" data-i18n="announce.loading">Loading...</span></p>
          </div>
        </div>
      </div>
    </div>
