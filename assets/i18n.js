/**
 * Simple i18n for flagcdn.io: EN (default) / 中文
 * Usage: data-i18n="key" for text, data-i18n-placeholder="key" for input placeholder.
 * Keys use dot path, e.g. "nav.docs". Run I18n.apply() after DOM ready and on lang change.
 */
(function (global) {
  var STORAGE_KEY = "flagcdn-lang";

  var t = {
    en: {
      nav: { docs: "Docs", flags: "Flags" },
      filter: { continent: "Continent", all: "All", title: "Filter by continent" },
      search: { placeholder: "Search..." },
      toast: { copied: "Copied" },
      footer: { docs: "Docs", backtotop: "Back to top", standard: "Standard: ISO 3166-1-alpha-2", usedBy: "Used by", tagline: "Lightweight SVG country flags · Fast CDN · ISO 3166-1" },
      section: {
        isoFlags: "Country flags",
        isoFlagsSub: "ISO 3166-1-alpha-2 country and territory codes.",
        otherFlags: "Other Flags",
        otherFlagsSub: "Non-ISO flags (regions, organizations, etc.).",
      },
      footerTitle: { xifeng: "Xifeng Blog" },
      action: { copyCode: "Copy HTML code", copyImageUrl: "Copy image URL" },
      hero: { title: "Flag Icons", sub: "Country flags in SVG. Use the code icon to copy HTML, or the copy button to copy image URL and country code.", cta: "View Docs", download: "Download" },
      announce: { loading: "Loading...", latest: "Latest", released: "Released", text: "4:3 and 1:1 aspect ratios, unified for a cleaner look.", about: "Open source at <a href=\"https://github.com/gentpan/flagcdn\" target=\"_blank\" rel=\"noopener noreferrer\">github.com/gentpan/flagcdn</a>. Flag assets from <a href=\"https://github.com/lipis/flag-icons\" target=\"_blank\" rel=\"noopener noreferrer\">lipis/flag-icons</a> (MIT). Free CDN for everyone.", starCta: "Star on GitHub" },
      features: {
        heading: "What does flagcdn provide?",
        aspectTitle: "4:3 & 1:1 aspect ratios",
        aspectDesc: "Unified proportions for a consistent, clean look across all flags.",
        isoTitle: "ISO 3166-1-alpha-2",
        isoDesc: "Standard country and territory codes; search and copy HTML or image URL.",
        cdnTitle: "CDN delivery",
        cdnDesc: "Fast, stable delivery; one line of CSS to get started.",
        copyTitle: "Copy HTML & URL",
        copyDesc: "One-click copy of HTML snippet or image URL for any flag below.",
      },
      docs: {
        title: "Docs",
        titleFull: "Docs | flagcdn.io",
        heroSub: "How to include and use flag icons on flagcdn.io",
        section1Title: "1. Include CSS",
        section1Intro: "Add the stylesheet in your page <code class=\"code\">&lt;head&gt;</code> (choose one):",
        section1Cdn: "This site CDN (recommended)",
        section1Relative: "Or use a relative path (same origin):",
        btnCopy: "Copy",
        section2Title: "2. HTML usage",
        section2Intro: "Use the <code class=\"code\">fi</code> and <code class=\"code\">fi-xx</code> classes, where <code class=\"code\">xx</code> is the ISO 3166-1-alpha-2 country code (lowercase).",
        section2AspectNote: "We provide two aspect ratios: 4:3 (default) and 1:1. Many other flag CDNs use SVGs with inconsistent or incorrect proportions; we normalize all flags to 4:3 for a cleaner, more consistent look.",
        section2_4x3: "4:3 aspect (default)",
        section2_1x1: "<strong>1:1 square</strong>: add <code class=\"code\">fis</code> to the class.",
        exampleUs: "United States",
        section3Title: "3. As background image",
        section3Intro: "Use the <code class=\"code\">fib</code> class when using the flag as a background, and set width/height or padding as needed.",
        section4Title: "4. Country codes",
        section4Intro: "On the homepage you can search and copy HTML for any flag. Common examples:",
        section4Line1: "<code class=\"code\">cn</code> China · <code class=\"code\">us</code> United States · <code class=\"code\">gb</code> United Kingdom · <code class=\"code\">jp</code> Japan",
        section4Line2: "<code class=\"code\">de</code> Germany · <code class=\"code\">fr</code> France · <code class=\"code\">eu</code> European Union",
        section5Title: "5. Direct SVG URL",
        section5UrlIntro: "You can link to a flag SVG directly by using the explicit asset path. Use it in <code class=\"code\">&lt;img src=\"...\"&gt;</code> or as background-image.",
        section5ExplicitPath: "4:3 / 1:1 (explicit path)",
        section6Title: "6. License and contact",
        section6Line1: "Icons are from <a href=\"https://github.com/lipis/flag-icons\" target=\"_blank\" rel=\"noopener\">flag-icons</a>, MIT license.",
        section6Line2: "Site: <a href=\"https://flagcdn.io\">flagcdn.io</a>. Source code: <a href=\"https://github.com/gentpan/flagcdn\" target=\"_blank\" rel=\"noopener\">github.com/gentpan/flagcdn</a>. Questions or feedback: <a href=\"mailto:support@flagcdn.io\">support@flagcdn.io</a>.",
      },
      changelog: {
        title: "Changelog",
        titleFull: "Changelog | flagcdn.io",
        heroSub: "Fixes, updates, and improvements to flagcdn.io",
      },
      issues: {
        title: "Feedback",
        titleFull: "Feedback | flagcdn.io",
        heroSub: "Report flag errors, request new flags, or suggest improvements",
        formTitle: "Submit Feedback",
        labelName: "Name",
        labelEmail: "Email",
        emailHint: "Won't be displayed publicly",
        labelWebsite: "Website",
        labelType: "Type",
        typeFlagFix: "Flag Correction",
        typeNewFlag: "New Flag Request",
        typeSuggestion: "Suggestion",
        typeBug: "Bug Report",
        typeOther: "Other",
        labelTitle: "Title",
        titleHint: "Brief summary of the issue",
        labelBody: "Description",
        bodyHint: "Describe the issue in detail. You can include URLs.",
        bodyMax: "Max 2000 characters. URLs will be auto-linked.",
        btnSubmit: "Submit",
        listTitle: "All Feedback",
        loading: "Loading...",
        empty: "No feedback yet. Be the first!",
      },
    },
    zh: {
      nav: { docs: "使用说明", flags: "Flags" },
      filter: { continent: "大洲", all: "全部", title: "按大洲筛选" },
      search: { placeholder: "搜索..." },
      toast: { copied: "复制成功" },
      footer: { docs: "使用说明", backtotop: "返回顶部", standard: "标准: ISO 3166-1-alpha-2", usedBy: "已被使用", tagline: "轻量 SVG 国旗 · 高速 CDN · ISO 3166-1" },
      section: {
        isoFlags: "国家/地区旗帜",
        isoFlagsSub: "ISO 3166-1-alpha-2 国家与地区代码。",
        otherFlags: "其他旗帜",
        otherFlagsSub: "非 ISO 旗帜（地区、组织等）。",
      },
      footerTitle: { xifeng: "西风博客" },
      action: { copyCode: "复制 HTML 代码", copyImageUrl: "复制图片真实地址" },
      hero: { title: "国旗图标", sub: "SVG 国旗图标。点击代码图标复制 HTML，或点击复制按钮获取图片地址与国家代码。", cta: "查看文档", download: "下载" },
      announce: { loading: "加载中…", latest: "最新版本", released: "更新日期", text: "提供 4:3 与 1:1 比例，统一尺寸更美观。", about: "本站开源：<a href=\"https://github.com/gentpan/flagcdn\" target=\"_blank\" rel=\"noopener noreferrer\">github.com/gentpan/flagcdn</a>。国旗素材来自 <a href=\"https://github.com/lipis/flag-icons\" target=\"_blank\" rel=\"noopener noreferrer\">lipis/flag-icons</a>（MIT）。免费 CDN。", starCta: "去 GitHub 点星" },
      features: {
        heading: "flagcdn 提供哪些内容？",
        aspectTitle: "4:3 与 1:1 比例",
        aspectDesc: "统一比例，所有旗帜视觉一致、更易排版。",
        isoTitle: "ISO 3166-1-alpha-2",
        isoDesc: "标准国家与地区代码；支持搜索并复制 HTML 或图片地址。",
        cdnTitle: "CDN 加速",
        cdnDesc: "稳定快速；一行 CSS 即可接入。",
        copyTitle: "复制 HTML 与地址",
        copyDesc: "下方任意旗帜均可一键复制 HTML 或图片 URL。",
      },
      docs: {
        title: "使用说明",
        titleFull: "使用说明 | flagcdn.io",
        heroSub: "flagcdn.io 国旗图标库的引入方式与用法",
        section1Title: "1. 引入 CSS",
        section1Intro: "在页面 <code class=\"code\">&lt;head&gt;</code> 中引入样式表（二选一）：",
        section1Cdn: "本站 CDN（推荐）",
        section1Relative: "或使用相对路径（与本站同域时）：",
        btnCopy: "复制",
        section2Title: "2. HTML 用法",
        section2Intro: "使用 <code class=\"code\">fi</code> 与 <code class=\"code\">fi-xx</code> 两个 class，<code class=\"code\">xx</code> 为 ISO 3166-1-alpha-2 国家代码（小写）。",
        section2AspectNote: "本站提供两种比例：4:3（默认）与 1:1。其他不少国旗 CDN 的 SVG 尺寸比例不统一或不符合规范，本站将全部统一为 4:3，视觉更一致、更易用。",
        section2_4x3: "4:3 比例（默认）",
        section2_1x1: "<strong>1:1 正方形</strong>：在 class 中增加 <code class=\"code\">fis</code>。",
        exampleUs: "美国",
        section3Title: "3. 作为背景图",
        section3Intro: "需要将国旗作为背景时，使用 <code class=\"code\">fib</code> 类，并自行设置宽高或 padding。",
        section4Title: "4. 国家代码",
        section4Intro: "首页可搜索并点击任意国旗复制对应 HTML。常用示例：",
        section4Line1: "<code class=\"code\">cn</code> 中国 · <code class=\"code\">us</code> 美国 · <code class=\"code\">gb</code> 英国 · <code class=\"code\">jp</code> 日本",
        section4Line2: "<code class=\"code\">de</code> 德国 · <code class=\"code\">fr</code> 法国 · <code class=\"code\">eu</code> 欧盟",
        section5Title: "5. 直接访问 SVG 地址",
        section5UrlIntro: "可通过显式资源路径直接获取国旗 SVG。可用于 <code class=\"code\">&lt;img src=\"...\"&gt;</code> 或背景图。",
        section5ExplicitPath: "4:3 / 1:1（显式路径）",
        section6Title: "6. 许可与联系",
        section6Line1: "图标基于 <a href=\"https://github.com/lipis/flag-icons\" target=\"_blank\" rel=\"noopener\">flag-icons</a>，采用 MIT 许可。",
        section6Line2: "本站域名：<a href=\"https://flagcdn.io\">flagcdn.io</a>。开源仓库：<a href=\"https://github.com/gentpan/flagcdn\" target=\"_blank\" rel=\"noopener\">github.com/gentpan/flagcdn</a>。问题或建议请联系：<a href=\"mailto:support@flagcdn.io\">support@flagcdn.io</a>。",
      },
      changelog: {
        title: "更新日志",
        titleFull: "更新日志 | flagcdn.io",
        heroSub: "flagcdn.io 的修复、更新与改进记录",
      },
      issues: {
        title: "反馈",
        titleFull: "反馈 | flagcdn.io",
        heroSub: "报告旗帜错误、请求新增旗帜或提出改进建议",
        formTitle: "提交反馈",
        labelName: "昵称",
        labelEmail: "邮箱",
        emailHint: "不会公开显示",
        labelWebsite: "网址",
        labelType: "类型",
        typeFlagFix: "旗帜纠错",
        typeNewFlag: "新增旗帜",
        typeSuggestion: "建议",
        typeBug: "Bug 报告",
        typeOther: "其他",
        labelTitle: "标题",
        titleHint: "简要描述问题",
        labelBody: "详细描述",
        bodyHint: "详细描述问题，可包含链接。",
        bodyMax: "最多 2000 字符，URL 会自动变为链接。",
        btnSubmit: "提交",
        listTitle: "所有反馈",
        loading: "加载中...",
        empty: "暂无反馈，成为第一个留言者吧！",
      },
    },
    ja: {},
    de: {},
    ru: {},
    ar: {},
  };

  function getByPath(obj, path) {
    var parts = path.split(".");
    for (var i = 0; i < parts.length; i++) {
      if (obj == null) return undefined;
      obj = obj[parts[i]];
    }
    return obj;
  }

  var SUPPORTED_LANGS = ["en", "zh", "ja", "de", "ru", "ar"];

  function getLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED_LANGS.indexOf(stored) !== -1) return stored;
    } catch (e) {}
    return "en";
  }

  function setLang(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) return;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    document.documentElement.lang = lang === "zh" ? "zh-CN" : (lang === "ar" ? "ar" : lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    apply(lang);
    updateSwitcher(lang);
    try {
      document.dispatchEvent(new CustomEvent("i18n:changed", { detail: { lang: lang } }));
    } catch (e) {}
  }

  function apply(lang) {
    var L = t[lang] || t.en;
    if (lang === "ja" || lang === "de" || lang === "ru" || lang === "ar") L = Object.assign({}, t.en, L);
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = getByPath(L, key);
      if (val === undefined) return;
      if (el.getAttribute("data-i18n-html") !== null) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      var val = getByPath(L, key);
      if (val !== undefined) el.placeholder = val;
    });
    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-title");
      var val = getByPath(L, key);
      if (val !== undefined) el.setAttribute("title", val);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria-label");
      var val = getByPath(L, key);
      if (val !== undefined) el.setAttribute("aria-label", val);
    });
    var pageTitleKey = document.body && document.body.getAttribute("data-i18n-page-title");
    if (pageTitleKey) {
      var titleVal = getByPath(L, pageTitleKey);
      if (titleVal) document.title = titleVal;
    }
  }

  function updateSwitcher(current) {
    var trigger = document.getElementById("lang-dropdown-trigger");
    var flagEl = document.getElementById("lang-dropdown-flag");
    var labelEl = document.getElementById("lang-dropdown-label");
    var menu = document.getElementById("lang-dropdown-menu");
    var option = menu && menu.querySelector("[data-lang-btn=\"" + current + "\"]");
    if (option && flagEl) {
      var flag = option.getAttribute("data-lang-flag") || current;
      var label = option.getAttribute("data-lang-label") || (option.querySelector(".lang-option-name") && option.querySelector(".lang-option-name").textContent) || current;
      flagEl.className = "fi fi-" + flag + " lang-dropdown-flag";
      flagEl.setAttribute("aria-hidden", "true");
      if (labelEl) labelEl.textContent = label;
      if (trigger) trigger.setAttribute("aria-label", "Language: " + label);
    }
    if (menu) {
      var options = menu.querySelectorAll(".lang-dropdown-option");
      for (var i = 0; i < options.length; i++) {
        var opt = options[i];
        var lang = opt.getAttribute("data-lang-btn");
        opt.setAttribute("aria-selected", lang === current ? "true" : "false");
      }
    }
    document.querySelectorAll(".lang-btn[data-lang-btn]").forEach(function (btn) {
      var lang = btn.getAttribute("data-lang-btn");
      btn.classList.toggle("active", lang === current);
      btn.setAttribute("aria-pressed", lang === current ? "true" : "false");
    });
  }

  function init() {
    var lang = getLang();
    document.documentElement.lang = lang === "zh" ? "zh-CN" : (lang === "ar" ? "ar" : lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    apply(lang);
    updateSwitcher(lang);

    var dropdown = document.querySelector(".lang-dropdown");
    var trigger = document.getElementById("lang-dropdown-trigger");
    var menu = document.getElementById("lang-dropdown-menu");
    if (dropdown && trigger && menu) {
      trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        var isOpen = dropdown.classList.toggle("is-open");
        trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
      menu.querySelectorAll(".lang-dropdown-option").forEach(function (opt) {
        opt.addEventListener("click", function (e) {
          e.preventDefault();
          var l = this.getAttribute("data-lang-btn");
          if (l) setLang(l);
          dropdown.classList.remove("is-open");
          trigger.setAttribute("aria-expanded", "false");
        });
      });
      document.addEventListener("click", function (e) {
        if (!dropdown.classList.contains("is-open")) return;
        if (dropdown.contains(e.target)) return;
        dropdown.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      });
    }

    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      if (btn.getAttribute("role") === "option") return;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var l = this.getAttribute("data-lang-btn");
        if (l) setLang(l);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.I18n = {
    getLang: getLang,
    setLang: setLang,
    apply: apply,
    t: function (key) {
      return getByPath(t[getLang()], key);
    },
  };
})(typeof window !== "undefined" ? window : this);
