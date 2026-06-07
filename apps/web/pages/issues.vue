<template>
  <div class="container-app issues-page">
    <header class="issues-page__hero">
      <h1>{{ t("nav.feedback") }}</h1>
      <p>Report flag errors, request new flags, or suggest improvements.</p>
    </header>
    <section class="issues-page__card card">
      <p>
        Send feedback to
        <a href="mailto:support@flagcdn.io">support@flagcdn.io</a>
        or open an issue on
        <a :href="`https://github.com/${githubRepo}/issues`" target="_blank" rel="noopener">GitHub Issues</a>.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useSiteI18n();
const githubRepo = useRuntimeConfig().public.githubRepo as string;

useSeoMeta({
  title: "Feedback",
  description: "Report flag errors, request new flags, or suggest improvements to flagcdn.io.",
});
</script>

<style scoped>
.issues-page {
  padding: 0.5rem 0 2rem;
}
.issues-page__hero {
  margin-bottom: 1.25rem;
}
.issues-page__hero h1 {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
}
.issues-page__hero p {
  color: var(--text-muted);
  font-size: 0.95rem;
}
.issues-page__card {
  padding: 1.25rem 1.5rem;
  color: var(--text-body);
  line-height: 1.65;
}
.issues-page__card a {
  color: var(--brand);
}
</style>
