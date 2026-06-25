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

<style scoped>
.nav {
  position: fixed;
  top: 16px;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}
.nav__shell {
  pointer-events: auto;
  width: min(1000px, calc(100% - 32px));
  background: var(--nav-dark);
  border-radius: 28px;
  padding: 6px;
  box-shadow: 0 10px 40px rgba(15, 23, 42, 0.15);
}
.nav__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 14px;
}
.nav__logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 16px;
  text-decoration: none;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}
.nav__logo-tld { color: var(--brand-light); }
.dark .nav__logo-tld { color: #4ade80; }
.nav__logo-mark { width: 22px; height: 22px; flex-shrink: 0; display: block; }
.nav__links {
  display: flex;
  gap: 2px;
  margin-left: 8px;
  flex: 1;
  min-width: 0;
}
.nav__link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: rgba(255,255,255,0.72);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  padding: 0 10px;
  height: 36px;
  border-radius: 999px;
  white-space: nowrap;
}
.nav__link i { font-size: 0.75rem; opacity: 0.85; }
.nav__link:hover, .nav__link.router-link-active {
  color: #fff;
  background: rgba(255,255,255,0.08);
}
.nav__actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  flex-shrink: 0;
}
.nav__badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.75);
  font-size: 12px;
  font-weight: 600;
}
:deep(.nav__icon-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
}
:deep(.nav__icon-btn:hover) {
  background: rgba(255,255,255,0.16);
  color: #fff;
}
.nav__icon-btn--github {
  width: auto;
  min-width: 36px;
  padding: 0 10px;
  gap: 4px;
}
.nav__github-stars {
  font-size: 11px;
  font-weight: 600;
}
.nav__menu { display: none; }
.nav__spacer { height: 92px; }
.nav__mobile {
  pointer-events: auto;
  width: min(1000px, calc(100% - 32px));
  margin-top: 8px;
  padding: 8px;
  background: var(--nav-dark);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav__mobile-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  border-radius: 10px;
  font-size: 14px;
}
.nav__mobile-link:hover { background: rgba(255,255,255,0.08); }
@media (max-width: 900px) {
  .nav__links { display: none; }
  .nav__badge { display: none; }
  .nav__menu { display: inline-flex; }
}
</style>
