<template>
  <div class="ts-variants">
    <p class="detail-label">Aspect ratio</p>
    <div class="ts-variants__grid">
      <button
        v-for="r in RATIOS"
        :key="r"
        type="button"
        class="ts-variants__item"
        :class="{ 'is-active': modelValue === r }"
        @click="$emit('update:modelValue', r)"
      >
        <div class="ts-variants__thumb icon-preview-bg">
          <img
            :src="svgUrl(r, cc)"
            :alt="r"
            class="ts-variants__img"
            :class="r === '1x1' ? 'is-square' : 'is-wide'"
          >
        </div>
        <span class="ts-variants__label">{{ r }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RATIOS, type Ratio } from "~/types/flag";

defineProps<{ cc: string; modelValue: Ratio }>();
defineEmits<{ "update:modelValue": [Ratio] }>();
const { svgUrl } = useRaster();
</script>

<style scoped>
.ts-variants__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}
.ts-variants__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--flag-detail-control);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s, background 0.15s;
}
.ts-variants__item:hover {
  border-color: var(--border-strong);
  background: var(--flag-detail-control-hover);
  box-shadow: var(--flag-detail-shadow-strong);
  transform: translateY(-1px);
}
.ts-variants__item.is-active {
  border-color: var(--flag-detail-primary-bg);
  box-shadow: 0 0 0 2px var(--flag-detail-border-strong), var(--shadow-card);
}
.ts-variants__thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.055);
}
.dark .ts-variants__thumb {
  border-color: transparent;
}
.ts-variants__img {
  object-fit: contain;
}
.ts-variants__img.is-square {
  width: 2rem;
  height: 2rem;
}
.ts-variants__img.is-wide {
  width: 2.25rem;
  height: 1.7rem;
}
.ts-variants__label {
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--text-muted);
}
.ts-variants__item.is-active .ts-variants__label {
  color: var(--text-heading);
}
</style>
