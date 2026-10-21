import { useSiteI18n } from "../hooks/useSiteI18n";

const entries = [
  {
    date: "2026-03-19",
    items: [
      {
        tag: "svg",
        html: 'Fix <span class="fi fi-gy changelog__flag"></span> <code>gy</code> (Guyana) — green background started at x=2.4 (4:3) / x=2 (1:1), leaving a transparent gap on the left edge. Now fills full viewBox.',
      },
      { tag: "site", html: "Add Changelog page to track all fixes and updates." },
      { tag: "site", html: "Add Feedback page — users can report flag errors, request new flags, and submit suggestions." },
      { tag: "site", html: "Add project description and Star CTA to the announce bar on homepage." },
      { tag: "site", html: "Add footer navigation with Docs, Changelog, and Feedback links." },
    ],
  },
  {
    date: "2026-06-08",
    items: [
      { tag: "site", html: "Complete stack migration: Nuxt 3 frontend + Go API backend. Legacy PHP pages archived." },
      { tag: "site", html: "Cloudflare stats, visitor country, and flag SVG bundle served by Go <code>/api/*</code>." },
    ],
  },
];

export function ChangelogPage() {
  const { t } = useSiteI18n();

  return (
    <div className="container-app changelog">
      <header className="changelog__hero">
        <h1>{t("nav.changelog")}</h1>
        <p>{t("changelog.heroSub")}</p>
      </header>

      {entries.map((group) => (
        <section key={group.date} className="changelog__group">
          <h2 className="changelog__date">{group.date}</h2>
          <ul className="changelog__list">
            {group.items.map((item, i) => (
              <li key={i} className="changelog__item">
                <span className={`changelog__tag changelog__tag--${item.tag}`}>{item.tag}</span>
                <span className="changelog__text" dangerouslySetInnerHTML={{ __html: item.html }} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
