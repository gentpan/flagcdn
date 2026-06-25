<template>
  <NuxtLink
    :to="`/flag/${country.code}`"
    class="flag-card animate-fade-in-up"
    :class="{ 'has-badge': isChinaRegion }"
  >
    <img
      :src="`/flags/${ratio}/${country.code}.svg`"
      :alt="country.name"
      :width="ratio === '1x1' ? 40 : 48"
      :height="ratio === '1x1' ? 40 : 36"
      loading="lazy"
      class="flag-card__img"
    >
    <div class="flag-card__meta">
      <div class="flag-card__code">{{ country.code.toUpperCase() }}</div>
      <div class="flag-card__name">{{ displayName }}</div>
    </div>
    <span v-if="isChinaRegion" class="flag-card__badge">CHINA</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Country } from "~/types/flag";

const props = withDefaults(defineProps<{ country: Country; ratio?: "4x3" | "1x1" }>(), {
  ratio: "4x3",
});
const { lang } = useSiteI18n();
const isChinaRegion = computed(() => ["hk", "mo", "tw"].includes(props.country.code.toLowerCase()));

const displayName = computed(() => {
  const c = props.country;
  if (lang.value === "zh" && c.name_zh) return c.name_zh;
  if (lang.value === "ja" && c.name_ja) return c.name_ja;
  if (lang.value === "de" && c.name_de) return c.name_de;
  if (lang.value === "ru" && c.name_ru) return c.name_ru;
  if (lang.value === "ar" && c.name_ar) return c.name_ar;
  return c.name;
});
</script>
