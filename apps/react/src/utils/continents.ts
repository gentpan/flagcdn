export const CONTINENTS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
  "Antarctica",
] as const;

export type ContinentName = (typeof CONTINENTS)[number];

const CONTINENT_SLUGS: Record<ContinentName, string> = {
  Africa: "africa",
  Asia: "asia",
  Europe: "europe",
  "North America": "north-america",
  Oceania: "oceania",
  "South America": "south-america",
  Antarctica: "antarctica",
};

export function continentToSlug(continent: string) {
  return CONTINENT_SLUGS[continent as ContinentName] || continent.toLowerCase().replace(/\s+/g, "-");
}
