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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  max-width: min(90vw, 24rem);
  background: var(--bg-card);
  color: var(--text-heading);
  border: 1px solid var(--border-strong);
  border-left: 3px solid var(--brand);
  padding: 0.65rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1.3;
  z-index: 100;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  pointer-events: none;
}
.global-toast::before {
  content: "";
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--brand);
  flex: 0 0 auto;
}
.dark .global-toast {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.36);
}
.toast-enter-active, .toast-leave-active { transition: opacity 0.2s, transform 0.2s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 8px); }
</style>
