export const CONTINENTS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
  "Antarctica",
] as const;

export type ContinentName = typeof CONTINENTS[number];

const CONTINENT_SLUGS: Record<ContinentName, string> = {
  Africa: "africa",
  Asia: "asia",
  Europe: "europe",
  "North America": "north-america",
  Oceania: "oceania",
  "South America": "south-america",
  Antarctica: "antarctica",
};

const CONTINENTS_BY_SLUG = Object.fromEntries(
  CONTINENTS.map((continent) => [CONTINENT_SLUGS[continent], continent]),
) as Record<string, ContinentName>;

export function continentToSlug(continent: string) {
  return CONTINENT_SLUGS[continent as ContinentName] || continent.toLowerCase().replace(/\s+/g, "-");
}

export function continentFromSlug(slug: string) {
  return CONTINENTS_BY_SLUG[slug];
}

export function collectContinentRoutes() {
  return CONTINENTS.map((continent) => `/${continentToSlug(continent)}`);
}
