export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const base = (config.public.siteUrl as string).replace(/\/$/, "");

  const body = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`;

  setHeader(event, "Content-Type", "text/plain; charset=utf-8");
  setHeader(event, "Cache-Control", "public, max-age=86400");
  return body;
});
