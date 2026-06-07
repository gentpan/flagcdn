<template>
  <div class="docs-page">
    <section class="docs-hero container-app">
      <h1 class="docs-hero__title">{{ t("docs.title") }}</h1>
      <p class="docs-hero__sub">{{ t("docs.heroSub") }}</p>
    </section>

    <main class="container-app docs">
      <h2>{{ t("docs.section1Title") }}</h2>
      <p v-html="t('docs.section1Intro')" />
      <p class="docs-label"><strong>{{ t("docs.section1Cdn") }}</strong></p>
      <DocsCopyBlock :text="cssLink" />

      <h2>{{ t("docs.section2Title") }}</h2>
      <p v-html="t('docs.section2Intro')" />
      <p>{{ t("docs.section2AspectNote") }}</p>
      <p><strong>{{ t("docs.section2_4x3") }}</strong></p>
      <DocsCopyBlock :text="htmlUs43" />
      <div class="docs-example">
        <span class="fi fi-us" aria-hidden="true" />
        <span>{{ t("docs.exampleUs") }}</span>
      </div>
      <p v-html="t('docs.section2_1x1')" />
      <DocsCopyBlock :text="htmlUs11" />
      <div class="docs-example">
        <span class="fi fi-us fis" aria-hidden="true" />
        <span>{{ t("docs.exampleUs") }}</span>
      </div>

      <h2>{{ t("docs.section3Title") }}</h2>
      <p v-html="t('docs.section3Intro')" />
      <DocsCopyBlock :text="htmlCnBg" />

      <h2>{{ t("docs.section4Title") }}</h2>
      <p>{{ t("docs.section4Intro") }}</p>
      <ul class="docs-list">
        <li v-html="t('docs.section4Line1')" />
        <li v-html="t('docs.section4Line2')" />
      </ul>

      <h2>{{ t("docs.section5Title") }}</h2>
      <p v-html="t('docs.section5UrlIntro')" />
      <p class="docs-label"><strong>{{ t("docs.section5ExplicitPath") }}</strong></p>
      <DocsCopyBlock :text="`${siteUrl}/flags/4x3/cn.svg`" />
      <DocsCopyBlock :text="`${siteUrl}/flags/1x1/cn.svg`" />
      <p class="docs-label"><strong>{{ t("docs.section5ShortPath") }}</strong></p>
      <DocsCopyBlock :text="`${siteUrl}/cn.svg`" />

      <h2>{{ t("docs.section6Title") }}</h2>
      <p v-html="t('docs.section6Line1')" />
      <p class="docs-contact">
        Site: <a href="https://flagcdn.io">flagcdn.io</a>.
        Source code:
        <a :href="`https://github.com/${githubRepo}`" target="_blank" rel="noopener">{{ githubRepo }}</a>.
        Questions or feedback:
        <a href="mailto:support@flagcdn.io">support@flagcdn.io</a>.
      </p>
    </main>
  </div>
</template>

<script setup lang="ts">
const { t } = useSiteI18n();
const config = useRuntimeConfig();
const siteUrl = (config.public.siteUrl as string).replace(/\/$/, "");
const githubRepo = config.public.githubRepo as string;

const cssLink = `<link rel="stylesheet" href="${siteUrl}/css/flag-icons.min.css" />`;
const htmlUs43 = '<span class="fi fi-us"></span>';
const htmlUs11 = '<span class="fi fi-us fis"></span>';
const htmlCnBg = '<span class="fi fi-cn fib" style="width:32px;height:24px;display:inline-block;"></span>';

useSeoMeta({
  title: "How to Use Flag Icons – CSS & HTML Guide",
  description:
    "Add country flag icons to your site in one line. Include flag-icons CSS, use fi and fi-xx classes, or link to SVG URLs. 4:3 and 1:1 aspect ratios, ISO 3166-1 codes.",
  keywords:
    "flag icons usage, flag CSS, country flag HTML, SVG flag URL, ISO 3166 flags, flag-icons CDN, embed flags",
  ogTitle: "How to Use Flag Icons – CSS & HTML Guide",
  ogDescription:
    "Add country flag icons to your site in one line. Include flag-icons CSS, use fi and fi-xx classes, or link to SVG URLs.",
  ogUrl: `${siteUrl}/docs`,
  ogType: "website",
});

useHead({
  link: [{ rel: "canonical", href: `${siteUrl}/docs` }],
});
</script>

<style scoped>
.docs-page {
  padding-bottom: 2rem;
}
.docs-hero {
  text-align: center;
  padding: 0.5rem 0 1.5rem;
}
.docs-hero__title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.35rem;
}
.docs-hero__sub {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}
.docs {
  line-height: 1.55;
  max-width: 100%;
}
.docs h2 {
  font-size: 1.25rem;
  margin: 2rem 0 0.75rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid var(--border);
  color: var(--text-heading);
}
.docs h2:first-child {
  margin-top: 0;
}
.docs p {
  margin-bottom: 1rem;
  color: var(--text-body);
}
.docs-label {
  margin-top: 1.25rem;
  margin-bottom: 0.35rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}
.docs-label:first-of-type {
  margin-top: 0;
}
.docs-list {
  margin: 0 0 1rem 1.25rem;
  color: var(--text-body);
}
.docs-list li {
  margin-bottom: 0.35rem;
}
.docs-example {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
  color: var(--text-body);
}
.docs-example .fi {
  width: 1.5rem;
  line-height: 1;
}
.docs :deep(.docs-inline-code) {
  font-family: var(--font-mono);
  display: inline;
  padding: 0.15rem 0.4rem;
  background: color-mix(in srgb, var(--bg-card) 60%, var(--bg-page));
  font-size: 0.875rem;
  border: 1px solid var(--border);
  border-radius: 4px;
}
.docs :deep(a) {
  color: var(--brand);
  text-decoration: none;
  border-bottom: 1px dotted color-mix(in srgb, var(--border) 60%, var(--brand) 40%);
}
.docs :deep(a:hover) {
  border-bottom-style: solid;
}
</style>
