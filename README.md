<div align="center">

# FlagCDN.io

**免费 SVG 国旗图标 CDN — 基于 lipis/flag-icons，提供官方 CSS 类名和 SVG 直链**

<p>
  <img src="https://img.shields.io/badge/PHP-8.4+-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
  <img src="https://img.shields.io/badge/license-MIT-brightgreen?style=for-the-badge" alt="License">
</p>

<p>
  <a href="https://flagcdn.io">flagcdn.io</a> · <a href="https://flagcdn.io/docs/">使用文档</a>
</p>

</div>

---

## 概述

FlagCDN.io 提供基于 ISO 3166-1 alpha-2 国家代码的 SVG 国旗图标。所有国旗都规整成 4:3 和 1:1 两种比例，可通过 CSS 类名内联，也可直接通过 URL 引用 SVG 文件。

底层数据来自 [lipis/flag-icons](https://github.com/lipis/flag-icons)（MIT 许可），FlagCDN.io 在其基础上提供 CDN 分发、可视化文档和多语言支持。

---

## 使用方式

### 1) CSS 类名（推荐）

```html
<link rel="stylesheet" href="https://flagcdn.io/css/flag-icons.min.css" />

<span class="fi fi-cn"></span>      <!-- 中国，4:3 默认 -->
<span class="fi fi-us fis"></span>  <!-- 美国，1:1（fis = squared） -->
<span class="fi fi-gb fib" style="width:32px;height:24px;display:inline-block;"></span>
```

类名规则：`fi fi-{ISO 代码小写}`，可选修饰符：

| 修饰符 | 比例 | 说明 |
|---|---|---|
| 无 | 4:3 | 默认矩形 |
| `fis` | 1:1 | 正方形 |
| `fib` | 4:3 背景图 | 适合自定义宽高 |

### 2) SVG 直链

```html
<!-- 4:3 -->
<img src="https://flagcdn.io/flags/4x3/cn.svg" alt="中国">

<!-- 1:1 -->
<img src="https://flagcdn.io/flags/1x1/cn.svg" alt="中国">

<!-- 短链（自动映射到 4:3） -->
<img src="https://flagcdn.io/cn.svg" alt="中国">
```

所有 SVG 都包含 `Access-Control-Allow-Origin: *` 响应头，可直接跨域使用。

---

## 技术栈

- **后端**：PHP 8.4+（FastCGI），用作多语言渲染和 stats API
- **CDN**：Cloudflare 橙云代理，CDN 边缘缓存 30 天
- **数据**：lipis/flag-icons 同步，4:3 与 1:1 SVG 全套
- **样式**：flag-icons.min.css（合并压缩）

---

## License

MIT — 项目本身。底层国旗素材来自 [lipis/flag-icons](https://github.com/lipis/flag-icons)（同样 MIT）。
