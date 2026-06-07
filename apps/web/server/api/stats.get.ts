export default defineEventHandler(async () => {
  try {
    return await $fetch<{ requests: number; bytes?: number; visitors?: number }>(
      "https://flagcdn.io/api/stats.php",
    );
  } catch {
    return { requests: 0 };
  }
});
