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

<style scoped>
.changelog {
  padding: 0.5rem 0 2.5rem;
  font-family: var(--font-sans);
}
.changelog__hero {
  margin-bottom: 1.5rem;
}
.changelog__hero h1 {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
}
.changelog__hero p {
  color: var(--text-muted);
}
.changelog__date {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 2rem 0 0.75rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid var(--border);
}
.changelog__date:first-child {
  margin-top: 0;
}
.changelog__list {
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
}
.changelog__item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.45rem 0;
  border-bottom: 1px dashed var(--border);
  font-size: 0.95rem;
  line-height: 1.55;
}
.changelog__item:last-child {
  border-bottom: none;
}
.changelog__tag {
  flex-shrink: 0;
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.changelog__tag--svg { color: #d63384; background: rgba(214, 51, 132, 0.1); }
.changelog__tag--css { color: #0d6efd; background: rgba(13, 110, 253, 0.1); }
.changelog__tag--data { color: #e67700; background: rgba(230, 119, 0, 0.1); }
.changelog__tag--site { color: var(--brand); background: var(--brand-muted); }
.changelog__tag--i18n { color: #6f42c1; background: rgba(111, 66, 193, 0.1); }
.changelog__text {
  flex: 1;
  color: var(--text-body);
}
.changelog__text :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: 0.1rem 0.35rem;
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 4px;
}
.changelog__text :deep(.changelog__flag) {
  vertical-align: middle;
  margin: 0 0.15rem;
}
</style>
