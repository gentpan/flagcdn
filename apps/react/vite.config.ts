import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const apiBase = process.env.FLAGCDN_API_BASE || "http://127.0.0.1:8080";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      "/api": { target: apiBase, changeOrigin: true },
      // 细分到比例子路径：整段 /flags 会拦截 SPA 的 /flags 页面路由
      "/flags/1x1": { target: apiBase, changeOrigin: true },
      "/flags/4x3": { target: apiBase, changeOrigin: true },
      "/1x1": { target: apiBase, changeOrigin: true },
      "/4x3": { target: apiBase, changeOrigin: true },
      // /css 不走代理：Go API 不服务该路径，dev/build 由 public/css 副本提供
    },
  },
});
