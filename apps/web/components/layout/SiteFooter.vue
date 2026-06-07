<template>
  <footer class="footer">
    <div class="footer__main container-app">
      <p class="footer__tagline">{{ t("footer.tagline") }}</p>
    </div>
    <div class="footer__bar">
      <div class="container-app footer__bar-inner">
        <p class="footer__copy">
          © {{ year }} <span class="footer__domain">flagcdn.io</span> {{ t("footer.rights") }}
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
    <div class="footer__watermark-wrap" aria-hidden="true">
      <span class="footer__watermark">flagcdn</span>
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
  border-top: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg-page) 70%, var(--border) 30%);
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
.footer__watermark-wrap {
  overflow: hidden;
  text-align: center;
  margin: 0;
  /* 只显示约 75%，底部 25% 裁切隐藏 */
  height: clamp(54px, 13.5vw, 150px);
}
.footer__watermark {
  display: block;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(72px, 18vw, 200px);
  line-height: 1;
  color: rgba(29, 111, 168, 0.1);
  white-space: nowrap;
  transition: color 0.2s;
}
.footer__watermark-wrap:hover .footer__watermark {
  color: var(--brand);
}
.dark .footer__watermark {
  color: rgba(91, 168, 224, 0.12);
}
</style>
