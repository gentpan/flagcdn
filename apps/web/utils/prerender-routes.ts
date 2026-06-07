import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** 构建时收集所有需要 SSG 的 /flag/{cc} 路由 */
export function collectFlagPrerenderRoutes(repoRoot: string): string[] {
  const codes = new Set<string>();

  for (const ratio of ["1x1", "4x3"]) {
    const dir = join(repoRoot, "flags", ratio);
    try {
      for (const f of readdirSync(dir)) {
        if (f.endsWith(".svg")) codes.add(f.slice(0, -4));
      }
    } catch {
      /* ignore */
    }
  }

  try {
    const list = JSON.parse(readFileSync(join(repoRoot, "data/country.json"), "utf-8")) as {
      code: string;
    }[];
    for (const c of list) codes.add(c.code);
  } catch {
    /* ignore */
  }

  return [...codes].sort().map((code) => `/flag/${code}`);
}
