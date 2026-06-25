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
