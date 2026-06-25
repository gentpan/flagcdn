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

<style scoped>
.hero {
  position: relative;
  padding: 1rem 0 2rem;
  overflow: hidden;
}
.hero__inner {
  position: relative;
  text-align: center;
  padding: 2.5rem 0 1.5rem;
}
.hero__content { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
.hero__title {
  font-size: clamp(1.85rem, 4vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 0.75rem;
}
.hero__subtitle {
  color: var(--text-body);
  line-height: 1.6;
  margin-bottom: 1.25rem;
}
.hero__search {
  position: relative;
  padding: 0;
  margin-bottom: 1.25rem;
  overflow: hidden;
}
.hero__search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}
.hero__search-input {
  width: 100%;
  border: 0;
  padding: 0.9rem 1rem 0.9rem 2.75rem;
  font-size: 1rem;
  background: transparent;
  color: var(--text-heading);
  outline: none;
}
.hero__cta {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}
.bento {
  padding-bottom: 1.5rem;
}
.bento__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.65rem;
}
.bento__card {
  padding: 1rem 1.1rem;
}
.bento__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
  color: var(--brand);
}
.bento__head h3 {
  font-size: 0.95rem;
  font-weight: 700;
}
.bento__card p {
  font-size: 0.85rem;
  color: var(--text-body);
  line-height: 1.5;
}
.section { padding-bottom: 2rem; }
.section__controls {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}
.section__tabs {
  display: flex;
  flex: 1 1 auto;
  gap: 0.35rem;
  overflow-x: auto;
  padding-bottom: 0.1rem;
  scrollbar-width: none;
}
.section__tabs::-webkit-scrollbar {
  display: none;
}
.section__tab {
  flex: 0 0 auto;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg-card);
  color: var(--text-body);
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1;
  padding: 0.55rem 0.8rem;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.section__tab:hover {
  border-color: var(--border-strong);
  color: var(--text-heading);
}
.section__tab.active {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
}
.section__ratio {
  flex: 0 0 auto;
  display: inline-flex;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.section__ratio-btn {
  border: 0;
  background: transparent;
  padding: 0.45rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-muted);
}
.section__ratio-btn.active {
  background: var(--brand-muted);
  color: var(--brand);
}
.section__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.section__head--spaced { margin-top: 2rem; }
.section__head h2 { font-size: 1.25rem; }
.section__count { font-size: 0.85rem; color: var(--text-muted); }
.flags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.6rem;
}
@media (max-width: 860px) {
  .bento__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .section__controls {
    align-items: stretch;
    flex-direction: column;
  }
  .section__ratio {
    align-self: flex-end;
  }
}
@media (max-width: 520px) {
  .bento__grid {
    grid-template-columns: 1fr;
  }
}
</style>
