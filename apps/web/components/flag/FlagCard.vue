<template>
  <NuxtLink :to="`/flag/${country.code}`" class="flag-card animate-fade-in-up">
    <img
      :src="`/flags/4x3/${country.code}.svg`"
      :alt="country.name"
      width="48"
      height="36"
      loading="lazy"
      class="flag-card__img"
    >
    <div class="flag-card__meta">
      <div class="flag-card__code">{{ country.code.toUpperCase() }}</div>
      <div class="flag-card__name">{{ displayName }}</div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Country } from "~/types/flag";

const props = defineProps<{ country: Country }>();
const { lang } = useSiteI18n();

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

<style scoped>
.flag-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
}
.flag-card:hover {
  border-color: var(--brand);
  transform: translateY(-1px);
  box-shadow: var(--shadow-card);
}
.flag-card__img {
  flex-shrink: 0;
  border: 1px solid var(--border);
  border-radius: 2px;
  object-fit: cover;
}
.flag-card__code {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}
.flag-card__name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-heading);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
