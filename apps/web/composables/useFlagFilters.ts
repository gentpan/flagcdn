import Fuse from "fuse.js";
import type { Country } from "~/types/flag";
import { isCountryFlag } from "~/utils/country-kind";

const CONTINENTS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
  "Antarctica",
] as const;

export function useFlagFilters(countries: Ref<Country[] | null | undefined>) {
  const route = useRoute();
  const router = useRouter();

  const query = ref("");
  const continent = ref("");
  const ratio = ref<"4x3" | "1x1">("4x3");

  onMounted(() => {
    const q = route.query.continent;
    if (typeof q === "string") continent.value = q;
  });

  watch(continent, (value) => {
    const next = value ? { continent: value } : {};
    router.replace({ query: next });
  });

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
