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
