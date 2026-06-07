import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { collectFlagPrerenderRoutes } from "./utils/prerender-routes";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const flagRoutes = collectFlagPrerenderRoutes(repoRoot);

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    repoRoot,
    apiBase: process.env.FLAGCDN_API_BASE || "http://127.0.0.1:8080",
    public: {
      siteUrl: process.env.SITE_URL || "https://flagcdn.io",
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
      githubRepo: process.env.NUXT_PUBLIC_GITHUB_REPO || "gentpan/flagcdn",
    },
  },
  nitro: {
    devProxy: {
      "/api/v1": { target: "http://127.0.0.1:8080/api/v1", changeOrigin: true },
      "/i": { target: "http://127.0.0.1:8080/i", changeOrigin: true },
    },
    publicAssets: [
      { dir: repoRoot + "/flags", baseURL: "/flags", maxAge: 60 * 60 * 24 * 365 },
      { dir: repoRoot + "/css", baseURL: "/css", maxAge: 60 * 60 * 24 * 365 },
      { dir: repoRoot + "/raster", baseURL: "/raster", maxAge: 60 * 60 * 24 * 365 },
    ],
    prerender: {
      crawlLinks: false,
      routes: ["/", "/flags", "/docs", "/issues", "/sitemap.xml", "/robots.txt", ...flagRoutes],
    },
  },
  $production: {
    experimental: {
      checkOutdatedBuildInterval: 60_000,
    },
  },
  routeRules: {
    "/": { prerender: true, headers: { "Cache-Control": "public, max-age=0, must-revalidate" } },
    "/flags": { prerender: true, headers: { "Cache-Control": "public, max-age=0, must-revalidate" } },
    "/docs": { prerender: true, headers: { "Cache-Control": "public, max-age=0, must-revalidate" } },
    "/issues": { prerender: true, headers: { "Cache-Control": "public, max-age=0, must-revalidate" } },
    "/sitemap.xml": { prerender: true },
    "/robots.txt": { prerender: true },
    "/flag/**": {
      prerender: true,
      headers: { "Cache-Control": "public, max-age=0, must-revalidate" },
    },
    "/_nuxt/**": { headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      titleTemplate: "%s · flagcdn.io",
      meta: [
        { name: "robots", content: "index, follow" },
        { property: "og:site_name", content: "flagcdn.io" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      script: [
        {
          key: "theme-init",
          innerHTML: `(function(){try{var t=localStorage.getItem("flagcdn-theme");if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}})();`,
          type: "text/javascript",
          tagPosition: "head",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "stylesheet", href: "/css/flag-icons.min.css" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Sora:wght@600;700;800&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/css/all.min.css",
        },
      ],
    },
  },
});
