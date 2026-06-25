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
