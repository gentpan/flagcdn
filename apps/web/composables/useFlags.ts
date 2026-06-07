import type { Country, FlagDetailResponse } from "~/types/flag";

export function useFlags() {
  async function fetchAll(): Promise<Country[]> {
    return await $fetch<Country[]>("/api/v1/flags");
  }

  async function fetchDetail(cc: string): Promise<FlagDetailResponse> {
    return await $fetch<FlagDetailResponse>(`/api/v1/flags/${encodeURIComponent(cc)}`);
  }

  return { fetchAll, fetchDetail };
}
