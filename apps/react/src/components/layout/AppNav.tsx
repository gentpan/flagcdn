import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { GITHUB_REPO } from "../../config";
import { useNavStats } from "../../hooks/useNavStats";
import { useSiteI18n } from "../../hooks/useSiteI18n";
import { LangSwitcher } from "./LangSwitcher";

function readDark() {
  return document.documentElement.classList.contains("dark");
}

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? "nav__link squircle router-link-active" : "nav__link squircle";
}

export function AppNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useSiteI18n();
  const { requestCount, githubStars } = useNavStats();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(readDark());
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("flagcdn-theme", next ? "dark" : "light");
  }

  return (
    <>
      <header className="nav">
        <div className="nav__shell">
          <div className="nav__bar">
            <Link to="/" className="nav__logo">
              <img src="/logo.svg" alt="" width="22" height="22" className="nav__logo-mark" aria-hidden="true" />
              <span>
                flagcdn<span className="nav__logo-tld">.io</span>
              </span>
            </Link>
            <nav className="nav__links" aria-label="Main">
              <NavLink to="/flags" className={navLinkClass}>
                <i className="fa-solid fa-flag" aria-hidden="true" />
                {t("nav.flags")}
              </NavLink>
              <NavLink to="/docs" className={navLinkClass}>
                <i className="fa-solid fa-file-lines" aria-hidden="true" />
                {t("nav.docs")}
              </NavLink>
              <NavLink to="/changelog" className={navLinkClass}>
                <i className="fa-solid fa-clock-rotate-left" aria-hidden="true" />
                {t("nav.changelog")}
              </NavLink>
              <NavLink to="/issues" className={navLinkClass}>
                <i className="fa-solid fa-comment-dots" aria-hidden="true" />
                {t("nav.feedback")}
              </NavLink>
            </nav>
            <div className="nav__actions">
              <span className="nav__badge" title="API requests (30 days)">
                <i className="fa-solid fa-bolt" aria-hidden="true" />
                {requestCount}
              </span>
              <LangSwitcher />
              <a
                href={`https://github.com/${GITHUB_REPO}`}
                className="nav__icon-btn squircle nav__icon-btn--github"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
              >
                <i className="fa-brands fa-github" aria-hidden="true" />
                {githubStars && <span className="nav__github-stars">{githubStars}</span>}
              </a>
              <button type="button" className="nav__theme nav__icon-btn squircle" aria-label="Toggle theme" onClick={toggleTheme}>
                <i className={`fa-solid ${isDark ? "fa-sun" : "fa-moon"}`} />
              </button>
              <button
                type="button"
                className="nav__menu nav__icon-btn squircle"
                aria-label="Menu"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <i className="fa-solid fa-bars" />
              </button>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="nav__mobile">
            <Link to="/flags" className="nav__mobile-link squircle" onClick={() => setMobileOpen(false)}>
              <i className="fa-solid fa-flag" /> {t("nav.flags")}
            </Link>
            <Link to="/docs" className="nav__mobile-link squircle" onClick={() => setMobileOpen(false)}>
              <i className="fa-solid fa-file-lines" /> {t("nav.docs")}
            </Link>
            <Link to="/changelog" className="nav__mobile-link squircle" onClick={() => setMobileOpen(false)}>
              <i className="fa-solid fa-clock-rotate-left" /> {t("nav.changelog")}
            </Link>
            <Link to="/issues" className="nav__mobile-link squircle" onClick={() => setMobileOpen(false)}>
              <i className="fa-solid fa-comment-dots" /> {t("nav.feedback")}
            </Link>
          </div>
        )}
      </header>
      <div className="nav__spacer" aria-hidden="true" />
    </>
  );
}
