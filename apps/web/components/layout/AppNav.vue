<template>
  <header class="nav" :class="{ 'nav--open': mobileOpen }">
    <div class="nav__shell">
      <div class="nav__bar">
        <NuxtLink to="/" class="nav__logo">
          <img src="/logo.svg" alt="" width="22" height="22" class="nav__logo-mark" aria-hidden="true" />
          <span>flagcdn<span class="nav__logo-tld">.io</span></span>
        </NuxtLink>
        <nav class="nav__links" aria-label="Main">
          <NuxtLink to="/flags" class="nav__link">
            <i class="fa-solid fa-flag" aria-hidden="true" />
            {{ t("nav.flags") }}
          </NuxtLink>
          <NuxtLink to="/docs" class="nav__link">
            <i class="fa-solid fa-file-lines" aria-hidden="true" />
            {{ t("nav.docs") }}
          </NuxtLink>
          <NuxtLink to="/changelog" class="nav__link">
            <i class="fa-solid fa-clock-rotate-left" aria-hidden="true" />
            {{ t("nav.changelog") }}
          </NuxtLink>
          <NuxtLink to="/issues" class="nav__link">
            <i class="fa-solid fa-comment-dots" aria-hidden="true" />
            {{ t("nav.feedback") }}
          </NuxtLink>
        </nav>
        <div class="nav__actions">
          <span class="nav__badge" :title="statsTitle">
            <i class="fa-solid fa-bolt" aria-hidden="true" />
            {{ requestCount }}
          </span>
          <LayoutLangSwitcher />
          <a
            :href="`https://github.com/${githubRepo}`"
            class="nav__icon-btn nav__icon-btn--github"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            <i class="fa-brands fa-github" aria-hidden="true" />
            <span v-if="githubStars" class="nav__github-stars">{{ githubStars }}</span>
          </a>
          <button type="button" class="nav__theme nav__icon-btn" aria-label="Toggle theme" @click="toggleTheme">
            <i class="fa-solid" :class="isDark ? 'fa-sun' : 'fa-moon'" />
          </button>
          <button type="button" class="nav__menu nav__icon-btn" aria-label="Menu" @click="mobileOpen = !mobileOpen">
            <i class="fa-solid fa-bars" />
          </button>
        </div>
      </div>
    </div>
    <div v-if="mobileOpen" class="nav__mobile">
      <NuxtLink to="/flags" class="nav__mobile-link" @click="mobileOpen = false">
        <i class="fa-solid fa-flag" /> {{ t("nav.flags") }}
      </NuxtLink>
      <NuxtLink to="/docs" class="nav__mobile-link" @click="mobileOpen = false">
        <i class="fa-solid fa-file-lines" /> {{ t("nav.docs") }}
      </NuxtLink>
      <NuxtLink to="/changelog" class="nav__mobile-link" @click="mobileOpen = false">
        <i class="fa-solid fa-clock-rotate-left" /> {{ t("nav.changelog") }}
      </NuxtLink>
      <NuxtLink to="/issues" class="nav__mobile-link" @click="mobileOpen = false">
        <i class="fa-solid fa-comment-dots" /> {{ t("nav.feedback") }}
      </NuxtLink>
    </div>
  </header>
  <div class="nav__spacer" aria-hidden="true" />
</template>

<script setup lang="ts">
const mobileOpen = ref(false);
const { t } = useSiteI18n();
const { requestCount, githubStars, githubRepo } = useNavStats();

const statsTitle = "API requests (30 days)";

function readDark() {
  if (import.meta.server) return false;
  return document.documentElement.classList.contains("dark");
}

const isDark = ref(readDark());

onMounted(() => {
  isDark.value = readDark();
});

function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
  localStorage.setItem("flagcdn-theme", isDark.value ? "dark" : "light");
}
</script>
