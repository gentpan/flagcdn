import { GITHUB_REPO } from "../config";
import { useSiteI18n } from "../hooks/useSiteI18n";

export function IssuesPage() {
  const { t } = useSiteI18n();

  return (
    <div className="container-app issues-page">
      <header className="issues-page__hero">
        <h1>{t("nav.feedback")}</h1>
        <p>Report flag errors, request new flags, or suggest improvements.</p>
      </header>
      <section className="issues-page__card card squircle">
        <p>
          Send feedback to <a href="mailto:support@flagcdn.io">support@flagcdn.io</a> or open an issue on{" "}
          <a href={`https://github.com/${GITHUB_REPO}/issues`} target="_blank" rel="noopener">
            GitHub Issues
          </a>
          .
        </p>
      </section>
    </div>
  );
}
