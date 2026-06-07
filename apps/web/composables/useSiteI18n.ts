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
    "nav.feedback": "Feedback",
    "footer.tagline": "Lightweight SVG country flags · Fast CDN · ISO 3166-1",
    "footer.rights": "All rights reserved.",
    "search.placeholder": "Search country, code, capital…",
  },
  zh: {
    "nav.flags": "Flags",
    "nav.docs": "使用说明",
    "nav.feedback": "反馈",
    "footer.tagline": "轻量 SVG 国旗 · 高速 CDN · ISO 3166-1",
    "footer.rights": "保留所有权利。",
    "search.placeholder": "搜索国家、代码、首都…",
  },
  ja: {
    "nav.flags": "Flags",
    "nav.docs": "Docs",
    "nav.feedback": "フィードバック",
    "footer.tagline": "軽量 SVG 国旗 · 高速 CDN · ISO 3166-1",
    "footer.rights": "All rights reserved.",
    "search.placeholder": "国名・コード・首都を検索…",
  },
  de: {
    "nav.flags": "Flags",
    "nav.docs": "Docs",
    "nav.feedback": "Feedback",
    "footer.tagline": "Leichte SVG-Länderflaggen · Schnelles CDN · ISO 3166-1",
    "footer.rights": "All rights reserved.",
    "search.placeholder": "Land, Code, Hauptstadt suchen…",
  },
  ru: {
    "nav.flags": "Flags",
    "nav.docs": "Docs",
    "nav.feedback": "Обратная связь",
    "footer.tagline": "Лёгкие SVG-флаги · Быстрый CDN · ISO 3166-1",
    "footer.rights": "All rights reserved.",
    "search.placeholder": "Поиск страны, кода, столицы…",
  },
  ar: {
    "nav.flags": "Flags",
    "nav.docs": "Docs",
    "nav.feedback": "ملاحظات",
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
