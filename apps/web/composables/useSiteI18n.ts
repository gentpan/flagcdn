import { docsMessages } from "~/i18n/docs";

export type SiteLang = "en" | "zh" | "ja" | "de" | "ru" | "ar";

function mergeMessages(base: Record<string, string>, extra: Record<string, string>) {
  return { ...base, ...extra };
}

export const SITE_LANGS: {
  code: SiteLang;
  flag: string;
  label: string;
}[] = [
  { code: "en", flag: "gb", label: "English" },
  { code: "zh", flag: "cn", label: "中文" },
  { code: "ja", flag: "jp", label: "日本語" },
  { code: "de", flag: "de", label: "Deutsch" },
  { code: "ru", flag: "ru", label: "Русский" },
  { code: "ar", flag: "sa", label: "العربية" },
];

const baseMessages: Record<SiteLang, Record<string, string>> = {
  en: {
    "nav.flags": "Flags",
    "nav.docs": "Docs",
    "nav.changelog": "Changelog",
    "nav.feedback": "Feedback",
    "changelog.heroSub": "Fixes, updates, and improvements to flagcdn.io",
    "footer.tagline": "Free SVG country flag icons, ISO country flags, CDN URLs, and PNG/WebP/AVIF downloads for developers.",
    "footer.rights": "All rights reserved.",
    "search.placeholder": "Search country, code, capital…",
    "hero.title": "Free Country Flag Icons",
    "hero.sub": "Browse country flags and other regional flags in SVG, PNG, WebP, and AVIF. Copy HTML snippets, use CDN URLs, or download clean 1:1 and 4:3 flag assets.",
    "hero.browse": "Browse flag library",
    "flags.title": "Country Flag Library",
    "flags.sub": "Search country flags, territory flags, regional flags, and organization flags. Each page includes SVG code, CDN links, PNG/WebP/AVIF exports, and SEO-friendly flag metadata.",
    "filter.continent": "Continent",
    "filter.all": "All",
    "filter.nonIso": "Other flags",
    "filter.ratio": "Aspect ratio",
    "section.isoFlags": "Country flags",
    "section.otherFlags": "Other flags",
    "bento.flagsTitle": "Country-first library",
    "bento.flagsDesc": "Real country flags are separated from territories, regions, organizations, and special flags for cleaner browsing.",
    "bento.ratioTitle": "SVG plus raster exports",
    "bento.ratioDesc": "Use original SVG files or generate PNG, WebP, and AVIF assets from 16px to 512px.",
    "bento.cdnTitle": "Fast CDN links",
    "bento.cdnDesc": "Copy direct CDN URLs for 1:1 and 4:3 flags, or embed the flag-icons CSS in one line.",
    "bento.copyTitle": "Developer snippets",
    "bento.copyDesc": "Each flag page includes HTML, CSS class names, inline SVG, and hotlink-ready URLs.",
    "bento.pagesTitle": "SEO flag pages",
    "bento.pagesDesc": "Every flag has a canonical page with metadata, Open Graph image, JSON-LD, aliases, capital, and region information.",
  },
  zh: {
    "nav.flags": "Flags",
    "nav.docs": "使用说明",
    "nav.changelog": "更新日志",
    "nav.feedback": "反馈",
    "changelog.heroSub": "flagcdn.io 的修复、更新与改进",
    "footer.tagline": "免费 SVG 国家旗帜图标、ISO 国旗、CDN 链接，以及 PNG/WebP/AVIF 下载，面向开发者和设计师。",
    "footer.rights": "保留所有权利。",
    "search.placeholder": "搜索国家、代码、首都…",
    "hero.title": "免费国家旗帜图标",
    "hero.sub": "浏览国家旗帜与其他地区旗帜，支持 SVG、PNG、WebP、AVIF。可复制 HTML 代码、使用 CDN 链接，或下载 1:1 与 4:3 比例资源。",
    "hero.browse": "浏览国旗库",
    "flags.title": "国家旗帜资源库",
    "flags.sub": "搜索国家旗帜、属地旗帜、地区旗帜与组织旗帜。每个页面都包含 SVG 代码、CDN 链接、PNG/WebP/AVIF 导出和 SEO 元信息。",
    "filter.continent": "大洲",
    "filter.all": "全部",
    "filter.nonIso": "其他旗帜",
    "filter.ratio": "宽高比",
    "section.isoFlags": "国家旗帜",
    "section.otherFlags": "其他旗帜",
    "bento.flagsTitle": "国家优先分类",
    "bento.flagsDesc": "真正的国家旗帜与属地、地区、组织、特殊旗帜分开展示，浏览更清晰。",
    "bento.ratioTitle": "SVG 与栅格导出",
    "bento.ratioDesc": "可使用原始 SVG，也可导出 16px 到 512px 的 PNG、WebP、AVIF。",
    "bento.cdnTitle": "高速 CDN 链接",
    "bento.cdnDesc": "复制 1:1 或 4:3 国旗 CDN 地址，也可一行引入 flag-icons CSS。",
    "bento.copyTitle": "开发者代码片段",
    "bento.copyDesc": "每个国旗页面提供 HTML、CSS class、内联 SVG 与可直接热链的 URL。",
    "bento.pagesTitle": "SEO 详情页",
    "bento.pagesDesc": "每个旗帜都有独立规范页面，包含元标题、描述、Open Graph、JSON-LD、别名、首都与地区信息。",
  },
  ja: {
    "nav.flags": "Flags",
    "nav.docs": "Docs",
    "nav.changelog": "Changelog",
    "nav.feedback": "フィードバック",
    "changelog.heroSub": "flagcdn.io の修正とアップデート",
    "footer.tagline": "軽量 SVG 国旗 · 高速 CDN · ISO 3166-1",
    "footer.rights": "All rights reserved.",
    "search.placeholder": "国名・コード・首都を検索…",
  },
  de: {
    "nav.flags": "Flags",
    "nav.docs": "Docs",
    "nav.changelog": "Changelog",
    "nav.feedback": "Feedback",
    "changelog.heroSub": "Fixes, updates, and improvements to flagcdn.io",
    "footer.tagline": "Leichte SVG-Länderflaggen · Schnelles CDN · ISO 3166-1",
    "footer.rights": "All rights reserved.",
    "search.placeholder": "Land, Code, Hauptstadt suchen…",
  },
  ru: {
    "nav.flags": "Flags",
    "nav.docs": "Docs",
    "nav.changelog": "Changelog",
    "nav.feedback": "Обратная связь",
    "changelog.heroSub": "Исправления и обновления flagcdn.io",
    "footer.tagline": "Лёгкие SVG-флаги · Быстрый CDN · ISO 3166-1",
    "footer.rights": "All rights reserved.",
    "search.placeholder": "Поиск страны, кода, столицы…",
  },
  ar: {
    "nav.flags": "Flags",
    "nav.docs": "Docs",
    "nav.changelog": "Changelog",
    "nav.feedback": "ملاحظات",
    "changelog.heroSub": "إصلاحات وتحديثات flagcdn.io",
    "footer.tagline": "أعلام SVG خفيفة · CDN سريع · ISO 3166-1",
    "footer.rights": "All rights reserved.",
    "search.placeholder": "ابحث عن دولة أو رمز أو عاصمة…",
  },
};

const messages = Object.fromEntries(
  (Object.keys(baseMessages) as SiteLang[]).map((lang) => [
    lang,
    mergeMessages(
      mergeMessages(baseMessages[lang], docsMessages.en),
      docsMessages[lang],
    ),
  ]),
) as Record<SiteLang, Record<string, string>>;

const STORAGE_KEY = "flagcdn-lang";

function readStoredLang(): SiteLang {
  if (import.meta.server) return "en";
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as SiteLang;
    if (SITE_LANGS.some((l) => l.code === stored)) return stored;
  } catch {
    /* ignore */
  }
  return "en";
}

export function useSiteI18n() {
  const lang = useState<SiteLang>("site-lang", readStoredLang);

  function t(key: string): string {
    return messages[lang.value]?.[key] ?? messages.en[key] ?? key;
  }

  function setLang(next: SiteLang) {
    lang.value = next;
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      document.documentElement.lang = next === "zh" ? "zh-CN" : next;
      document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    }
  }

  onMounted(() => {
    document.documentElement.lang = lang.value === "zh" ? "zh-CN" : lang.value;
    document.documentElement.dir = lang.value === "ar" ? "rtl" : "ltr";
  });

  const currentLang = computed(
    () => SITE_LANGS.find((l) => l.code === lang.value) ?? SITE_LANGS[0],
  );

  return { lang, currentLang, t, setLang };
}
