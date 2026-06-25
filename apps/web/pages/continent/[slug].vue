<template>
  <div class="container-app continent-page">
    <div class="continent-head">
      <div>
        <div class="continent-breadcrumb">
          <NuxtLink to="/flags">
            <i class="fa-solid fa-flag" aria-hidden="true" />
            Flags
          </NuxtLink>
          <span>/</span>
          <strong>{{ continent }}</strong>
        </div>
        <h1 class="continent-title">{{ continent }} flags map</h1>
      </div>
      <div class="continent-switch" aria-label="Continents">
        <NuxtLink
          v-for="item in CONTINENTS"
          :key="item"
          :to="`/continent/${continentToSlug(item)}`"
          class="continent-switch__item"
          :class="{ active: item === continent }"
        >
          {{ item }}
        </NuxtLink>
      </div>
    </div>

    <div class="continent-layout">
      <section class="continent-map card">
        <div class="continent-map__head">
          <p class="detail-label">{{ continent }} map</p>
          <span>{{ mapCountries.length }} flags</span>
        </div>
        <div
          class="continent-map__canvas"
          :style="{ '--map-cols': String(tileModel.cols), '--map-rows': String(tileModel.rows) }"
        >
          <div class="continent-map__tiles" aria-hidden="true">
            <span v-for="tile in tileModel.tiles" :key="tile.key" class="continent-map__tile-cell">
              <img class="continent-map__tile continent-map__tile--light" :src="tile.lightSrc" alt="" loading="lazy" referrerpolicy="no-referrer">
              <img class="continent-map__tile continent-map__tile--dark" :src="tile.darkSrc" alt="" loading="lazy" referrerpolicy="no-referrer">
            </span>
          </div>
          <button
            v-for="country in mapCountries"
            :key="country.code"
            type="button"
            class="continent-marker"
            :class="{ active: country.code === selectedCode }"
            :style="markerStyle(country)"
            :aria-label="country.name"
            @click="selectedCode = country.code"
          >
            <span class="continent-marker__dot" />
            <span class="continent-marker__flag">
              <img :src="`/flags/4x3/${country.code}.svg`" :alt="country.name" loading="lazy">
            </span>
            <span class="continent-marker__code">{{ country.code.toUpperCase() }}</span>
          </button>
        </div>
      </section>

      <aside v-if="selectedCountry" class="continent-selected card">
        <p class="detail-label">Selected flag</p>
        <div class="continent-selected__preview icon-preview-bg">
          <img :src="`/flags/4x3/${selectedCountry.code}.svg`" :alt="selectedCountry.name">
        </div>
        <div class="continent-selected__body">
          <p class="continent-selected__code">{{ selectedCountry.code.toUpperCase() }}</p>
          <h2>{{ displayName(selectedCountry) }}</h2>
          <dl class="continent-selected__meta">
            <div v-if="selectedCountry.capital">
              <dt>Capital</dt>
              <dd>{{ selectedCountry.capital }}</dd>
            </div>
            <div v-if="selectedCountry.population">
              <dt>Population</dt>
              <dd>{{ formatNumber(selectedCountry.population) }}</dd>
            </div>
            <div v-if="selectedCountry.area">
              <dt>Area</dt>
              <dd>{{ formatArea(selectedCountry.area) }}</dd>
            </div>
          </dl>
          <NuxtLink :to="`/flag/${selectedCountry.code}`" class="continent-selected__link">
            <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
            Open flag page
          </NuxtLink>
        </div>
      </aside>
    </div>

    <section class="continent-list">
      <div class="continent-list__head">
        <h2>{{ continent }} country flags</h2>
        <span>{{ mapCountries.length }}</span>
      </div>
      <div class="continent-country-grid">
        <button
          v-for="country in mapCountries"
          :key="country.code"
          type="button"
          class="continent-country"
          :class="{ active: country.code === selectedCode }"
          @click="selectedCode = country.code"
        >
          <img :src="`/flags/4x3/${country.code}.svg`" :alt="country.name" loading="lazy">
          <span>
            <strong>{{ displayName(country) }}</strong>
            <small>{{ country.code.toUpperCase() }}</small>
          </span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Country } from "~/types/flag";
import { CONTINENTS, type ContinentName, continentFromSlug, continentToSlug } from "~/utils/continents";
import { isCountryFlag } from "~/utils/country-kind";

type TileModel = {
  cols: number;
  rows: number;
  zoom: number;
  rawStartX: number;
  startY: number;
  scale: number;
  tiles: Array<{ key: string; lightSrc: string; darkSrc: string }>;
};

const CONTINENT_MAPS: Record<ContinentName, { center: [number, number]; zoom: number; cols: number; rows: number }> = {
  Africa: { center: [2, 18], zoom: 3, cols: 4, rows: 4 },
  Asia: { center: [31, 86], zoom: 3, cols: 5, rows: 4 },
  Europe: { center: [54, 42], zoom: 3, cols: 5, rows: 3 },
  "North America": { center: [38, -84], zoom: 3, cols: 4, rows: 3 },
  Oceania: { center: [-17, 158], zoom: 2, cols: 4, rows: 3 },
  "South America": { center: [-17, -63], zoom: 3, cols: 3, rows: 4 },
  Antarctica: { center: [-62, -37], zoom: 2, cols: 3, rows: 2 },
};

const route = useRoute();
const slug = String(route.params.slug || "");
const continent = continentFromSlug(slug);

if (!continent) {
  throw createError({ statusCode: 404, statusMessage: "Continent not found" });
}

const config = useRuntimeConfig();
const siteUrl = (config.public.siteUrl as string).replace(/\/$/, "");
const canonical = `${siteUrl}/continent/${continentToSlug(continent)}`;
const { lang } = useSiteI18n();
const { fetchAll } = useFlags();
const { data: countries } = await useAsyncData(`continent-${slug}`, () => fetchAll(), { default: () => [] });

const countryFlags = computed(() =>
  (countries.value || [])
    .filter((country) => country.continent === continent && isCountryFlag(country) && hasCoords(country))
    .sort(sortByName),
);
const fallbackFlags = computed(() =>
  (countries.value || [])
    .filter((country) => country.continent === continent && hasCoords(country))
    .sort(sortByName),
);
const mapCountries = computed(() => countryFlags.value.length ? countryFlags.value : fallbackFlags.value);
const selectedCode = ref("");
const selectedCountry = computed(() => mapCountries.value.find((country) => country.code === selectedCode.value) || mapCountries.value[0]);
const tileModel = computed(() => buildTileModel(CONTINENT_MAPS[continent]));

watchEffect(() => {
  if (!mapCountries.value.length) {
    selectedCode.value = "";
    return;
  }
  if (!mapCountries.value.some((country) => country.code === selectedCode.value)) {
    selectedCode.value = mapCountries.value[0].code;
  }
});

useSeoMeta({
  title: `${continent} Flags Map – Country Flags and Flag CDN`,
  description: `Explore ${continent} country flags on an interactive map. Click a country marker to preview its flag, ISO code, capital, population, area, and flag asset page.`,
  ogTitle: `${continent} Flags Map – flagcdn.io`,
  ogDescription: `Interactive ${continent} flag map with SVG flag previews and country metadata.`,
  ogUrl: canonical,
  ogType: "website",
});

useHead({ link: [{ rel: "canonical", href: canonical }] });

function hasCoords(country: Country) {
  return Boolean(country.latlng && country.latlng.length >= 2 && Number.isFinite(country.latlng[0]) && Number.isFinite(country.latlng[1]));
}

function sortByName(a: Country, b: Country) {
  return a.name.localeCompare(b.name);
}

function displayName(country: Country) {
  if (lang.value === "zh" && country.name_zh) return country.name_zh;
  if (lang.value === "ja" && country.name_ja) return country.name_ja;
  if (lang.value === "de" && country.name_de) return country.name_de;
  if (lang.value === "ru" && country.name_ru) return country.name_ru;
  if (lang.value === "ar" && country.name_ar) return country.name_ar;
  return country.name;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatArea(value: number) {
  return `${new Intl.NumberFormat("en-US").format(Math.round(value))} km²`;
}

function buildTileModel(model: { center: [number, number]; zoom: number; cols: number; rows: number }): TileModel {
  const scale = 2 ** model.zoom;
  const center = latLngToTile(model.center[0], model.center[1], model.zoom);
  const rawStartX = Math.floor(center.x - model.cols / 2);
  const startY = clamp(Math.floor(center.y - model.rows / 2), 0, Math.max(0, scale - model.rows));
  const tiles = [];

  for (let row = 0; row < model.rows; row += 1) {
    for (let col = 0; col < model.cols; col += 1) {
      const x = wrapTile(rawStartX + col, scale);
      const y = clamp(startY + row, 0, scale - 1);
      tiles.push({
        key: `${model.zoom}-${x}-${y}-${col}-${row}`,
        lightSrc: `https://tiles.mapcdn.io/${model.zoom}/${x}/${y}.png`,
        darkSrc: `https://tiles.mapcdn.io/dark/${model.zoom}/${x}/${y}.png`,
      });
    }
  }

  return { ...model, rawStartX, startY, scale, tiles };
}

function markerStyle(country: Country) {
  const coords = country.latlng as [number, number];
  const model = tileModel.value;
  const point = latLngToTile(coords[0], coords[1], model.zoom);
  let x = point.x - model.rawStartX;

  while (x < 0) x += model.scale;
  while (x > model.cols) x -= model.scale;

  const y = point.y - model.startY;

  return {
    left: `${clamp((x / model.cols) * 100, 2, 98)}%`,
    top: `${clamp((y / model.rows) * 100, 2, 98)}%`,
  };
}

function latLngToTile(lat: number, lng: number, zoom: number) {
  const scale = 2 ** zoom;
  const latRad = (clamp(lat, -85, 85) * Math.PI) / 180;
  return {
    x: ((lng + 180) / 360) * scale,
    y: ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale,
  };
}

function wrapTile(x: number, scale: number) {
  return ((x % scale) + scale) % scale;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
</script>
