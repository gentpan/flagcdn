import { Link } from "react-router";
import { GITHUB_REPO } from "../../config";
import { useSiteI18n } from "../../hooks/useSiteI18n";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { t } = useSiteI18n();

  return (
    <footer className="footer">
      <div className="footer__main container-app">
        <p className="footer__tagline">{t("footer.tagline")}</p>
        <p className="footer__license">Flag assets and source code are available under the MIT License.</p>
      </div>
      <div className="footer__bar">
        <div className="container-app footer__bar-inner">
          <p className="footer__copy">
            © {year}{" "}
            <span className="footer__domain">
              flagcdn<span className="footer__domain-tld">.io</span>
            </span>{" "}
            {t("footer.rights")}
          </p>
          <div className="footer__icons">
            <Link to="/docs" className="footer__icon squircle" title="Docs">
              <i className="fa-solid fa-file-lines" aria-hidden="true" />
            </Link>
            <a href="mailto:support@flagcdn.io" className="footer__icon squircle" title="support@flagcdn.io" aria-label="Email">
              <i className="fa-solid fa-envelope" aria-hidden="true" />
            </a>
            <a
              href={`https://github.com/${GITHUB_REPO}`}
              className="footer__icon squircle"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
            >
              <i className="fa-brands fa-github" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer__brand" aria-hidden="true">
        <span className="footer__brand-text">flagcdn</span>
      </div>
    </footer>
  );
}
