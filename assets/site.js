(function () {
  function loadVisitorFlag() {
    var el = document.getElementById("visitor-flag");
    if (!el) return;
    fetch("https://api.ip.sb/geoip")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var code = (data && data.country_code && String(data.country_code).toLowerCase()) || "";
        if (!code) return;
        el.classList.add("fi-" + code, "is-loaded");
        el.setAttribute("aria-hidden", "false");
      })
      .catch(function () {});
  }

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
    var url = data.html_url || "https://github.com/lipis/flag-icons/releases/latest";
    var dateStr = formatReleaseDate(data.published_at, lang);
    el.innerHTML = labels.latest + ': <a href="' + url + '" target="_blank" rel="noopener noreferrer">' + tag + "</a> · " + labels.released + " " + dateStr;
  }

  function loadAnnounceRelease() {
    var el = document.getElementById("announce-release-content");
    if (!el) return;
    fetch("https://api.github.com/repos/lipis/flag-icons/releases/latest", {
      headers: { Accept: "application/vnd.github.v3+json" }
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error(r.status)); })
      .then(function (data) {
        lastAnnounceRelease = data;
        renderAnnounceRelease(data);
      })
      .catch(function () {
        el.textContent = "flag-icons";
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
    var els = {
      requests: document.getElementById("cf-stat-requests"),
      visitors: document.getElementById("cf-stat-visitors"),
      bandwidth: document.getElementById("cf-stat-bandwidth"),
      pageviews: document.getElementById("cf-stat-pageviews"),
    };
    if (!els.requests) return;
    fetch("/api/stats.php")
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error(r.status)); })
      .then(function (d) {
        if (els.requests) els.requests.textContent = formatNumber(d.requests || 0);
        if (els.visitors) els.visitors.textContent = formatNumber(d.visitors || 0);
        if (els.bandwidth) els.bandwidth.textContent = formatBytes(d.bytes || 0);
        if (els.pageviews) els.pageviews.textContent = formatNumber(d.pageViews || 0);
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

  document.addEventListener("DOMContentLoaded", function () {
    loadVisitorFlag();
    loadGitHubStars();
    loadAnnounceRelease();
    loadCfStats();
    bindBackToTop();
  });

  document.addEventListener("i18n:changed", function () {
    if (lastAnnounceRelease) renderAnnounceRelease(lastAnnounceRelease);
  });
})();
