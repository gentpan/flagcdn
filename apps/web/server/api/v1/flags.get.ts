import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Country } from "~/types/flag";

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const raw = await readFile(join(config.repoRoot, "data/country.json"), "utf-8");
  return JSON.parse(raw) as Country[];
});
