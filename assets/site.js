(function () {
  function formatStars(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return String(n);
  }

  function loadGitHubStars() {
    var el = document.getElementById("github-stars");
    var link = document.querySelector("[data-github-repo]");
    if (!el || !link) return;
    var repo = link.getAttribute("data-github-repo");
    if (!repo) return;
    fetch("https://api.github.com/repos/" + repo, { headers: { Accept: "application/vnd.github.v3+json" } })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error(r.status)); })
      .then(function (data) {
        var n = data && typeof data.stargazers_count === "number" ? data.stargazers_count : 0;
        if (n > 0) {
          el.textContent = formatStars(n);
          el.setAttribute("aria-hidden", "false");
        }
      })
      .catch(function () {});
  }

  var announceLabels = {
    en: { latest: "Latest", released: "Released" },
    "zh-CN": { latest: "最新版本", released: "更新日期" }
  };

  function formatReleaseDate(isoString, lang) {
    if (!isoString) return "";
    var d = new Date(isoString);
    if (lang === "zh-CN") {
      return d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
    }
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  var lastAnnounceRelease = null;

  function renderAnnounceRelease(data) {
    var el = document.getElementById("announce-release-content");
    if (!el || !data) return;
    var lang = document.documentElement.lang || "en";
    var labels = announceLabels[lang] || announceLabels.en;
    var tag = data.tag_name || "";
    var repoLink = document.querySelector("[data-github-repo]");
    var repoSlug = repoLink && repoLink.getAttribute("data-github-repo");
    var fallbackRelease = repoSlug ? "https://github.com/" + repoSlug + "/releases/latest" : "https://github.com/gentpan/flagcdn/releases/latest";
    var url = data.html_url || fallbackRelease;
    var dateStr = formatReleaseDate(data.published_at, lang);
    el.innerHTML = '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + tag + '</a> · ' + dateStr;
  }

  function loadAnnounceRelease() {
    var el = document.getElementById("announce-release-content");
    if (!el) return;
    var repoLink = document.querySelector("[data-github-repo]");
    var repoSlug = (repoLink && repoLink.getAttribute("data-github-repo")) || "gentpan/flagcdn";
    fetch("https://api.github.com/repos/" + repoSlug + "/releases/latest", {
      headers: { Accept: "application/vnd.github.v3+json" }
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error(r.status)); })
      .then(function (data) {
        lastAnnounceRelease = data;
        renderAnnounceRelease(data);
      })
      .catch(function () {
        el.textContent = "flagcdn";
      });
  }

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

  function bindMobileNav() {
    var btn = document.getElementById("nav-hamburger");
    var panel = document.getElementById("nav-mobile");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      var open = panel.hasAttribute("hidden");
      if (open) {
        panel.removeAttribute("hidden");
        btn.setAttribute("aria-expanded", "true");
      } else {
        panel.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadGitHubStars();
    loadAnnounceRelease();
    loadCfStats();
    bindBackToTop();
    bindMobileNav();
  });

  document.addEventListener("i18n:changed", function () {
    if (lastAnnounceRelease) renderAnnounceRelease(lastAnnounceRelease);
  });
})();
