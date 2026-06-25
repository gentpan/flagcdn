<template>
  <section class="ts-code">
    <div class="ts-code__tabs">
      <div class="ts-code__group">
        <button
          v-for="t in useTabs"
          :key="t.id"
          type="button"
          class="ts-code__tab"
          :class="{ 'is-active': tab === t.id }"
          @click="tab = t.id"
        >
          {{ t.label }}
        </button>
      </div>
      <div class="ts-code__divider" />
      <div class="ts-code__group">
        <button
          v-for="t in copyTabs"
          :key="t.id"
          type="button"
          class="ts-code__tab"
          :class="{ 'is-active': tab === t.id }"
          @click="tab = t.id"
        >
          {{ t.label }}
        </button>
      </div>
    </div>
    <div class="ts-code__body">
      <button type="button" class="ts-code__copy" @click="onCopy">
        <i :class="copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'" />
        {{ copied ? "Copied" : "Copy" }}
      </button>
      <pre class="ts-code__pre"><code>{{ displayCode }}</code></pre>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Ratio } from "~/types/flag";

const props = defineProps<{
  cc: string;
  name: string;
  ratio: Ratio;
  svg1x1: string;
  svg4x3: string;
}>();

type TabId = "html" | "css" | "svg" | "cdn" | "img";

const tab = ref<TabId>("svg");
const copied = ref(false);
const { absolute, rasterUrl, svgUrl } = useRaster();
const { copyText } = useCopy();

const useTabs = [
  { id: "html" as const, label: "HTML" },
  { id: "css" as const, label: "CSS" },
];
const copyTabs = [
  { id: "svg" as const, label: "SVG" },
  { id: "cdn" as const, label: "CDN" },
  { id: "img" as const, label: "IMG" },
];

const rawSvg = computed(() => (props.ratio === "1x1" ? props.svg1x1 : props.svg4x3));

const displayCode = computed(() => {
  if (tab.value === "html") {
    const h = props.ratio === "1x1" ? 32 : 24;
    return `<img src="${absolute(svgUrl(props.ratio, props.cc))}" alt="${props.name} flag" width="32" height="${h}" />`;
  }
  if (tab.value === "css") {
    return `<link rel="stylesheet" href="${absolute("/css/flag-icons.min.css")}" />\n<span class="fi fi-${props.cc}"></span>`;
  }
  if (tab.value === "svg") {
    return rawSvg.value
      .replace(/>\s*</g, ">\n<")
      .replace(/\s{2,}/g, " ")
      .trim();
  }
  if (tab.value === "cdn") return absolute(svgUrl(props.ratio, props.cc));
  return absolute(rasterUrl(props.ratio, 64, props.cc, "png"));
});

async function onCopy() {
  const text = tab.value === "svg" ? rawSvg.value.trim() : displayCode.value;
  await copyText(text);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 1500);
}
</script>

<style scoped>
.ts-code {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--flag-detail-panel-soft);
  box-shadow: var(--shadow-card);
}
.ts-code__tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0.85rem;
  border-bottom: 1px solid var(--border);
}
.ts-code__group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.ts-code__divider {
  width: 1px;
  height: 1rem;
  background: var(--border);
}
.ts-code__tab {
  padding: 0.26rem 0.56rem;
  border: none;
  border-radius: 999px;
  background: var(--flag-detail-chip);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
}
.ts-code__tab:hover {
  background: var(--flag-detail-control-hover);
  color: var(--text-heading);
}
.ts-code__tab.is-active {
  background: var(--flag-detail-primary-bg);
  color: var(--flag-detail-primary-text);
}
.ts-code__body {
  position: relative;
}
.ts-code__copy {
  position: absolute;
  top: 0.65rem;
  right: 0.75rem;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--flag-detail-control);
  color: #94a3b8;
  font-size: 0.625rem;
  font-weight: 600;
  cursor: pointer;
}
.ts-code__copy:hover {
  background: var(--flag-detail-control-hover);
  color: var(--text-heading);
}
.ts-code__pre {
  margin: 0;
  max-height: 14rem;
  overflow: auto;
  padding: 1rem 4.75rem 1rem 1rem;
  background: var(--flag-detail-code-bg);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  line-height: 1.6;
  color: var(--flag-detail-code-text);
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
