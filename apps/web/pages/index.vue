<template>
  <div>
    <section class="hero">
      <div class="container-app hero__inner">
        <div class="hero__content">
          <h1 class="hero__title">{{ t("hero.title") }}</h1>
          <p class="hero__subtitle">{{ t("hero.sub") }}</p>
          <div class="hero__search card">
            <i class="fa-solid fa-magnifying-glass hero__search-icon" />
            <input
              v-model="query"
              type="search"
              class="hero__search-input"
              :placeholder="t('search.placeholder')"
              autocomplete="off"
            >
          </div>
          <div class="hero__cta">
            <NuxtLink to="/docs" class="btn-primary"><i class="fa-solid fa-file-lines" /> {{ t("nav.docs") }}</NuxtLink>
            <NuxtLink to="/flags" class="btn-ghost"><i class="fa-solid fa-flag" /> {{ t("hero.browse") }}</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="container-app bento">
      <div class="bento__grid">
        <div v-for="item in bentoItems" :key="item.key" class="bento__card card">
          <div class="bento__head">
            <i class="fa-solid" :class="item.icon" />
            <h3>{{ t(item.title) }}</h3>
          </div>
          <p>{{ t(item.desc) }}</p>
        </div>
      </div>
    </section>

    <section class="container-app section">
      <div class="section__controls">
        <div class="section__tabs" role="tablist" :aria-label="t('filter.continent')">
          <button
            type="button"
            class="section__tab"
            :class="{ active: !continent }"
            role="tab"
            :aria-selected="!continent"
            @click="continent = ''"
          >
            {{ t("filter.all") }}
          </button>
          <button
            v-for="c in continents"
            :key="c"
            type="button"
            class="section__tab"
            :class="{ active: continent === c }"
            role="tab"
            :aria-selected="continent === c"
            @click="continent = c"
          >
            {{ c }}
          </button>
          <button
            type="button"
            class="section__tab"
            :class="{ active: continent === 'non-iso' }"
            role="tab"
            :aria-selected="continent === 'non-iso'"
            @click="continent = 'non-iso'"
          >
            {{ t("filter.nonIso") }}
          </button>
        </div>
        <div class="section__ratio" role="group" :aria-label="t('filter.ratio')">
          <button type="button" class="section__ratio-btn" :class="{ active: ratio === '4x3' }" @click="ratio = '4x3'">4:3</button>
          <button type="button" class="section__ratio-btn" :class="{ active: ratio === '1x1' }" @click="ratio = '1x1'">1:1</button>
        </div>
      </div>

      <header class="section__head">
        <h2>{{ t("section.isoFlags") }}</h2>
        <span class="section__count">{{ isoFlags.length }} / {{ total }}</span>
      </header>
      <div class="flags-grid">
        <FlagCard v-for="c in isoFlags" :key="c.code" :country="c" :ratio="ratio" />
      </div>

      <header v-if="nonIsoFlags.length" class="section__head section__head--spaced">
        <h2>{{ t("section.otherFlags") }}</h2>
        <span class="section__count">{{ nonIsoFlags.length }}</span>
      </header>
      <div v-if="nonIsoFlags.length" class="flags-grid">
        <FlagCard v-for="c in nonIsoFlags" :key="c.code" :country="c" :ratio="ratio" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const { t } = useSiteI18n();

const bentoItems = [
  { key: "flags", icon: "fa-flag", title: "bento.flagsTitle", desc: "bento.flagsDesc" },
  { key: "ratio", icon: "fa-crop-simple", title: "bento.ratioTitle", desc: "bento.ratioDesc" },
  { key: "cdn", icon: "fa-bolt", title: "bento.cdnTitle", desc: "bento.cdnDesc" },
  { key: "copy", icon: "fa-clipboard", title: "bento.copyTitle", desc: "bento.copyDesc" },
];

useSeoMeta({
  title: "Free Country Flag Icons – SVG, PNG, WebP & AVIF CDN",
  description:
    "Free country flag icons and regional flags in SVG, PNG, WebP and AVIF. Browse ISO country flags, copy HTML snippets, use CDN URLs, or download 1:1 and 4:3 flag assets.",
  ogTitle: "Free Country Flag Icons – SVG, PNG, WebP & AVIF CDN",
  ogDescription:
    "Search country flags, copy CDN links, embed flag-icons CSS, and download clean SVG, PNG, WebP and AVIF flag assets.",
  ogUrl: siteUrl,
  ogType: "website",
});

useHead({
  link: [{ rel: "canonical", href: siteUrl }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            name: "flagcdn.io",
            url: siteUrl,
            description: "Free country flag icons and regional flag assets in SVG, PNG, WebP and AVIF.",
            potentialAction: {
              "@type": "SearchAction",
              target: `${siteUrl.replace(/\/$/, "")}/?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@type": "WebApplication",
            name: "flagcdn.io",
            url: siteUrl,
            description: "Free country flag icons and regional flag assets in SVG, PNG, WebP and AVIF with CDN links, HTML snippets, and per-flag metadata.",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            license: "https://opensource.org/licenses/MIT",
          },
        ],
      }),
    },
  ],
});

const { fetchAll } = useFlags();
const { data: countries } = await useAsyncData("home-flags", () => fetchAll(), { default: () => [] });

const { query, continent, ratio, continents, isoFlags, nonIsoFlags, total } = useFlagFilters(countries);
</script>
