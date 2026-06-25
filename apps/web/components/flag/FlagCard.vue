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

<style scoped>
.flag-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
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
.flag-card__meta {
  min-width: 0;
  flex: 1 1 auto;
}
.flag-card.has-badge .flag-card__meta {
  padding-right: 4.5rem;
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
.flag-card__badge {
  position: absolute;
  top: 0.55rem;
  right: 0.7rem;
  max-width: 5rem;
  padding: 0.18rem 0.45rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--brand-light);
  font-size: 0.56rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1;
  text-align: center;
}
</style>
