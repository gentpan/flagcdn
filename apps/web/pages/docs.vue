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
