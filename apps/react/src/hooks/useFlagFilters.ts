import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import type { Country, Ratio } from "../types/flag";
import { CONTINENTS } from "../utils/continents";
import { isCountryFlag } from "../utils/country-kind";

export function useFlagFilters(countries: Country[]) {
  const [query, setQuery] = useState("");
  const [continent, setContinent] = useState("");
  const [ratio, setRatio] = useState<Ratio>("4x3");

  const fuse = useMemo(
    () =>
      new Fuse(countries, {
        keys: ["name", "name_zh", "name_ja", "code", "capital", "continent"],
        threshold: 0.35,
      }),
    [countries],
  );

  const searched = useMemo(() => {
    const q = query.trim();
    if (!q) return countries;
    return fuse.search(q).map((r) => r.item);
  }, [countries, fuse, query]);

  const filtered = useMemo(() => {
    const c = continent;
    if (!c) return searched;
    if (c === "non-iso") return searched.filter((x) => !isCountryFlag(x));
    return searched.filter((x) => x.continent === c);
  }, [continent, searched]);

  const isoFlags = useMemo(() => filtered.filter(isCountryFlag), [filtered]);
  const nonIsoFlags = useMemo(() => filtered.filter((x) => !isCountryFlag(x)), [filtered]);

  return {
    query,
    setQuery,
    continent,
    setContinent,
    ratio,
    setRatio,
    continents: CONTINENTS,
    filtered,
    isoFlags,
    nonIsoFlags,
    total: countries.length,
  };
}
