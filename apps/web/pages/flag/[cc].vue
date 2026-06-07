<template>
  <div class="detail-page">
    <div class="detail-page__inner">
      <nav class="detail-breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/" class="detail-breadcrumb__link">
          <i class="fa-solid fa-house" aria-hidden="true" />
          <span class="detail-breadcrumb__home">Home</span>
        </NuxtLink>
        <template v-if="country.continent">
          <span class="detail-breadcrumb__sep">/</span>
          <NuxtLink
            :to="`/?continent=${encodeURIComponent(country.continent)}`"
            class="detail-breadcrumb__link"
          >
            {{ country.continent }}
          </NuxtLink>
        </template>
        <span class="detail-breadcrumb__sep">/</span>
        <span class="detail-breadcrumb__current">{{ country.name }}</span>
      </nav>

      <div class="detail-page__grid">
        <aside class="detail-sidebar">
          <div class="detail-preview card icon-preview-bg">
            <img
              :src="svgUrl(activeRatio, cc)"
              :alt="country.name"
              class="detail-preview__img"
              :class="activeRatio === '1x1' ? 'is-square' : 'is-wide'"
            >
            <div class="detail-preview__code">{{ cc.toUpperCase() }}</div>
          </div>

          <div class="detail-meta card">
            <div class="detail-meta__row">
              <span class="detail-meta__key">License</span>
              <span class="detail-meta__val">MIT</span>
            </div>
            <div class="detail-meta__row">
              <span class="detail-meta__key">Ratios</span>
              <span class="detail-meta__val">2</span>
            </div>
            <div v-if="country.continent" class="detail-meta__row">
              <span class="detail-meta__key">Region</span>
              <span class="detail-meta__val">{{ country.continent }}</span>
            </div>
            <div v-if="country.capital" class="detail-meta__row">
              <span class="detail-meta__key">Capital</span>
              <span class="detail-meta__val">{{ country.capital }}</span>
            </div>
          </div>

          <div v-if="country.continent" class="detail-meta card">
            <p class="detail-label">Categories</p>
            <div class="detail-pills">
              <NuxtLink
                :to="`/?continent=${encodeURIComponent(country.continent)}`"
                class="detail-pill"
              >
                {{ country.continent }}
              </NuxtLink>
              <span v-if="country.iso" class="detail-pill">ISO 3166</span>
            </div>
          </div>

          <div v-if="country.name_zh" class="detail-meta card">
            <p class="detail-label">Also known as</p>
            <p class="detail-meta__aliases">{{ country.name_zh }}</p>
          </div>
        </aside>

        <div class="detail-main">
          <div class="detail-header">
            <div>
              <h1 class="detail-header__title">{{ country.name }}</h1>
              <p class="detail-header__slug">{{ cc }}</p>
            </div>
            <div class="detail-header__actions">
              <a :href="svgUrl(activeRatio, cc)" class="detail-btn detail-btn--primary" download>
                <i class="fa-solid fa-download" aria-hidden="true" />
                Download
              </a>
              <button type="button" class="detail-btn detail-btn--ghost" @click="copyCdn">
                <i class="fa-solid fa-link" aria-hidden="true" />
                Copy URL
              </button>
            </div>
          </div>

          <FlagVariantPicker v-model="activeRatio" :cc="cc" />
          <FlagQuickCommands :cc="cc" :ratio="activeRatio" />
          <FlagCodePanel
            :key="`${cc}-${activeRatio}`"
            :cc="cc"
            :name="country.name"
            :ratio="activeRatio"
            :svg1x1="svg1x1"
            :svg4x3="svg4x3"
          />
          <FlagExportGrid :key="`${cc}-${activeRatio}`" :cc="cc" :ratio="activeRatio" />

          <section v-if="related.length && country.continent" class="detail-related">
            <div class="detail-related__head">
              <p class="detail-label">Related in {{ country.continent }}</p>
              <NuxtLink to="/flags" class="detail-related__all">
                View all
                <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
              </NuxtLink>
            </div>
            <div class="detail-related__grid">
              <NuxtLink
                v-for="r in related.slice(0, 12)"
                :key="r.code"
                :to="`/flag/${r.code}`"
                class="detail-related__item"
              >
                <div class="detail-related__thumb icon-preview-bg">
                  <img :src="`/flags/1x1/${r.code}.svg`" :alt="r.name" loading="lazy">
                </div>
                <span class="detail-related__name">{{ r.name }}</span>
              </NuxtLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlagDetailResponse, Ratio } from "~/types/flag";
import { buildFlagSeo } from "~/utils/flag-seo";

const route = useRoute();
const cc = computed(() => String(route.params.cc).toLowerCase());
const { fetchDetail } = useFlags();
const { absolute, svgUrl } = useRaster();
const { copyText } = useCopy();

const activeRatio = ref<Ratio>("4x3");

const { data: detail, error: detailError } = await useAsyncData(
  () => `flag-${cc.value}`,
  () => fetchDetail(cc.value),
);

if (detailError.value || !detail.value) {
  throw createError({ statusCode: 404, statusMessage: "Flag not found" });
}

const { data: svgBundle } = await useAsyncData(
  () => `flag-svg-${cc.value}`,
  () => $fetch<{ svg1x1: string; svg4x3: string }>(`/api/v1/flags/${cc.value}/svg`),
);

const country = computed(() => (detail.value as FlagDetailResponse).country);
const related = computed(() => (detail.value as FlagDetailResponse).related || []);
const svg1x1 = computed(() => svgBundle.value?.svg1x1 || "");
const svg4x3 = computed(() => svgBundle.value?.svg4x3 || "");

const config = useRuntimeConfig();
const seo = computed(() =>
  buildFlagSeo({ country: country.value, siteUrl: config.public.siteUrl as string }),
);

useSeoMeta({
  title: () => seo.value.title,
  description: () => seo.value.description,
  keywords: () => seo.value.keywords,
  ogTitle: () => seo.value.title,
  ogDescription: () => seo.value.description,
  ogUrl: () => seo.value.canonical,
  ogImage: () => seo.value.ogImage,
  ogType: "website",
  twitterTitle: () => seo.value.title,
  twitterDescription: () => seo.value.description,
  twitterImage: () => seo.value.ogImage,
});

useHead(() => ({
  link: [{ rel: "canonical", href: seo.value.canonical }],
  script: [
    {
      type: "application/ld+json",
      textContent: JSON.stringify(seo.value.jsonLd),
    },
  ],
}));

async function copyCdn() {
  await copyText(absolute(svgUrl(activeRatio.value, cc.value)));
}
</script>
