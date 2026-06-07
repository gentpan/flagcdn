<template>
  <div class="ts-cmds">
    <div class="ts-cmds__row">
      <span class="ts-cmds__tag ts-cmds__tag--css">CSS</span>
      <code class="ts-cmds__code">{{ cssShort }}</code>
      <button type="button" class="ts-cmds__copy" @click="copy('css', cssFull)">
        <i :class="copied === 'css' ? 'fa-solid fa-check' : 'fa-regular fa-copy'" />
      </button>
    </div>
    <div class="ts-cmds__row">
      <span class="ts-cmds__tag ts-cmds__tag--cdn">CDN</span>
      <code class="ts-cmds__code">{{ cdnShort }}</code>
      <button type="button" class="ts-cmds__copy" @click="copy('cdn', cdnFull)">
        <i :class="copied === 'cdn' ? 'fa-solid fa-check' : 'fa-regular fa-copy'" />
      </button>
    </div>
    <div class="ts-cmds__row">
      <span class="ts-cmds__tag ts-cmds__tag--img">IMG</span>
      <code class="ts-cmds__code">{{ imgShort }}</code>
      <button type="button" class="ts-cmds__copy" @click="copy('img', imgFull)">
        <i :class="copied === 'img' ? 'fa-solid fa-check' : 'fa-regular fa-copy'" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ratio } from "~/types/flag";

const props = defineProps<{ cc: string; ratio: Ratio }>();
const { absolute, rasterUrl, svgUrl } = useRaster();
const { copyText } = useCopy();

const copied = ref<string | null>(null);
let timer: ReturnType<typeof setTimeout> | undefined;

const cssFull = computed(
  () => `<link rel="stylesheet" href="${absolute("/css/flag-icons.min.css")}" />`,
);
const cdnFull = computed(() => absolute(svgUrl(props.ratio, props.cc)));
const imgFull = computed(() => absolute(rasterUrl(props.ratio, 64, props.cc, "png")));

const stripProto = (url: string) => url.replace(/^https?:\/\//, "");
const cssShort = computed(() => stripProto(cssFull.value));
const cdnShort = computed(() => stripProto(cdnFull.value));
const imgShort = computed(() => stripProto(imgFull.value));

async function copy(key: string, text: string) {
  await copyText(text);
  copied.value = key;
  clearTimeout(timer);
  timer = setTimeout(() => {
    copied.value = null;
  }, 1500);
}
</script>

<style scoped>
.ts-cmds {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.ts-cmds__row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
}
.ts-cmds__tag {
  flex-shrink: 0;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 700;
}
.ts-cmds__tag--css {
  background: rgba(29, 111, 168, 0.12);
  color: var(--brand);
}
.ts-cmds__tag--cdn {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
}
.ts-cmds__tag--img {
  background: rgba(249, 115, 22, 0.12);
  color: #ea580c;
}
.ts-cmds__code {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-body);
}
.ts-cmds__copy {
  flex-shrink: 0;
  padding: 0.25rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
}
.ts-cmds__copy:hover {
  color: var(--text-heading);
}
</style>
