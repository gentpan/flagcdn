import { visitorCountryFromHeaders } from "~/utils/visitor-country";

export function useVisitorCountry() {
  const flagCode = useState("visitor-country-flag", () => "un");

  if (import.meta.server) {
    const headers = useRequestHeaders([
      "cf-ipcountry",
      "cdn-requestcountrycode",
      "x-vercel-ip-country",
    ]);
    const cc = visitorCountryFromHeaders(headers);
    if (cc) flagCode.value = cc;
  }

  if (import.meta.client && flagCode.value === "un") {
    onMounted(async () => {
      try {
        const res = await $fetch<{ code: string | null }>("/api/v1/visitor-country");
        if (res.code) flagCode.value = res.code;
      } catch {
        /* keep UN fallback */
      }
    });
  }

  return computed(() => flagCode.value);
}
