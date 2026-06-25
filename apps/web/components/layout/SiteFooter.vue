<template>
  <footer class="footer">
    <div class="footer__main container-app">
      <p class="footer__tagline">{{ t("footer.tagline") }}</p>
    </div>
    <div class="footer__bar">
      <div class="container-app footer__bar-inner">
        <p class="footer__copy">
          © {{ year }} <span class="footer__domain">flagcdn<span class="footer__domain-tld">.io</span></span> {{ t("footer.rights") }}
        </p>
        <div class="footer__icons">
          <NuxtLink to="/docs" class="footer__icon" title="Docs">
            <i class="fa-solid fa-file-lines" aria-hidden="true" />
          </NuxtLink>
          <a href="mailto:support@flagcdn.io" class="footer__icon" title="support@flagcdn.io" aria-label="Email">
            <i class="fa-solid fa-envelope" aria-hidden="true" />
          </a>
          <a
            :href="`https://github.com/${githubRepo}`"
            class="footer__icon"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            <i class="fa-brands fa-github" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
    <div class="footer__brand" aria-hidden="true">
      <span class="footer__brand-text">flagcdn</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
const { t } = useSiteI18n();
const githubRepo = useRuntimeConfig().public.githubRepo as string;
</script>

<style scoped>
.footer {
  margin-top: 3rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-page);
}
.footer__main {
  padding: 2rem 0 1.5rem;
}
.footer__tagline {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0;
}
.footer__bar {
  background: var(--bg-page);
  padding: 0.65rem 0;
}
.footer__bar-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
}
.footer__copy {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}
.footer__domain {
  color: var(--text-body);
  font-weight: 600;
}
.footer__domain-tld {
  color: var(--brand-light);
}
.footer__icons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.footer__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
}
.footer__icon:hover {
  color: var(--brand);
  background: var(--brand-muted);
}
.footer__brand {
  overflow: hidden;
  text-align: center;
  height: clamp(58px, 13vw, 150px);
  margin-top: 0.25rem;
}
.footer__brand-text {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(78px, 18vw, 210px);
  font-weight: 800;
  line-height: 1;
  color: rgba(255, 255, 255, 0.08);
  white-space: nowrap;
  transition: color 0.18s;
}
.footer__brand:hover .footer__brand-text {
  color: var(--brand-light);
}
</style>
