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

<style scoped>
.docs-code {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0 1rem;
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg-card) 60%, var(--bg-page));
  border-radius: 6px;
}
.docs-code__pre {
  flex: 1;
  margin: 0;
  padding: 0;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  overflow-x: auto;
  white-space: nowrap;
  background: none;
  border: none;
  color: var(--text-body);
}
.docs-code__btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.docs-code__btn:hover {
  color: var(--brand);
  background: var(--brand-muted);
}
.docs-code__btn.is-copied {
  color: var(--brand);
}
</style>
