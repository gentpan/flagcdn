<template>
  <div>
    <section class="hero">
      <div class="container-app hero__inner">
        <div class="hero__watermark" aria-hidden="true">flagcdn</div>
        <div class="hero__content">
          <h1 class="hero__title">Country Flag Icons</h1>
          <p class="hero__subtitle">
            270+ ISO flags · SVG / PNG / WebP / AVIF · Copy code or download at any size
          </p>
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
            <NuxtLink to="/docs" class="btn-primary"><i class="fa-solid fa-file-lines" /> Docs</NuxtLink>
            <NuxtLink to="/flags" class="btn-ghost"><i class="fa-solid fa-flag" /> Browse all</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="container-app section">
      <div class="section__head">
        <h2>Flags</h2>
        <span class="section__count">{{ filtered.length }} / {{ countries.length }}</span>
      </div>
      <div class="flags-grid">
        <FlagCard v-for="c in filtered" :key="c.code" :country="c" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Fuse from "fuse.js";
import type { Country } from "~/types/flag";

const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;
const { t } = useSiteI18n();

useSeoMeta({
  title: "Country Flag Icons – Free SVG Flags CDN",
  description:
    "270+ free SVG country flags by ISO 3166-1. Download PNG, WebP, AVIF at 8 sizes. Copy HTML or CDN URL.",
  ogTitle: "Country Flag Icons – Free SVG Flags CDN",
  ogDescription:
    "270+ country flags. SVG, PNG, WebP, AVIF. One-line CSS or direct CDN links.",
  ogUrl: siteUrl,
  ogType: "website",
});

useHead({
  link: [{ rel: "canonical", href: siteUrl }],
});

const { fetchAll } = useFlags();
const { data: countries } = await useAsyncData("home-flags", () => fetchAll(), { default: () => [] });

const query = ref("");

const fuse = computed(() => new Fuse(countries.value || [], {
  keys: ["name", "name_zh", "code", "capital", "continent"],
  threshold: 0.35,
}));

const filtered = computed(() => {
  const q = query.value.trim();
  if (!q) return countries.value || [];
  return fuse.value.search(q).map((r) => r.item);
});
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
.hero__watermark {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -55%);
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(72px, 18vw, 220px);
  color: rgba(29, 111, 168, 0.08);
  white-space: nowrap;
  pointer-events: none;
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
.section { padding-bottom: 2rem; }
.section__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.section__head h2 { font-size: 1.25rem; }
.section__count { font-size: 0.85rem; color: var(--text-muted); }
.flags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.6rem;
}
</style>
