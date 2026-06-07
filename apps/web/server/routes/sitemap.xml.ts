import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

function collectCodes(root: string): string[] {
  const codes = new Set<string>();
  for (const ratio of ["1x1", "4x3"]) {
    try {
      for (const f of readdirSync(join(root, "flags", ratio))) {
        if (f.endsWith(".svg")) codes.add(f.slice(0, -4));
      }
    } catch { /* */ }
  }
  return [...codes].sort();
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const base = (config.public.siteUrl as string).replace(/\/$/, "");
  const root = config.repoRoot as string;
  const codes = collectCodes(root);

  const staticPages = ["", "/flags", "/docs", "/changelog", "/issues"];
  const urls = [
    ...staticPages.map((p) => ({
      loc: `${base}${p || "/"}`,
      priority: p === "" ? "1.0" : "0.8",
      changefreq: "weekly",
    })),
    ...codes.map((cc) => ({
      loc: `${base}/flag/${cc}`,
      priority: "0.7",
      changefreq: "monthly",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  setHeader(event, "Cache-Control", "public, max-age=86400");
  return xml;
});
