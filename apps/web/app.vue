<template>
  <div class="app-shell">
    <LayoutAppNav />
    <main class="app-main">
      <NuxtPage />
    </main>
    <LayoutSiteFooter />
    <Transition name="toast">
      <div v-if="toast" class="global-toast">{{ toast }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { toast } = useCopy();
</script>
