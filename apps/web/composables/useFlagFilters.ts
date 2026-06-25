import Fuse from "fuse.js";
import type { Country } from "~/types/flag";
import { CONTINENTS } from "~/utils/continents";
import { isCountryFlag } from "~/utils/country-kind";

export function useFlagFilters(countries: Ref<Country[] | null | undefined>) {
  const query = ref("");
  const continent = ref("");
  const ratio = ref<"4x3" | "1x1">("4x3");

  const fuse = computed(
    () =>
      new Fuse(countries.value || [], {
        keys: ["name", "name_zh", "name_ja", "code", "capital", "continent"],
        threshold: 0.35,
      }),
  );

  const searched = computed(() => {
    const list = countries.value || [];
    const q = query.value.trim();
    if (!q) return list;
    return fuse.value.search(q).map((r) => r.item);
  });

  const filtered = computed(() => {
    const c = continent.value;
    if (!c) return searched.value;
    if (c === "non-iso") return searched.value.filter((x) => !isCountryFlag(x));
    return searched.value.filter((x) => x.continent === c);
  });

  const isoFlags = computed(() => filtered.value.filter(isCountryFlag));
  const nonIsoFlags = computed(() => filtered.value.filter((x) => !isCountryFlag(x)));

  return {
    query,
    continent,
    ratio,
    continents: CONTINENTS,
    filtered,
    isoFlags,
    nonIsoFlags,
    total: computed(() => (countries.value || []).length),
  };
}
