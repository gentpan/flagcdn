<?php
$footerClass = isset($footerClass) ? $footerClass : '';
$showFooterNav = isset($showFooterNav) ? $showFooterNav : false;
$footerScripts = isset($footerScripts) ? $footerScripts : '';
$siteScriptVersion = @filemtime(__DIR__ . '/assets/site.js');
?>
    <footer class="footer<?php echo $footerClass ? ' ' . $footerClass : ''; ?>">
      <div class="footer-main">
        <div class="container">
          <p class="footer-tagline" data-i18n="footer.tagline">Lightweight SVG country flags · Fast CDN · ISO 3166-1</p>
          <a href="https://cleanip.io" class="footer-ad-link" id="footer-ad" target="_blank" rel="noopener noreferrer" aria-label="cleanip.io">
            <div class="footer-ad-inner">
              <div class="footer-ad-icon"><i class="fa-solid fa-shield-check"></i></div>
              <div class="footer-ad-text">
                <span class="footer-ad-title">CleanIP.io</span>
                <span class="footer-ad-desc" data-i18n="ad.cleanip">IP Reputation & Purity Check — Know if your IP is clean before it matters.</span>
              </div>
              <span class="footer-ad-cta" data-i18n="ad.check">Check Now <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </a>
        </div>
      </div>
      <div class="footer-bar">
        <div class="container footer-bar-inner">
          <p class="footer-copy">© 2026 <span class="footer-copy-domain">flagcdn.io</span> All rights reserved.</p>
          <div class="footer-icons">
            <a href="mailto:support@flagcdn.io" class="footer-icon" title="support@flagcdn.io" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
            <a href="https://x.com/TheSecondUncle" class="footer-icon" target="_blank" rel="noopener noreferrer" title="X"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="https://github.com/gentpan" class="footer-icon" target="_blank" rel="noopener noreferrer" title="GitHub"><i class="fa-brands fa-github"></i></a>
            <a href="https://xifeng.net" class="footer-icon" target="_blank" rel="noopener noreferrer" data-i18n-title="footerTitle.xifeng" title="Xifeng Blog"><i class="fa-brands fa-red-river"></i></a>
          </div>
        </div>
      </div>
    </footer>

    <?php echo $footerScripts; ?>
    <script src="/assets/site.js<?php echo $siteScriptVersion ? '?v=' . rawurlencode((string) $siteScriptVersion) : ''; ?>"></script>
  </body>
</html>
