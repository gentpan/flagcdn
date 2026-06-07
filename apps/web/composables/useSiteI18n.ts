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
    "footer.tagline": "Lightweight SVG country flags · Fast CDN · ISO 3166-1",
    "footer.rights": "All rights reserved.",
    "search.placeholder": "Search country, code, capital…",
    "hero.title": "Country Flag Icons",
    "hero.sub": "270+ ISO flags · SVG / PNG / WebP / AVIF · Copy code or download at any size",
    "hero.browse": "Browse all",
    "flags.title": "All flags",
    "flags.sub": "Click any flag for SVG code, CDN URLs, and multi-format export.",
    "filter.continent": "Continent",
    "filter.all": "All",
    "filter.nonIso": "Non-ISO",
    "filter.ratio": "Aspect ratio",
    "section.isoFlags": "Country flags",
    "section.otherFlags": "Other flags",
    "bento.flagsTitle": "270+ Flags",
    "bento.flagsDesc": "ISO 3166-1 countries and territories, plus regions and organizations.",
    "bento.ratioTitle": "4:3 & 1:1",
    "bento.ratioDesc": "Two aspect ratios for clean, aligned layouts.",
    "bento.cdnTitle": "CDN Powered",
    "bento.cdnDesc": "Global edge delivery. One CSS link to get started.",
    "bento.copyTitle": "Per-flag pages",
    "bento.copyDesc": "Copy HTML, SVG URL, or download raster formats on each detail page.",
    "bento.pagesTitle": "Detail pages",
    "bento.pagesDesc": "Every flag has SEO-friendly docs with export presets.",
  },
  zh: {
    "nav.flags": "Flags",
    "nav.docs": "使用说明",
    "nav.changelog": "更新日志",
    "nav.feedback": "反馈",
    "changelog.heroSub": "flagcdn.io 的修复、更新与改进",
    "footer.tagline": "轻量 SVG 国旗 · 高速 CDN · ISO 3166-1",
    "footer.rights": "保留所有权利。",
    "search.placeholder": "搜索国家、代码、首都…",
    "hero.title": "国旗图标",
    "hero.sub": "270+ ISO 国旗 · SVG / PNG / WebP / AVIF · 复制代码或按尺寸下载",
    "hero.browse": "浏览全部",
    "flags.title": "全部国旗",
    "flags.sub": "点击国旗查看 SVG 代码、CDN 链接与多格式导出。",
    "filter.continent": "大洲",
    "filter.all": "全部",
    "filter.nonIso": "非 ISO",
    "filter.ratio": "宽高比",
    "section.isoFlags": "国家与地区",
    "section.otherFlags": "其他旗帜",
    "bento.flagsTitle": "270+ 国旗",
    "bento.flagsDesc": "ISO 3166-1 国家与地区，以及区域与组织旗帜。",
    "bento.ratioTitle": "4:3 与 1:1",
    "bento.ratioDesc": "两种比例，便于整齐排版。",
    "bento.cdnTitle": "CDN 加速",
    "bento.cdnDesc": "全球边缘节点，一行 CSS 即可使用。",
    "bento.copyTitle": "独立详情页",
    "bento.copyDesc": "在详情页复制 HTML、SVG 链接或下载栅格图。",
    "bento.pagesTitle": "详情页",
    "bento.pagesDesc": "每个国旗都有 SEO 友好的导出与文档。",
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
