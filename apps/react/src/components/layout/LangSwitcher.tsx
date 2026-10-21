import { useEffect, useState } from "react";
import { SITE_LANGS, type SiteLang } from "../../i18n/langs";
import { useSiteI18n } from "../../hooks/useSiteI18n";

export function LangSwitcher() {
  const { lang, currentLang, setLang } = useSiteI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  function pick(code: SiteLang) {
    setLang(code);
    setOpen(false);
  }

  return (
    <div className="lang">
      <button
        type="button"
        className="lang__trigger nav__icon-btn squircle"
        aria-label={`Language: ${currentLang.label}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <span className={`fi lang__flag fi-${currentLang.flag}`} aria-hidden="true" />
      </button>
      {open && (
        <ul className="lang__menu squircle" role="listbox">
          {SITE_LANGS.map((item) => (
            <li
              key={item.code}
              role="option"
              className="lang__option squircle"
              aria-selected={lang === item.code}
              onClick={() => pick(item.code)}
            >
              <span className={`fi fi-${item.flag}`} aria-hidden="true" />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
