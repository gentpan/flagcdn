import { Link } from "react-router";
import { FlagCard } from "../components/flag/FlagCard";
import { useAllFlags } from "../hooks/useFlags";
import { useFlagFilters } from "../hooks/useFlagFilters";
import { useSiteI18n } from "../hooks/useSiteI18n";

const bentoItems = [
  { key: "flags", icon: "fa-flag", title: "bento.flagsTitle", desc: "bento.flagsDesc" },
  { key: "ratio", icon: "fa-crop-simple", title: "bento.ratioTitle", desc: "bento.ratioDesc" },
  { key: "cdn", icon: "fa-bolt", title: "bento.cdnTitle", desc: "bento.cdnDesc" },
  { key: "copy", icon: "fa-clipboard", title: "bento.copyTitle", desc: "bento.copyDesc" },
];

export function HomePage() {
  const { t } = useSiteI18n();
  const { countries } = useAllFlags();
  const {
    query,
    setQuery,
    continent,
    setContinent,
    ratio,
    setRatio,
    continents,
    isoFlags,
    nonIsoFlags,
    total,
  } = useFlagFilters(countries);

  return (
    <div>
      <section className="hero">
        <div className="container-app hero__inner">
          <div className="hero__content">
            <h1 className="hero__title">{t("hero.title")}</h1>
            <p className="hero__subtitle">{t("hero.sub")}</p>
            <div className="hero__search card squircle">
              <i className="fa-solid fa-magnifying-glass hero__search-icon" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                className="hero__search-input"
                placeholder={t("search.placeholder")}
                autoComplete="off"
              />
            </div>
            <div className="hero__cta">
              <Link to="/docs" className="btn-primary squircle">
                <i className="fa-solid fa-file-lines" /> {t("nav.docs")}
              </Link>
              <Link to="/flags" className="btn-ghost squircle">
                <i className="fa-solid fa-flag" /> {t("hero.browse")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-app bento">
        <div className="bento__grid">
          {bentoItems.map((item) => (
            <div key={item.key} className="bento__card card squircle">
              <div className="bento__head">
                <i className={`fa-solid ${item.icon}`} />
                <h3>{t(item.title)}</h3>
              </div>
              <p>{t(item.desc)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-app section">
        <div className="section__controls">
          <div className="section__tabs" role="tablist" aria-label={t("filter.continent")}>
            <button
              type="button"
              className={`section__tab squircle${!continent ? " active" : ""}`}
              role="tab"
              aria-selected={!continent}
              onClick={() => setContinent("")}
            >
              {t("filter.all")}
            </button>
            {continents.map((c) => (
              <button
                key={c}
                type="button"
                className={`section__tab squircle${continent === c ? " active" : ""}`}
                role="tab"
                aria-selected={continent === c}
                onClick={() => setContinent(c)}
              >
                {c}
              </button>
            ))}
            <button
              type="button"
              className={`section__tab squircle${continent === "non-iso" ? " active" : ""}`}
              role="tab"
              aria-selected={continent === "non-iso"}
              onClick={() => setContinent("non-iso")}
            >
              {t("filter.nonIso")}
            </button>
          </div>
          <div className="section__ratio squircle" role="group" aria-label={t("filter.ratio")}>
            <button
              type="button"
              className={`section__ratio-btn${ratio === "4x3" ? " active" : ""}`}
              onClick={() => setRatio("4x3")}
            >
              4:3
            </button>
            <button
              type="button"
              className={`section__ratio-btn${ratio === "1x1" ? " active" : ""}`}
              onClick={() => setRatio("1x1")}
            >
              1:1
            </button>
          </div>
        </div>

        <header className="section__head">
          <h2>{t("section.isoFlags")}</h2>
          <span className="section__count">
            {isoFlags.length} / {total}
          </span>
        </header>
        <div className="flags-grid">
          {isoFlags.map((c) => (
            <FlagCard key={c.code} country={c} ratio={ratio} />
          ))}
        </div>

        {nonIsoFlags.length > 0 && (
          <header className="section__head section__head--spaced">
            <h2>{t("section.otherFlags")}</h2>
            <span className="section__count">{nonIsoFlags.length}</span>
          </header>
        )}
        {nonIsoFlags.length > 0 && (
          <div className="flags-grid">
            {nonIsoFlags.map((c) => (
              <FlagCard key={c.code} country={c} ratio={ratio} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
