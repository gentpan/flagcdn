import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { collectFlagPrerenderRoutes } from "./utils/prerender-routes";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const flagRoutes = collectFlagPrerenderRoutes(repoRoot);
const apiBase = process.env.FLAGCDN_API_BASE || "http://127.0.0.1:8080";

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  devtools: { enabled: true },
  experimental: {
    payloadExtraction: false,
  },
  css: ["~/assets/css/main.css"],
  modules: [],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: false,
      minify: "esbuild",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) return "vendor";
          },
        },
      },
    },
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
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
    devProxy: {
      "/api/v1": { target: `${apiBase}/api/v1`, changeOrigin: true },
      "/api/stats": { target: `${apiBase}/api/stats`, changeOrigin: true },
      "/i": { target: `${apiBase}/i`, changeOrigin: true },
    },
    publicAssets: [
      { dir: repoRoot + "/flags", baseURL: "/flags", maxAge: 60 * 60 * 24 * 365 },
      { dir: repoRoot + "/css", baseURL: "/css", maxAge: 60 * 60 * 24 * 365 },
      { dir: repoRoot + "/raster", baseURL: "/raster", maxAge: 60 * 60 * 24 * 365 },
    ],
    prerender: {
      crawlLinks: false,
      routes: ["/", "/flags", "/docs", "/issues", "/changelog", "/sitemap.xml", "/robots.txt", ...flagRoutes],
    },
  },
  $production: {
    experimental: {
      checkOutdatedBuildInterval: 60_000,
    },
  },
  routeRules: {
    "/api/v1/**": { proxy: `${apiBase}/api/v1/**` },
    "/api/stats": { proxy: `${apiBase}/api/stats` },
    "/i/**": { proxy: `${apiBase}/i/**` },
    "/": { prerender: true, headers: { "Cache-Control": "public, max-age=0, must-revalidate" } },
    "/flags": { prerender: true, headers: { "Cache-Control": "public, max-age=0, must-revalidate" } },
    "/docs": { prerender: true, headers: { "Cache-Control": "public, max-age=0, must-revalidate" } },
    "/issues": { prerender: true, headers: { "Cache-Control": "public, max-age=0, must-revalidate" } },
    "/changelog": { prerender: true, headers: { "Cache-Control": "public, max-age=0, must-revalidate" } },
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
        { name: "theme-color", content: "#22c55e" },
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
        { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "stylesheet", href: "/css/flag-icons.min.css" },
        {
          rel: "stylesheet",
          href: "https://static.bluecdn.com/fonts/inter/result.css",
        },
        {
          rel: "stylesheet",
          href: "https://static.bluecdn.com/libs/fontawesome/7.2.0/css/all.min.css",
        },
      ],
    },
  },
});
