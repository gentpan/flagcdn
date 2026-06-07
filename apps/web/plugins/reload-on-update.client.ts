export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:manifest:update", () => {
    window.location.reload();
  });
});
