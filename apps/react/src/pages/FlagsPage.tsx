import { Link } from "react-router";
import { FlagCard } from "../components/flag/FlagCard";
import { useAllFlags } from "../hooks/useFlags";
import { useFlagFilters } from "../hooks/useFlagFilters";
import { useSiteI18n } from "../hooks/useSiteI18n";
import { continentToSlug } from "../utils/continents";

export function FlagsPage() {
  const { t } = useSiteI18n();
  const { countries } = useAllFlags();
  const { query, setQuery, continent, setContinent, continents, filtered } = useFlagFilters(countries);

  return (
    <div className="container-app page">
      <h1 className="page__title">{t("flags.title")}</h1>
      <p className="page__sub">{t("flags.sub")}</p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="search"
        className="search card squircle"
        placeholder={t("search.placeholder")}
      />
      <div className="chips">
        <button type="button" className={`chip squircle${!continent ? " active" : ""}`} onClick={() => setContinent("")}>
          {t("filter.all")}
        </button>
        {continents.map((c) => (
          <button
            key={c}
            type="button"
            className={`chip squircle${continent === c ? " active" : ""}`}
            onClick={() => setContinent(c)}
          >
            {c}
          </button>
        ))}
        <button
          type="button"
          className={`chip squircle${continent === "non-iso" ? " active" : ""}`}
          onClick={() => setContinent("non-iso")}
        >
          {t("filter.nonIso")}
        </button>
      </div>
      <div className="continent-map-links">
        {continents.map((c) => (
          <Link key={c} to={`/${continentToSlug(c)}`} className="continent-map-links__item squircle">
            <i className="fa-solid fa-map-location-dot" aria-hidden="true" />
            {c}
          </Link>
        ))}
      </div>
      <div className="flags-grid">
        {filtered.map((c) => (
          <FlagCard key={c.code} country={c} />
        ))}
      </div>
    </div>
  );
}
