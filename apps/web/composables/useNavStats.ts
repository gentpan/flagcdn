import { formatCompact } from "~/utils/format";

export function useNavStats() {
  const config = useRuntimeConfig();
  const githubRepo = config.public.githubRepo as string;

  const requestCount = ref("-");
  const githubStars = ref("");

  onMounted(async () => {
    fetchRequestStats();
  });

  async function fetchRequestStats() {
    if (import.meta.client && isLocalStaticPreview()) return;

    try {
      const data = await $fetch<{ requests?: number }>("/api/stats");
      if (typeof data.requests === "number") {
        requestCount.value = formatCompact(data.requests);
      }
    } catch {
      /* keep dash */
    }
  }

  function isLocalStaticPreview() {
    const { hostname, port } = window.location;
    return (hostname === "localhost" || hostname === "127.0.0.1") && port === "3000";
  }

  return { requestCount, githubStars, githubRepo };
}
