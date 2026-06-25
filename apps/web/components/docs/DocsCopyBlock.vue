<template>
  <div class="docs-code">
    <pre class="docs-code__pre"><code>{{ text }}</code></pre>
    <button
      type="button"
      class="docs-code__btn"
      :class="{ 'is-copied': copied }"
      :aria-label="copied ? 'Copied' : 'Copy'"
      @click="onCopy"
    >
      <i :class="copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ text: string }>();
const { copyText } = useCopy();
const { t } = useSiteI18n();
const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

async function onCopy() {
  const ok = await copyText(props.text, t("toast.copied"));
  if (!ok) return;
  copied.value = true;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    copied.value = false;
  }, 2000);
}
</script>
