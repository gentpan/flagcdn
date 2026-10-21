# 技术栈（React + Go）

## 架构

```
浏览器 → React SPA（Vite 构建的静态站）
       → Go API（JSON、栅格渲染、统计）
       → 静态文件（flags/、1x1/、4x3/、css/）
```

前端源码在 `apps/react/`（React 19 + TypeScript + Tailwind CSS v4 + React Router）。
旧的 Nuxt 参考实现保留在 `apps/web/`，PHP 版本已从仓库移除。

## 路由

| 路径 | 处理方 |
|------|--------|
| `/`、`/flags`、`/docs`、`/changelog`、`/issues` | React（客户端路由） |
| `/flag/:cc` | React |
| `/api/v1/flags`、`/api/v1/flags/:cc`、`/api/v1/flags/:cc/svg` | Go |
| `/api/v1/visitor-country` | Go |
| `/api/stats` | Go |
| `/api/v1/render` | Go（动态尺寸渲染） |
| `/:ratio/:w/:cc.:ext`（ratio 为 1x1 或 4x3） | Go |
| `/flags/:ratio/:cc.svg` | Go 或静态 |

## 开发

```bash
make install
make dev
```

Vite dev server（:3000）将 `/api/*`、`/1x1/*`、`/4x3/*`、`/flags/1x1|4x3/*` 代理到 Go（默认 `http://127.0.0.1:8080`）。

## 生产

```bash
make build
# 部署 apps/react/dist/ + flags/、1x1/、4x3/、css/；Nginx 反代 Go，见 deploy/nginx.conf.example
# SPA 需要将前端路由 fallback 到 index.html
```

`.env`（仓库根目录，勿提交）：

| 变量 | 用途 |
|------|------|
| `CLOUDFLARE_API_TOKEN` | `/api/stats` |
| `CLOUDFLARE_ZONE_ID` | `/api/stats` |
| `SITE_URL` | SEO 绝对 URL |
