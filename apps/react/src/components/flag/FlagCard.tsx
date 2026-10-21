import { Link } from "react-router";
import type { Country, Ratio } from "../../types/flag";
import { useSiteI18n } from "../../hooks/useSiteI18n";

export function FlagCard({ country, ratio = "4x3" }: { country: Country; ratio?: Ratio }) {
  const { lang } = useSiteI18n();
  const isChinaRegion = ["hk", "mo", "tw"].includes(country.code.toLowerCase());

  let displayName = country.name;
  if (lang === "zh" && country.name_zh) displayName = country.name_zh;
  else if (lang === "ja" && country.name_ja) displayName = country.name_ja;
  else if (lang === "de" && country.name_de) displayName = country.name_de;
  else if (lang === "ru" && country.name_ru) displayName = country.name_ru;
  else if (lang === "ar" && country.name_ar) displayName = country.name_ar;

  return (
    <Link
      to={`/flag/${country.code}`}
      className={`flag-card squircle animate-fade-in-up${isChinaRegion ? " has-badge" : ""}`}
    >
      <img
        src={`/flags/${ratio}/${country.code}.svg`}
        alt={country.name}
        width={ratio === "1x1" ? 40 : 48}
        height={ratio === "1x1" ? 40 : 36}
        loading="lazy"
        className="flag-card__img"
      />
      <div className="flag-card__meta">
        <div className="flag-card__code">{country.code.toUpperCase()}</div>
        <div className="flag-card__name">{displayName}</div>
      </div>
      {isChinaRegion && <span className="flag-card__badge">CHINA</span>}
    </Link>
  );
}
