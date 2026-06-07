# 技术栈（Nuxt + Go）

## 架构

```
浏览器 → Nuxt 3（页面 / SSG / SEO）
       → Go API（JSON、栅格渲染、统计）
       → 静态文件（flags/、raster/、css/）
```

仓库内**无 PHP / 无遗留 HTML 页面**。

## 路由

| 路径 | 处理方 |
|------|--------|
| `/`、`/flags`、`/docs`、`/changelog`、`/issues` | Nuxt |
| `/flag/:cc` | Nuxt SSG |
| `/api/v1/flags`、`/api/v1/flags/:cc`、`/api/v1/flags/:cc/svg` | Go |
| `/api/v1/visitor-country` | Go |
| `/api/stats` | Go |
| `/api/v1/render` | Go（动态尺寸渲染） |
| `/i/:ratio/:w/:cc.:ext` | Go |
| `/flags/:ratio/:cc.svg` | Go 或静态 |
| `/sitemap.xml`、`/robots.txt` | Nuxt Nitro |

## 开发

```bash
make install
make dev
```

Nuxt 通过 `routeRules` 将 `/api/*`、`/i/*` 代理到 Go（默认 `http://127.0.0.1:8080`）。

## 生产

```bash
make build-static
rsync -a apps/web/.output/public/ ./site-dist/
# 与 flags/、raster/、css/ 一并部署；Nginx 反代 Go，见 deploy/nginx.conf.example
```

`.env`（仓库根目录，勿提交）：

| 变量 | 用途 |
|------|------|
| `CLOUDFLARE_API_TOKEN` | `/api/stats` |
| `CLOUDFLARE_ZONE_ID` | `/api/stats` |
| `FLAGCDN_API_BASE` | Nuxt 构建时 Go 地址 |
| `SITE_URL` | SEO 绝对 URL |
