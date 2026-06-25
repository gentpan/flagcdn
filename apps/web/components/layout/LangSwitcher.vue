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
