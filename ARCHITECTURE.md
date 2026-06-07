# FlagCDN.io v2 — Nuxt + Go

## 配色：Ocean Slate（海洋蓝 + 中性灰）

| Token | 值 | 用途 |
|-------|-----|------|
| `--brand` | `#1D6FA8` | 主色、CTA、链接 |
| `--brand-light` | `#3B93D0` | Logo `.io`、高亮 |
| `--bg-page` | `#F4F6F9` | 页面背景 |
| `--nav-dark` | `#14141F` | 浮动导航（同 cleanip） |
| `--text-heading` | `#0F172A` | 标题 |
| `--text-body` | `#64748B` | 正文 |

**为何选蓝而非绿/纯灰：**
- 绿已被 cleanip.io 占用，需品牌区隔
- 纯灰（thesvg 风）会让页面缺识别度；蓝表达 CDN/全球/信任，国旗本身提供色彩

## 开发

```bash
# 安装前端依赖
make install

# 启动 Go API (:8080) + Nuxt (:3000)
make dev

# 批量生成栅格图
make rastergen
make raster-verify
```

## 目录

```
apps/web/          Nuxt 3 + TS 前端
cmd/api/           Go HTTP 服务（flags API + /i/ 栅格）
cmd/rastergen/     离线批量生成
internal/          Go 共享库
flags/             SVG 源
raster/            预生成 PNG/WebP/AVIF
data/country.json  国家元数据
css/flag-icons.min.css  对外嵌入 API（保留）
```

## 生产部署建议

- Nginx：静态 `/flags/`、`/raster/`、`/css/` 直出
- Go `flagcdn-api` 处理 `/api/v1/*` 与 `/i/*` fallback 渲染
- Nuxt SSR：`node apps/web/.output/server/index.mjs` 或使用 `nuxt build` + Nitro

**生产站点 = Nuxt 静态输出 + Go API + 静态资源**（`flags/`、`raster/`、`css/`）。仓库无 PHP。

## 目标

对标 [thesvg.org](https://thesvg.org) 的「每图标独立详情页 + 多格式导出」体验，结合 cleanip.io 的极简 SaaS 视觉，做成独立的国旗图标 CDN 产品。

---

## 资源分层（CSS 策略）

| 层 | 文件 | 职责 | 是否保留 |
|----|------|------|----------|
| **嵌入 API** | `css/flag-icons.min.css` | 仅 SVG：`fi fi-cn` / `fis` 1:1 / `fib` 背景图 | **保留不动**（对外兼容 lipis 用法） |
| **站点 UI** | `assets/main.css` | 导航、首页、详情页、暗色主题 | **继续用**，不必拆成多个 |
| **栅格资源** | `raster/{ratio}/{size}/{cc}.{ext}` | PNG / WebP / AVIF 静态文件 | **不走 CSS** |

**结论：不要**为每种格式/尺寸写 CSS。栅格图用 URL 引用：

```
/i/1x1/64/cn.png
/i/4x3/128/cn.webp
/flags/1x1/cn.svg          ← SVG 源文件
/css/flag-icons.min.css    ← 类名嵌入
```

---

## 目录与 URL

```
flags/1x1/cn.svg              # 源 SVG
flags/4x3/cn.svg
raster/1x1/64/cn.png          # 预生成栅格
raster/4x3/256/cn.avif
```

公开 URL（Apache `.htaccess`）：

```
/i/1x1/64/cn.png   →  raster/1x1/64/cn.png
```

预设尺寸：`16, 24, 32, 48, 64, 128, 256, 512`  
自定义尺寸走 Go `GET /api/v1/render?ratio=&cc=&w=&fmt=` 即时渲染并落盘。

---

## 批量生成

```bash
# 全量（约 271×2×8×3 = 13,008 文件）
go run ./cmd/rastergen -workers 12

# 校验
go run ./cmd/rastergen -verify

# 指定国家测试
go run ./cmd/rastergen -codes cn,us,jp
```

依赖系统工具：`rsvg-convert`、`cwebp`、`avifenc`。

---

## 技术栈演进路线

### 当前栈（已完成）

- Nuxt 3 预渲染首页、列表、文档、changelog、271+ 国旗详情页
- Go `cmd/api`：`/api/v1/*`、`/api/stats`、`/i/*` 栅格
- `cmd/rastergen` 离线批量生成 `raster/`
- Cloudflare CDN 边缘缓存

### 可选演进

- npm 包 `@flagcdn/icons`（类似 `thesvg`）
- CLI：`npx flagcdn add cn`
- Open Graph 每国自动图：`/og/flag/cn.png`

---

## 详情页设计（对标 thesvg.org）

```
┌─────────────────────────────────────────────────────┐
│  [左侧] 大预览 + 元数据    │  [右侧] 代码 Tab        │
│  CN · China · Asia        │  SVG | HTML | CDN URL   │
│  ISO 3166-1                 │  ─────────────────    │
│                             │  <svg>…</svg>  [Copy]   │
├─────────────────────────────┴───────────────────────┤
│  Export — 1×1 / 4×3  ×  PNG WebP AVIF  ×  尺寸卡片  │
│  [32] [64] [128] [256] [512]  每格预览 + 下载        │
└─────────────────────────────────────────────────────┘
```

---

## 首页（cleanip 风格）

- 浮动深色胶囊导航 `floating-nav`（1000px 宽）
- Hero 居中 + 大水印 `flagcdn`
- 主搜索框置于 Hero（已改）
- 页脚大水印（已改）

---

## 部署清单

1. 本地 `go run ./cmd/rastergen` 生成 `raster/`
2. `rsync` 到生产（含 `raster/`、`flags/`）
3. Nginx 反代 Go API（见 `deploy/nginx.conf.example`）
4. `rsync` Nuxt `apps/web/.output/public/` 到站点根

---

## 下一步建议（优先级）

1. ✅ 新路径 + `rastergen` + `/i/` URL
2. ⏳ 跑完全量 `rastergen`（生产机或 CI）
3. ⏳ 详情页 UI 改成 thesvg 双栏 + Export 卡片网格
4. ⏳ 初始化 Nuxt `apps/web`，先 SSG `/flag/[cc]`
5. ✅ Go `cmd/api` 承担全部栅格与 JSON API
