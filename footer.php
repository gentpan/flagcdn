<?php
require_once __DIR__ . '/includes/site-config.php';
$footerClass = isset($footerClass) ? $footerClass : '';
$showFooterNav = isset($showFooterNav) ? $showFooterNav : false;
$footerScripts = isset($footerScripts) ? $footerScripts : '';
$siteScriptVersion = @filemtime(__DIR__ . '/assets/site.js');
?>
    <footer class="footer<?php echo $footerClass ? ' ' . $footerClass : ''; ?>">
      <div class="footer-main">
        <div class="container-cleanip">
          <p class="footer-tagline" data-i18n="footer.tagline">Lightweight SVG country flags · Fast CDN · ISO 3166-1</p>
          <div class="footer-watermark-wrap" aria-hidden="true">
            <span class="footer-watermark">flagcdn</span>
          </div>
        </div>
      </div>
      <div class="footer-bar">
        <div class="container-cleanip footer-bar-inner">
          <p class="footer-copy">© 2026 <span class="footer-copy-domain">flagcdn.io</span> All rights reserved.</p>
          <div class="footer-icons">
            <a href="/docs/" class="footer-icon" title="Docs"><i class="fa-solid fa-file-lines"></i></a>
            <a href="mailto:support@flagcdn.io" class="footer-icon" title="support@flagcdn.io" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
            <a href="<?php echo FLAGCDN_GITHUB_URL; ?>" class="footer-icon" target="_blank" rel="noopener noreferrer" title="GitHub"><i class="fa-brands fa-github"></i></a>
          </div>
        </div>
      </div>
    </footer>

    <?php echo $footerScripts; ?>
    <script src="/assets/site.js<?php echo $siteScriptVersion ? '?v=' . rawurlencode((string) $siteScriptVersion) : ''; ?>"></script>
  </body>
</html>
