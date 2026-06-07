const BLOCKED = new Set(["xx", "t1"]);

export function normalizeVisitorCountry(raw: string | undefined | null): string {
  if (!raw) return "";
  const cc = raw.trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(cc) || BLOCKED.has(cc)) return "";
  return cc;
}

/** Read geo country from common CDN / reverse-proxy headers (same rules as header.php). */
export function visitorCountryFromHeaders(
  headers: Record<string, string | string[] | undefined>,
): string {
  const lookup = (name: string) => {
    const entry = Object.entries(headers).find(([k]) => k.toLowerCase() === name);
    const v = entry?.[1];
    return Array.isArray(v) ? v[0] : v;
  };

  for (const name of ["cf-ipcountry", "cdn-requestcountrycode", "x-vercel-ip-country"]) {
    const cc = normalizeVisitorCountry(lookup(name));
    if (cc) return cc;
  }
  return "";
}
