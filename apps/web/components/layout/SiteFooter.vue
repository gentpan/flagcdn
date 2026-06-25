<template>
  <footer class="footer">
    <div class="footer__main container-app">
      <p class="footer__tagline">{{ t("footer.tagline") }}</p>
      <p class="footer__license">Flag assets and source code are available under the MIT License.</p>
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
