<template>
  <div class="lang" :class="{ 'lang--open': open }">
    <button
      type="button"
      class="lang__trigger nav__icon-btn"
      :aria-label="`Language: ${currentLang.label}`"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click.stop="open = !open"
    >
      <span class="fi lang__flag" :class="`fi-${currentLang.flag}`" aria-hidden="true" />
    </button>
    <ul v-show="open" class="lang__menu" role="listbox">
      <li
        v-for="item in SITE_LANGS"
        :key="item.code"
        role="option"
        class="lang__option"
        :aria-selected="lang === item.code"
        @click="pick(item.code)"
      >
        <span class="fi" :class="`fi-${item.flag}`" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { SiteLang } from "~/composables/useSiteI18n";
import { SITE_LANGS, useSiteI18n } from "~/composables/useSiteI18n";

const { lang, currentLang, setLang } = useSiteI18n();
const open = ref(false);

function pick(code: SiteLang) {
  setLang(code);
  open.value = false;
}

onMounted(() => {
  document.addEventListener("click", () => {
    open.value = false;
  });
});
</script>

<style scoped>
.lang {
  position: relative;
}
.lang__flag {
  width: 1.25rem;
  height: 0.94rem;
  border-radius: 2px;
}
.lang__menu {
  position: absolute;
  top: calc(100% + 0.35rem);
  right: 0;
  z-index: 100;
  min-width: 9rem;
  margin: 0;
  padding: 0.35rem;
  list-style: none;
  background: var(--nav-dark);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}
.lang__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.55rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
}
.lang__option:hover,
.lang__option[aria-selected="true"] {
  background: rgba(255, 255, 255, 0.1);
}
.lang__option .fi {
  width: 1.1rem;
  height: 0.82rem;
  border-radius: 2px;
}
</style>
