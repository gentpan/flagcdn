<template>
  <div class="container-app changelog">
    <header class="changelog__hero">
      <h1>{{ t("nav.changelog") }}</h1>
      <p>{{ t("changelog.heroSub") }}</p>
    </header>

    <section v-for="group in entries" :key="group.date" class="changelog__group">
      <h2 class="changelog__date">{{ group.date }}</h2>
      <ul class="changelog__list">
        <li v-for="(item, i) in group.items" :key="i" class="changelog__item">
          <span class="changelog__tag" :class="`changelog__tag--${item.tag}`">{{ item.tag }}</span>
          <span class="changelog__text" v-html="item.html" />
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useSiteI18n();

const entries = [
  {
    date: "2026-03-19",
    items: [
      {
        tag: "svg",
        html: 'Fix <span class="fi fi-gy changelog__flag"></span> <code>gy</code> (Guyana) — green background started at x=2.4 (4:3) / x=2 (1:1), leaving a transparent gap on the left edge. Now fills full viewBox.',
      },
      { tag: "site", html: "Add Changelog page to track all fixes and updates." },
      { tag: "site", html: "Add Feedback page — users can report flag errors, request new flags, and submit suggestions." },
      { tag: "site", html: "Add project description and Star CTA to the announce bar on homepage." },
      { tag: "site", html: "Add footer navigation with Docs, Changelog, and Feedback links." },
    ],
  },
  {
    date: "2026-06-08",
    items: [
      { tag: "site", html: "Complete stack migration: Nuxt 3 frontend + Go API backend. Legacy PHP pages archived." },
      { tag: "site", html: "Cloudflare stats, visitor country, and flag SVG bundle served by Go <code>/api/*</code>." },
    ],
  },
];

useSeoMeta({
  title: "Changelog",
  description: "Fixes, updates, and improvements to flagcdn.io flag icons and site features.",
});
</script>
