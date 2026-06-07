import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
import type { Country } from "~/types/flag";

export default defineEventHandler(async (event) => {
  const cc = getRouterParam(event, "cc")?.toLowerCase() || "";
  const config = useRuntimeConfig();
  const root = config.repoRoot as string;

  const raw = await readFile(join(root, "data/country.json"), "utf-8");
  const list = JSON.parse(raw) as Country[];
  const found = list.find((c) => c.code === cc);

  if (!found) {
    try {
      await access(join(root, "flags/1x1", `${cc}.svg`));
    } catch {
      throw createError({ statusCode: 404, statusMessage: "Not found" });
    }
    return {
      country: { code: cc, name: cc.toUpperCase(), iso: false },
      related: [],
      svg: { "1x1": `/flags/1x1/${cc}.svg`, "4x3": `/flags/4x3/${cc}.svg` },
    };
  }

  const related = list
    .filter((c) => c.code !== cc && c.continent === found.continent)
    .slice(0, 11);

  return {
    country: found,
    related,
    svg: { "1x1": `/flags/1x1/${cc}.svg`, "4x3": `/flags/4x3/${cc}.svg` },
  };
});
