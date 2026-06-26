<template>
  <div class="app-shell">
    <LayoutAppNav />
    <main class="app-main">
      <NuxtPage />
    </main>
    <LayoutSiteFooter />
    <Transition name="toast">
      <div v-if="toast" class="global-toast global-toast--success" role="status" aria-live="polite">
        <i class="fa-solid fa-circle-check" aria-hidden="true" />
        <span>{{ toast }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { toast } = useCopy();
</script>
