<div align="center">

# flagcdn.io

**免费 SVG 国旗图标 CDN — 开源全栈，支持 CSS 类名、SVG 直链与多格式栅格导出**

<p>
  <a href="https://github.com/gentpan/flagcdn"><img src="https://img.shields.io/github/stars/gentpan/flagcdn?style=flat-square" alt="GitHub stars"></a>
  <img src="https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/Nuxt-3-00DC82?style=flat-square&logo=nuxt.js&logoColor=white" alt="Nuxt">
  <img src="https://img.shields.io/badge/Go-1.22+-00ADD8?style=flat-square&logo=go&logoColor=white" alt="Go">
</p>

<p>
  <a href="https://flagcdn.io">flagcdn.io</a> ·
  <a href="https://flagcdn.io/docs">Docs</a> ·
  <a href="https://github.com/gentpan/flagcdn/issues">Issues</a>
</p>

</div>

---

## 概述

[flagcdn.io](https://flagcdn.io) 提供基于 ISO 3166-1 alpha-2 的 SVG 国旗图标，规整为 **4:3** 与 **1:1** 两种比例。可通过 CSS 类名内联，也可直接 URL 引用 SVG / PNG / WebP / AVIF。

本仓库为**完整源站开源项目**（前端、API、栅格生成、部署配置），欢迎 Star 与 PR。

- **本仓库**：<https://github.com/gentpan/flagcdn>
- **国旗素材来源**：[lipis/flag-icons](https://github.com/lipis/flag-icons)（MIT，已在 `flags/` 目录同步并扩展）

---

## 仓库结构

```
apps/web/           Nuxt 3 前端（首页、详情页、文档、SSG）
apps/php/           当前线上 PHP 站点（页面、下载计数、反馈、统计）
cmd/api/            Go HTTP API（/api/v1、/1x1 与 /4x3 栅格）
cmd/rastergen/      离线批量生成 PNG/WebP/AVIF
flags/              SVG 源文件
1x1/、4x3/          预生成栅格（gitignore，本地生成）
data/country.json   国家元数据
css/                flag-icons.min.css（对外嵌入）
```

**当前线上站点使用 PHP + FrankenPHP/Caddy**，完整源码在 `apps/php/`，部署步骤见 **[apps/php/README.md](./apps/php/README.md)**。

仓库同时保留 Nuxt 3 前端 + Go 后端版本，架构说明见 **[docs/STACK.md](./docs/STACK.md)**。下方构建命令用于 Nuxt + Go 版本。

---

## 快速开始

```bash
# 安装依赖
make install

# 本地预览（推荐）：Go API :8080 + Nuxt preview :3000
make dev

# 构建可部署的静态站（含全部国旗详情页 SSG）
make build-static

# 将构建产物合并到站点根目录（示例）
rsync -a apps/web/.output/public/ ./site-dist/
# 再把 site-dist/ 与 flags/、1x1/、4x3/、css/ 等一并上传到服务器

# 批量生成栅格图
make rastergen
make raster-verify
```

环境变量（可选）：

| 变量 | 说明 |
|------|------|
| `SITE_URL` | 站点 URL，默认 `https://flagcdn.io` |
| `NUXT_PUBLIC_GITHUB_REPO` | GitHub 仓库，默认 `gentpan/flagcdn` |

---

## 使用方式

完整素材包与各格式下载见 [GitHub Releases](https://github.com/gentpan/flagcdn/releases) 或 [站点首页](https://flagcdn.io)。包含 543 个 SVG，以及 16–512px 八种尺寸的 PNG、WebP、AVIF，共 13,032 张栅格图。可用 `python3 scripts/build-flag-assets.py` 重新生成。

### CSS 类名

```html
<link rel="stylesheet" href="https://flagcdn.io/css/flag-icons.min.css" />
<span class="fi fi-cn"></span>
<span class="fi fi-us fis"></span>
```

默认使用 SVG。需要栅格图片时，将样式表换为 `flag-icons-png.min.css`、`flag-icons-webp.min.css` 或 `flag-icons-avif.min.css`，类名不变。三个版本从同一份 SVG CSS 自动生成，使用 64px 图片及 128px 高像素密度版本。文档页可一键复制各版本的引入代码。

### SVG / 栅格直链

```html
<img src="https://flagcdn.io/flags/4x3/cn.svg" alt="China">
<img src="https://flagcdn.io/4x3/64/cn.png" alt="China">
```

首页可选择 SVG、PNG、WebP、AVIF 及 16–512px 宽度，再复制对应图片地址或 HTML。所有栅格格式采用无损编码，打包前使用 `python3 scripts/validate-flag-images.py --require-lossless` 对全部 13,032 张图片与 SVG 重新渲染结果做逐像素校验，包含透明通道。

完整文档见 <https://flagcdn.io/docs>。

---

## 贡献

1. Fork <https://github.com/gentpan/flagcdn>
2. 创建分支并提交 PR
3. Bug / 旗帜纠错 / 功能建议请开 [GitHub Issues](https://github.com/gentpan/flagcdn/issues)

---

## License

MIT — 本项目代码与文档。

国旗 SVG 素材来自 [lipis/flag-icons](https://github.com/lipis/flag-icons)（MIT），请保留上游署名。
