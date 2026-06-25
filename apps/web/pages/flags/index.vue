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
  title: "Browse Country Flags and Other Flags – SVG Flag CDN",
  description:
    "Browse country flags, territory flags, regional flags, and organization flags. Each flag page includes SVG code, CDN URLs, PNG/WebP/AVIF exports, metadata, and download options.",
  ogUrl: canonical,
});

useHead({ link: [{ rel: "canonical", href: canonical }] });

const { fetchAll } = useFlags();
const { data: countries } = await useAsyncData("all-flags", () => fetchAll(), { default: () => [] });

const { query, continent, continents, filtered } = useFlagFilters(countries);
</script>
