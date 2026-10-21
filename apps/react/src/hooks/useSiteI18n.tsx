import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { SITE_LANGS, type SiteLang } from "../i18n/langs";
import { messages } from "../i18n/messages";

const STORAGE_KEY = "flagcdn-lang";

function readStoredLang(): SiteLang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as SiteLang;
    if (SITE_LANGS.some((l) => l.code === stored)) return stored;
  } catch {
    /* ignore */
  }
  return "en";
}

function applyDocumentLang(lang: SiteLang) {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}

interface I18nContextValue {
  lang: SiteLang;
  currentLang: (typeof SITE_LANGS)[number];
  t: (key: string) => string;
  setLang: (next: SiteLang) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<SiteLang>(readStoredLang);

  useEffect(() => {
    applyDocumentLang(lang);
  }, [lang]);

  const t = useCallback(
    (key: string) => messages[lang]?.[key] ?? messages.en[key] ?? key,
    [lang],
  );

  const setLang = useCallback((next: SiteLang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const currentLang = SITE_LANGS.find((l) => l.code === lang) ?? SITE_LANGS[0];

  return (
    <I18nContext.Provider value={{ lang, currentLang, t, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useSiteI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useSiteI18n must be used within I18nProvider");
  return ctx;
}
