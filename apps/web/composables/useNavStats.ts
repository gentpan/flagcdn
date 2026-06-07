import { formatCompact, formatStars } from "~/utils/format";

export function useNavStats() {
  const config = useRuntimeConfig();
  const githubRepo = config.public.githubRepo as string;

  const requestCount = ref("-");
  const githubStars = ref("");

  onMounted(async () => {
    fetchGitHubStars();
    fetchRequestStats();
  });

  async function fetchGitHubStars() {
    try {
      const data = await $fetch<{ stargazers_count?: number }>(
        `https://api.github.com/repos/${githubRepo}`,
        { headers: { Accept: "application/vnd.github.v3+json" } },
      );
      const n = data?.stargazers_count ?? 0;
      if (n > 0) githubStars.value = formatStars(n);
    } catch {
      /* keep empty */
    }
  }

  async function fetchRequestStats() {
    try {
      const data = await $fetch<{ requests?: number }>("/api/stats");
      if (typeof data.requests === "number") {
        requestCount.value = formatCompact(data.requests);
      }
    } catch {
      /* keep dash */
    }
  }

  return { requestCount, githubStars, githubRepo };
}
