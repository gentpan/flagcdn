<template>
  <div class="error-page container-app">
    <h1>{{ error.statusCode === 404 ? "404" : error.statusCode }}</h1>
    <p>{{ error.statusCode === 404 ? "Page not found." : error.message }}</p>
    <NuxtLink to="/" class="btn-primary">Back home</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{ error: NuxtError }>();
</script>

<style scoped>
.error-page {
  text-align: center;
  padding: 4rem 1rem;
}
.error-page h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}
.error-page p {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}
</style>
