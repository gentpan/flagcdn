<template>
  <div class="container-app page">
    <h1 class="page__title">All flags</h1>
    <p class="page__sub">Click any flag for SVG code, CDN URLs, and multi-format export.</p>
    <input v-model="query" type="search" class="search card" placeholder="Search…">
    <div class="flags-grid">
      <FlagCard v-for="c in filtered" :key="c.code" :country="c" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Fuse from "fuse.js";

const config = useRuntimeConfig();
const canonical = `${(config.public.siteUrl as string).replace(/\/$/, "")}/flags`;

useSeoMeta({
  title: "Browse All Country Flags – 270+ SVG Icons",
  description:
    "Browse all country and territory flags. Each flag has its own page with SVG code, CDN URLs, and multi-format download.",
  ogUrl: canonical,
});

useHead({ link: [{ rel: "canonical", href: canonical }] });

const { fetchAll } = useFlags();
const { data: countries } = await useAsyncData("all-flags", () => fetchAll(), { default: () => [] });
const query = ref("");

const fuse = computed(() => new Fuse(countries.value || [], {
  keys: ["name", "name_zh", "code", "capital"],
  threshold: 0.35,
}));

const filtered = computed(() => {
  const q = query.value.trim();
  if (!q) return countries.value || [];
  return fuse.value.search(q).map((r) => r.item);
});
</script>

<style scoped>
.page { padding: 1rem 0 2rem; }
.page__title { font-size: 1.75rem; margin-bottom: 0.35rem; }
.page__sub { color: var(--text-body); margin-bottom: 1.25rem; }
.search {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 0;
  margin-bottom: 1.25rem;
  font-size: 1rem;
  outline: none;
}
.flags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.6rem;
}
</style>
