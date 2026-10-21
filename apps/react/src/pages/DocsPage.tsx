import { DocsCopyBlock } from "../components/docs/DocsCopyBlock";
import { GITHUB_REPO, SITE_URL } from "../config";
import { useSiteI18n } from "../hooks/useSiteI18n";

export function DocsPage() {
  const { t } = useSiteI18n();

  const cssLink = `<link rel="stylesheet" href="${SITE_URL}/css/flag-icons.min.css" />`;
  const htmlUs43 = '<span class="fi fi-us"></span>';
  const htmlUs11 = '<span class="fi fi-us fis"></span>';
  const htmlCnBg = '<span class="fi fi-cn fib" style="width:32px;height:24px;display:inline-block;"></span>';

  return (
    <div className="docs-page">
      <section className="docs-hero container-app">
        <h1 className="docs-hero__title">{t("docs.title")}</h1>
        <p className="docs-hero__sub">{t("docs.heroSub")}</p>
      </section>

      <main className="container-app docs">
        <h2>{t("docs.section1Title")}</h2>
        <p dangerouslySetInnerHTML={{ __html: t("docs.section1Intro") }} />
        <p className="docs-label">
          <strong>{t("docs.section1Cdn")}</strong>
        </p>
        <DocsCopyBlock text={cssLink} />

        <h2>{t("docs.section2Title")}</h2>
        <p dangerouslySetInnerHTML={{ __html: t("docs.section2Intro") }} />
        <p>{t("docs.section2AspectNote")}</p>
        <p>
          <strong>{t("docs.section2_4x3")}</strong>
        </p>
        <DocsCopyBlock text={htmlUs43} />
        <div className="docs-example">
          <span className="fi fi-us" aria-hidden="true" />
          <span>{t("docs.exampleUs")}</span>
        </div>
        <p dangerouslySetInnerHTML={{ __html: t("docs.section2_1x1") }} />
        <DocsCopyBlock text={htmlUs11} />
        <div className="docs-example">
          <span className="fi fi-us fis" aria-hidden="true" />
          <span>{t("docs.exampleUs")}</span>
        </div>

        <h2>{t("docs.section3Title")}</h2>
        <p dangerouslySetInnerHTML={{ __html: t("docs.section3Intro") }} />
        <DocsCopyBlock text={htmlCnBg} />

        <h2>{t("docs.section4Title")}</h2>
        <p>{t("docs.section4Intro")}</p>
        <ul className="docs-list">
          <li dangerouslySetInnerHTML={{ __html: t("docs.section4Line1") }} />
          <li dangerouslySetInnerHTML={{ __html: t("docs.section4Line2") }} />
        </ul>

        <h2>{t("docs.section5Title")}</h2>
        <p dangerouslySetInnerHTML={{ __html: t("docs.section5UrlIntro") }} />
        <p className="docs-label">
          <strong>{t("docs.section5ExplicitPath")}</strong>
        </p>
        <DocsCopyBlock text={`${SITE_URL}/flags/4x3/cn.svg`} />
        <DocsCopyBlock text={`${SITE_URL}/flags/1x1/cn.svg`} />
        <p className="docs-label">
          <strong>{t("docs.section5ShortPath")}</strong>
        </p>
        <DocsCopyBlock text={`${SITE_URL}/cn.svg`} />

        <h2>{t("docs.section6Title")}</h2>
        <p dangerouslySetInnerHTML={{ __html: t("docs.section6Line1") }} />
        <p className="docs-contact">
          Site: <a href="https://flagcdn.io">flagcdn.io</a>. Source code:{" "}
          <a href={`https://github.com/${GITHUB_REPO}`} target="_blank" rel="noopener">
            {GITHUB_REPO}
          </a>
          . Questions or feedback: <a href="mailto:support@flagcdn.io">support@flagcdn.io</a>.
        </p>
      </main>
    </div>
  );
}
