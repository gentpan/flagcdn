(function () {
  function formatNumber(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return String(n);
  }

  function formatBytes(b) {
    if (b >= 1e12) return (b / 1e12).toFixed(1) + " TB";
    if (b >= 1e9) return (b / 1e9).toFixed(1) + " GB";
    if (b >= 1e6) return (b / 1e6).toFixed(1) + " MB";
    return (b / 1e3).toFixed(1) + " KB";
  }

  function loadCfStats() {
    var el = document.getElementById("header-requests-count");
    if (!el) return;
    fetch("/api/stats.php")
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error(r.status)); })
      .then(function (d) {
        el.textContent = formatNumber(d.requests || 0);
      })
      .catch(function () {});
  }

  function bindBackToTop() {
    document.querySelectorAll(".footer-backtotop").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function bindBannerCarousels() {
    document.querySelectorAll("[data-banner-carousel]").forEach(function (carousel) {
      var slides = Array.from(carousel.querySelectorAll("[data-banner-slide]"));
      var selectors = Array.from(carousel.querySelectorAll("[data-banner-select]"));
      var controls = carousel.querySelector("[data-banner-controls]");
      var toggle = carousel.querySelector("[data-banner-toggle]");
      var configElement = carousel.querySelector("[data-banner-config]");
      var config = configElement ? JSON.parse(configElement.textContent) : null;
      if (slides.length < 2 || !controls || !toggle) return;

      var current = 0;
      var timer = null;
      var hovered = false;
      var focused = false;
      var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      var wantsPlaying = !reducedMotion.matches;

      function schedule() {
        window.clearTimeout(timer);
        timer = null;
        if (wantsPlaying && !hovered && !focused && !document.hidden) {
          timer = window.setTimeout(function () {
            select((current + 1) % slides.length);
          }, 4000);
        }
      }

      function select(index) {
        current = index;
        slides.forEach(function (slide, slideIndex) {
          var active = slideIndex === current;
          slide.classList.toggle("is-active", active);
          slide.setAttribute("aria-hidden", String(!active));
        });
        selectors.forEach(function (selector, slideIndex) {
          var active = slideIndex === current;
          selector.classList.toggle("is-active", active);
          selector.setAttribute("aria-pressed", String(active));
        });
        schedule();
      }

      function updatePlayback() {
        toggle.setAttribute("aria-label", toggle.getAttribute(wantsPlaying ? "data-pause-label" : "data-play-label"));
        toggle.setAttribute("aria-pressed", String(!wantsPlaying));
        var icon = toggle.querySelector("i");
        if (icon) {
          icon.classList.toggle("fa-pause", wantsPlaying);
          icon.classList.toggle("fa-play", !wantsPlaying);
        }
        schedule();
      }

      function updateLanguage(siteLanguage) {
        var language = siteLanguage === "zh" ? "zh" : "en";
        if (!config || carousel.getAttribute("data-banner-language") === language) return;
        var variant = config.variants[language];
        var labels = config.labels[language];
        var banner = carousel.closest(".sponsor-banner");
        banner.lang = language === "zh" ? "zh-CN" : "en";
        banner.setAttribute("aria-label", labels.region);
        carousel.setAttribute("data-banner-language", language);
        carousel.setAttribute("aria-label", labels.region);
        carousel.setAttribute("aria-roledescription", labels.carousel);
        carousel.querySelector(".sponsor-banner-visual").setAttribute("aria-label", labels.visit);
        carousel.querySelector(".sponsor-banner-label").textContent = labels.advertisement;
        slides.forEach(function (slide, index) {
          var frame = variant.frames[index];
          var crop = slide.querySelector(".sponsor-banner-crop");
          var image = crop.querySelector("img");
          crop.style.setProperty("--banner-offset", (-100 * frame.start / frame.height) + "%");
          crop.style.setProperty("--banner-image-height", (100 * variant.height / frame.height) + "%");
          image.src = variant.image;
          image.alt = frame.alt;
        });
        selectors.forEach(function (selector, index) {
          selector.setAttribute("aria-label", labels.select.replace("%d", String(index + 1)));
        });
        toggle.setAttribute("data-pause-label", labels.pause);
        toggle.setAttribute("data-play-label", labels.play);
        updatePlayback();
      }

      document.addEventListener("i18n:changed", function (event) {
        updateLanguage(event.detail.lang);
      });
      try {
        var savedLanguage = localStorage.getItem("flagcdn-lang");
        if (/^(en|zh|ja|de|ru|ar)$/.test(savedLanguage)) updateLanguage(savedLanguage);
      } catch (e) {}

      selectors.forEach(function (selector) {
        selector.addEventListener("click", function () {
          select(Number(selector.getAttribute("data-banner-select")));
        });
      });
      toggle.addEventListener("click", function () {
        wantsPlaying = !wantsPlaying;
        updatePlayback();
      });
      carousel.addEventListener("pointerenter", function (event) {
        if (event.pointerType === "touch") return;
        hovered = true;
        schedule();
      });
      carousel.addEventListener("pointerleave", function () {
        hovered = false;
        schedule();
      });
      carousel.addEventListener("focusin", function () {
        focused = true;
        schedule();
      });
      carousel.addEventListener("focusout", function (event) {
        focused = carousel.contains(event.relatedTarget);
        schedule();
      });
      document.addEventListener("visibilitychange", schedule);
      function onMotionPreferenceChange(event) {
        wantsPlaying = !event.matches;
        updatePlayback();
      }
      if (reducedMotion.addEventListener) {
        reducedMotion.addEventListener("change", onMotionPreferenceChange);
      } else {
        reducedMotion.addListener(onMotionPreferenceChange);
      }

      controls.hidden = false;
      updatePlayback();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadCfStats();
    bindBackToTop();
    bindBannerCarousels();
  });
})();
