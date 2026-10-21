import { useEffect, useState } from "react";
import type { Country, FlagDetailResponse } from "../types/flag";

export async function fetchAllFlags(): Promise<Country[]> {
  const res = await fetch("/api/v1/flags");
  if (!res.ok) throw new Error(`flags: ${res.status}`);
  return (await res.json()) as Country[];
}

export async function fetchFlagDetail(cc: string): Promise<FlagDetailResponse> {
  const res = await fetch(`/api/v1/flags/${encodeURIComponent(cc)}`);
  if (!res.ok) throw new Error(`flag ${cc}: ${res.status}`);
  return (await res.json()) as FlagDetailResponse;
}

export async function fetchFlagSvg(cc: string): Promise<{ svg1x1: string; svg4x3: string }> {
  const res = await fetch(`/api/v1/flags/${encodeURIComponent(cc)}/svg`);
  if (!res.ok) throw new Error(`flag svg ${cc}: ${res.status}`);
  return (await res.json()) as { svg1x1: string; svg4x3: string };
}

export function useAllFlags() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAllFlags()
      .then((list) => {
        if (!cancelled) setCountries(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { countries, loading, error };
}
