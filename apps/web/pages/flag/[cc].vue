<template>
  <div class="detail-page">
    <div class="detail-page__inner">
      <nav class="detail-breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/" class="detail-breadcrumb__link">
          <i class="fa-solid fa-house" aria-hidden="true" />
          <span class="detail-breadcrumb__home">Home</span>
        </NuxtLink>
        <template v-if="country.continent">
          <span class="detail-breadcrumb__sep">/</span>
          <NuxtLink
            :to="`/?continent=${encodeURIComponent(country.continent)}`"
            class="detail-breadcrumb__link"
          >
            {{ country.continent }}
          </NuxtLink>
        </template>
        <span class="detail-breadcrumb__sep">/</span>
        <span class="detail-breadcrumb__current">{{ country.name }}</span>
      </nav>

      <div class="detail-page__grid">
        <aside class="detail-sidebar">
          <div class="detail-preview card icon-preview-bg">
            <img
              :src="svgUrl(activeRatio, cc)"
              :alt="country.name"
              class="detail-preview__img"
              :class="activeRatio === '1x1' ? 'is-square' : 'is-wide'"
            >
            <div class="detail-preview__code">{{ cc.toUpperCase() }}</div>
          </div>

          <div class="detail-meta card">
            <div class="detail-meta__row">
              <span class="detail-meta__key">License</span>
              <span class="detail-meta__val">MIT</span>
            </div>
            <div class="detail-meta__row">
              <span class="detail-meta__key">Ratios</span>
              <span class="detail-meta__val">2</span>
            </div>
            <div v-if="country.continent" class="detail-meta__row">
              <span class="detail-meta__key">Region</span>
              <span class="detail-meta__val">{{ country.continent }}</span>
            </div>
            <div v-if="country.capital" class="detail-meta__row">
              <span class="detail-meta__key">Capital</span>
              <span class="detail-meta__val">{{ country.capital }}</span>
            </div>
          </div>

          <div v-if="country.continent" class="detail-meta card">
            <p class="detail-label">Categories</p>
            <div class="detail-pills">
              <NuxtLink
                :to="`/?continent=${encodeURIComponent(country.continent)}`"
                class="detail-pill"
              >
                {{ country.continent }}
              </NuxtLink>
              <span v-if="country.iso" class="detail-pill">ISO 3166</span>
            </div>
          </div>

          <div v-if="country.name_zh" class="detail-meta card">
            <p class="detail-label">Also known as</p>
            <p class="detail-meta__aliases">{{ country.name_zh }}</p>
          </div>

          <div v-if="hasProfile" class="detail-meta card">
            <p class="detail-label">Country profile</p>
            <div class="detail-profile__stats">
              <div v-if="country.population !== undefined" class="detail-profile__stat">
                <span class="detail-meta__key">Population estimate</span>
                <strong>{{ formatNumber(country.population) }}</strong>
              </div>
              <div v-if="country.area" class="detail-profile__stat">
                <span class="detail-meta__key">Area</span>
                <strong>{{ formatArea(country.area) }}</strong>
              </div>
            </div>
            <p class="detail-profile__text">{{ countryDescription }}</p>
          </div>

          <div v-if="mapModel" class="detail-meta card">
            <div class="detail-label-row">
              <p class="detail-label">Map</p>
              <a
                class="detail-map__credits"
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
              >
                © OpenStreetMap
              </a>
            </div>
            <a
              class="detail-map"
              :href="mapModel.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Open ${country.name} map on OpenStreetMap`"
            >
              <span class="detail-map__tiles" aria-hidden="true">
                <img
                  v-for="tile in mapModel.tiles"
                  :key="`${tile.key}-light`"
                  class="detail-map__tile detail-map__tile--light"
                  :src="tile.lightSrc"
                  alt=""
                  loading="lazy"
                  referrerpolicy="no-referrer"
                >
                <img
                  v-for="tile in mapModel.tiles"
                  :key="`${tile.key}-dark`"
                  class="detail-map__tile detail-map__tile--dark"
                  :src="tile.darkSrc"
                  alt=""
                  loading="lazy"
                  referrerpolicy="no-referrer"
                >
              </span>
              <span class="detail-map__marker" :style="mapModel.markerStyle" aria-hidden="true" />
            </a>
          </div>
        </aside>

        <div class="detail-main">
          <div class="detail-header">
            <div>
              <h1 class="detail-header__title">{{ country.name }}</h1>
              <p class="detail-header__slug">{{ cc }}</p>
            </div>
            <div class="detail-header__actions">
              <a
                :href="svgUrl(activeRatio, cc)"
                class="detail-btn detail-btn--square detail-btn--primary"
                :download="`${cc}_${activeRatio}.svg`"
                title="Download current SVG"
                aria-label="Download current SVG"
              >
                <i class="fa-solid fa-download" aria-hidden="true" />
              </a>
              <a
                :href="bundleUrl"
                class="detail-btn detail-btn--square detail-btn--ghost"
                :download="`${cc}-flag-assets.zip`"
                title="Download all formats and sizes"
                aria-label="Download all formats and sizes"
              >
                <i class="fa-solid fa-file-zipper" aria-hidden="true" />
              </a>
              <button
                type="button"
                class="detail-btn detail-btn--square detail-btn--ghost"
                title="Copy current SVG CDN URL"
                aria-label="Copy current SVG CDN URL"
                @click="copyCdn"
              >
                <i class="fa-solid fa-link" aria-hidden="true" />
              </button>
            </div>
          </div>

          <FlagVariantPicker v-model="activeRatio" :cc="cc" />
          <FlagQuickCommands :cc="cc" :ratio="activeRatio" />
          <FlagCodePanel
            :key="`${cc}-${activeRatio}`"
            :cc="cc"
            :name="country.name"
            :ratio="activeRatio"
            :svg1x1="svg1x1"
            :svg4x3="svg4x3"
          />
          <FlagExportGrid :key="`${cc}-${activeRatio}`" :cc="cc" :ratio="activeRatio" />

          <section class="detail-about card">
            <h2 class="detail-about__title">{{ country.name }} flag information</h2>
            <div class="detail-about__body">
              <p>
                The {{ country.name }} flag page provides optimized flag assets for websites,
                apps, documentation, dashboards, and design systems. Use the SVG file for crisp
                vector rendering, or export PNG, WebP, and AVIF images for fixed-size UI.
              </p>
              <p>
                Code <span class="detail-inline-code">{{ cc.toUpperCase() }}</span>
                is listed as {{ country.iso ? "an ISO 3166-1 alpha-2 code" : "a non-ISO extension code" }}.
                <template v-if="country.continent">
                  The flag is grouped under {{ country.continent }}.
                </template>
                <template v-if="country.capital">
                  Capital: {{ country.capital }}.
                </template>
              </p>
              <p>
                CDN SVG URL:
                <span class="detail-inline-code block">{{ absolute(svgUrl(activeRatio, cc)) }}</span>
              </p>
              <p>
                Available formats: SVG, PNG, WebP, and AVIF. Available ratios: 4:3 and 1:1.
                Raster exports are available from 16px to 512px.
              </p>
            </div>
          </section>

          <section v-if="related.length && country.continent" class="detail-related">
            <div class="detail-related__head">
              <p class="detail-label">Related in {{ country.continent }}</p>
              <NuxtLink to="/flags" class="detail-related__all">
                View all
                <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
              </NuxtLink>
            </div>
            <div class="detail-related__grid">
              <NuxtLink
                v-for="r in related.slice(0, 12)"
                :key="r.code"
                :to="`/flag/${r.code}`"
                class="detail-related__item"
              >
                <div class="detail-related__thumb icon-preview-bg">
                  <img :src="`/flags/1x1/${r.code}.svg`" :alt="r.name" loading="lazy">
                </div>
                <span class="detail-related__name">{{ r.name }}</span>
              </NuxtLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlagDetailResponse, Ratio } from "~/types/flag";
import { buildFlagSeo } from "~/utils/flag-seo";

const route = useRoute();
const cc = computed(() => String(route.params.cc).toLowerCase());
const { fetchDetail } = useFlags();
const { absolute, svgUrl } = useRaster();
const { copyText } = useCopy();

const activeRatio = ref<Ratio>("4x3");

const { data: detail, error: detailError } = await useAsyncData(
  () => `flag-${cc.value}`,
  () => fetchDetail(cc.value),
);

if (detailError.value || !detail.value) {
  throw createError({ statusCode: 404, statusMessage: "Flag not found" });
}

const { data: svgBundle } = await useAsyncData(
  () => `flag-svg-${cc.value}`,
  () => $fetch<{ svg1x1: string; svg4x3: string }>(`/api/v1/flags/${cc.value}/svg`),
);

const country = computed(() => (detail.value as FlagDetailResponse).country);
const related = computed(() => (detail.value as FlagDetailResponse).related || []);
const svg1x1 = computed(() => svgBundle.value?.svg1x1 || "");
const svg4x3 = computed(() => svgBundle.value?.svg4x3 || "");
const bundleUrl = computed(() => `/api/v1/flags/${encodeURIComponent(cc.value)}/download.zip`);
const hasProfile = computed(() => Boolean(country.value.population !== undefined || country.value.area || countryDescription.value));
const mapModel = computed(() => {
  const coords = country.value.latlng;
  if (!coords || coords.length < 2) return null;
  const [lat, lng] = coords;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const zoom = country.value.area && country.value.area < 1000
    ? 7
    : country.value.area && country.value.area < 25000
      ? 5
      : country.value.area && country.value.area < 200000
        ? 4
        : 3;
  const scale = 2 ** zoom;
  const tileX = ((lng + 180) / 360) * scale;
  const latRad = (lat * Math.PI) / 180;
  const tileY = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale;
  const startX = Math.floor(tileX) - 1;
  const startY = Math.max(0, Math.min(scale - 3, Math.floor(tileY) - 1));
  const tiles = [];

  for (let y = 0; y < 3; y += 1) {
    for (let x = 0; x < 3; x += 1) {
      const wrappedX = ((startX + x) % scale + scale) % scale;
      const tileRow = startY + y;
      tiles.push({
        key: `${zoom}-${wrappedX}-${tileRow}`,
        lightSrc: `https://tiles.mapcdn.io/${zoom}/${wrappedX}/${tileRow}.png`,
        darkSrc: `https://tiles.mapcdn.io/dark/${zoom}/${wrappedX}/${tileRow}.png`,
      });
    }
  }

  return {
    href: `https://www.openstreetmap.org/?mlat=${lat.toFixed(5)}&mlon=${lng.toFixed(5)}#map=${zoom}/${lat.toFixed(5)}/${lng.toFixed(5)}`,
    tiles,
    markerStyle: {
      left: `${Math.max(8, Math.min(92, ((tileX - startX) / 3) * 100))}%`,
      top: `${Math.max(8, Math.min(92, ((tileY - startY) / 3) * 100))}%`,
    },
  };
});
const countryDescription = computed(() => {
  const parts = [`${country.value.name} is listed in the flagcdn.io flag library under code ${cc.value.toUpperCase()}.`];
  if (country.value.continent) parts.push(`It is grouped in ${country.value.continent}.`);
  if (country.value.capital) parts.push(`The capital is ${country.value.capital}.`);
  if (country.value.population !== undefined) parts.push(`Population estimate: ${formatNumber(country.value.population)}.`);
  if (country.value.area) parts.push(`Area: ${formatArea(country.value.area)}.`);
  return parts.join(" ");
});

const config = useRuntimeConfig();
const seo = computed(() =>
  buildFlagSeo({ country: country.value, siteUrl: config.public.siteUrl as string }),
);

useSeoMeta({
  title: () => seo.value.title,
  description: () => seo.value.description,
  keywords: () => seo.value.keywords,
  ogTitle: () => seo.value.title,
  ogDescription: () => seo.value.description,
  ogUrl: () => seo.value.canonical,
  ogImage: () => seo.value.ogImage,
  ogType: "website",
  twitterTitle: () => seo.value.title,
  twitterDescription: () => seo.value.description,
  twitterImage: () => seo.value.ogImage,
});

useHead(() => ({
  bodyAttrs: { class: "flag-detail-body" },
  link: [{ rel: "canonical", href: seo.value.canonical }],
  script: [
    {
      type: "application/ld+json",
      textContent: JSON.stringify(seo.value.jsonLd),
    },
  ],
}));

async function copyCdn() {
  await copyText(absolute(svgUrl(activeRatio.value, cc.value)));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatArea(value: number) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)} km²`;
}
</script>
