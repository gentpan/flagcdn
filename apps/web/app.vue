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

<style>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.app-main {
  flex: 1;
}
.global-toast {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--text-heading);
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  z-index: 100;
  box-shadow: var(--shadow-card);
}
.toast-enter-active, .toast-leave-active { transition: opacity 0.2s, transform 0.2s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 8px); }
</style>
