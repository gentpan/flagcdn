<template>
  <section class="ts-export">
    <div class="ts-export__head">
      <i class="fa-regular fa-image ts-export__icon" aria-hidden="true" />
      <p class="detail-label ts-export__label">Export {{ fmt.toUpperCase() }}</p>
    </div>
    <div class="ts-export__formats">
      <button
        v-for="f in formats"
        :key="f"
        type="button"
        class="ts-export__fmt"
        :class="{ 'is-active': fmt === f }"
        @click="fmt = f"
      >
        {{ f.toUpperCase() }}
      </button>
    </div>
    <div class="ts-export__grid">
      <a
        v-for="item in sizes"
        :key="item.size"
        :href="downloadUrl(item.size)"
        :download="fileName(item.size)"
        class="ts-export__card"
      >
        <div class="ts-export__preview icon-preview-bg">
          <img
            :src="svgUrl(ratio, cc)"
            :alt="`${item.size}px`"
            :style="{ width: `${item.display}px`, height: `${previewH(item)}px` }"
            loading="lazy"
          >
        </div>
        <div class="ts-export__meta">
          <i class="fa-solid fa-download" aria-hidden="true" />
          <span>{{ item.size }}px</span>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Ratio, RasterFormat } from "~/types/flag";

const EXPORT_SIZES = [32, 64, 128, 256, 512] as const;

const props = defineProps<{ cc: string; ratio: Ratio }>();

const fmt = ref<RasterFormat | "svg">("png");
const formats = ["png", "webp", "avif", "svg"] as const;

const sizes = EXPORT_SIZES.map((size) => ({
  size,
  display: Math.min(44, Math.max(12, Math.round(size * 0.09))),
}));

const { rasterUrl, svgUrl } = useRaster();

function previewH(item: { size: number; display: number }) {
  return props.ratio === "1x1" ? item.display : Math.round((item.display * 3) / 4);
}

function downloadUrl(size: number) {
  if (fmt.value === "svg") return svgUrl(props.ratio, props.cc);
  return rasterUrl(props.ratio, size, props.cc, fmt.value as RasterFormat);
}

function fileName(size: number) {
  if (fmt.value === "svg") return `${props.cc}_${props.ratio}.svg`;
  return `${props.cc}_${props.ratio}_${size}.${fmt.value}`;
}
</script>

<style scoped>
.ts-export__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.ts-export__icon {
  color: #ea580c;
  opacity: 0.75;
}
.ts-export__label {
  margin: 0;
}
.ts-export__formats {
  display: flex;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}
.ts-export__fmt {
  padding: 0.25rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-card);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
}
.ts-export__fmt.is-active {
  border-color: #ea580c;
  background: rgba(249, 115, 22, 0.08);
  color: #ea580c;
}
.ts-export__grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.5rem;
}
.ts-export__card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}
.ts-export__card:hover {
  border-color: rgba(249, 115, 22, 0.35);
  background: rgba(249, 115, 22, 0.04);
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
}
.ts-export__preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3.5rem;
  border-radius: 8px;
}
.ts-export__preview img {
  object-fit: contain;
}
.ts-export__meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  margin-top: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--text-muted);
}
.ts-export__meta i {
  opacity: 0.35;
  font-size: 0.55rem;
}
.ts-export__card:hover .ts-export__meta i {
  opacity: 1;
}
</style>
