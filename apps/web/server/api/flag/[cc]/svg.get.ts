import { readFile } from "node:fs/promises";
import { join } from "node:path";

export default defineEventHandler(async (event) => {
  const cc = getRouterParam(event, "cc")?.toLowerCase() || "";
  const config = useRuntimeConfig();
  const root = config.repoRoot as string;

  const [svg1x1, svg4x3] = await Promise.all([
    readFile(join(root, "flags/1x1", `${cc}.svg`), "utf-8").catch(() => ""),
    readFile(join(root, "flags/4x3", `${cc}.svg`), "utf-8").catch(() => ""),
  ]);

  if (!svg1x1 && !svg4x3) {
    throw createError({ statusCode: 404, statusMessage: "SVG not found" });
  }

  return { svg1x1, svg4x3 };
});
