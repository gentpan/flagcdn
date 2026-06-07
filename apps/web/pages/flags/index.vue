<template>
  <div class="container-app page">
    <h1 class="page__title">{{ t("flags.title") }}</h1>
    <p class="page__sub">{{ t("flags.sub") }}</p>
    <input v-model="query" type="search" class="search card" :placeholder="t('search.placeholder')">
    <div class="chips">
      <button
        type="button"
        class="chip"
        :class="{ active: !continent }"
        @click="continent = ''"
      >
        {{ t("filter.all") }}
      </button>
      <button
        v-for="c in continents"
        :key="c"
        type="button"
        class="chip"
        :class="{ active: continent === c }"
        @click="continent = c"
      >
        {{ c }}
      </button>
      <button
        type="button"
        class="chip"
        :class="{ active: continent === 'non-iso' }"
        @click="continent = 'non-iso'"
      >
        {{ t("filter.nonIso") }}
      </button>
    </div>
    <div class="flags-grid">
      <FlagCard v-for="c in filtered" :key="c.code" :country="c" />
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const canonical = `${(config.public.siteUrl as string).replace(/\/$/, "")}/flags`;
const { t } = useSiteI18n();

useSeoMeta({
  title: "Browse All Country Flags – 270+ SVG Icons",
  description:
    "Browse all country and territory flags. Each flag has its own page with SVG code, CDN URLs, and multi-format download.",
  ogUrl: canonical,
});

useHead({ link: [{ rel: "canonical", href: canonical }] });

const { fetchAll } = useFlags();
const { data: countries } = await useAsyncData("all-flags", () => fetchAll(), { default: () => [] });

const { query, continent, continents, filtered } = useFlagFilters(countries);
</script>

<style scoped>
.page { padding: 1rem 0 2rem; }
.page__title { font-size: 1.75rem; margin-bottom: 0.35rem; }
.page__sub { color: var(--text-body); margin-bottom: 1.25rem; }
.search {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 0;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  outline: none;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}
.chip {
  border: 1px solid var(--border);
  background: var(--bg-card);
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  color: var(--text-body);
}
.chip.active {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
}
.flags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.6rem;
}
</style>
