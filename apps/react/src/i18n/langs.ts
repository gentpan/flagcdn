export type SiteLang = "en" | "zh" | "ja" | "de" | "ru" | "ar";

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
