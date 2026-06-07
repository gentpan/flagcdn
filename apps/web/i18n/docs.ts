import type { SiteLang } from "~/composables/useSiteI18n";

export const docsMessages: Record<SiteLang, Record<string, string>> = {
  en: {
    "docs.title": "Docs",
    "docs.heroSub": "How to include and use flag icons on flagcdn.io",
    "docs.section1Title": "1. Include CSS",
    "docs.section1Intro":
      'Add the stylesheet in your page <code class="docs-inline-code">&lt;head&gt;</code> (choose one):',
    "docs.section1Cdn": "This site CDN (recommended)",
    "docs.section2Title": "2. HTML usage",
    "docs.section2Intro":
      'Use the <code class="docs-inline-code">fi</code> and <code class="docs-inline-code">fi-xx</code> classes, where <code class="docs-inline-code">xx</code> is the ISO 3166-1-alpha-2 country code (lowercase).',
    "docs.section2AspectNote":
      "We provide two aspect ratios: 4:3 (default) and 1:1. Many other flag CDNs use SVGs with inconsistent or incorrect proportions; we normalize all flags to 4:3 for a cleaner, more consistent look.",
    "docs.section2_4x3": "4:3 aspect (default)",
    "docs.section2_1x1":
      '<strong>1:1 square</strong>: add <code class="docs-inline-code">fis</code> to the class.',
    "docs.exampleUs": "United States",
    "docs.section3Title": "3. As background image",
    "docs.section3Intro":
      'Use the <code class="docs-inline-code">fib</code> class when using the flag as a background, and set width/height or padding as needed.',
    "docs.section4Title": "4. Country codes",
    "docs.section4Intro": "On the homepage you can search and copy HTML for any flag. Common examples:",
    "docs.section4Line1":
      '<code class="docs-inline-code">cn</code> China · <code class="docs-inline-code">us</code> United States · <code class="docs-inline-code">gb</code> United Kingdom · <code class="docs-inline-code">jp</code> Japan',
    "docs.section4Line2":
      '<code class="docs-inline-code">de</code> Germany · <code class="docs-inline-code">fr</code> France · <code class="docs-inline-code">eu</code> European Union',
    "docs.section5Title": "5. Direct SVG URL",
    "docs.section5UrlIntro":
      'You can link to a flag SVG directly by using the explicit asset path. Use it in <code class="docs-inline-code">&lt;img src="..."&gt;</code> or as background-image.',
    "docs.section5ExplicitPath": "4:3 / 1:1 (explicit path)",
    "docs.section5ShortPath": "Short URL (4:3 default)",
    "docs.section6Title": "6. License and contact",
    "docs.section6Line1":
      'Icons are from <a href="https://github.com/lipis/flag-icons" target="_blank" rel="noopener">flag-icons</a>, MIT license.',
    "docs.section6Line2":
      'Site: <a href="https://flagcdn.io">flagcdn.io</a>. Source code: <a href="https://github.com/gentpan/flagcdn" target="_blank" rel="noopener">github.com/gentpan/flagcdn</a>. Questions or feedback: <a href="mailto:support@flagcdn.io">support@flagcdn.io</a>.',
    "toast.copied": "Copied",
  },
  zh: {
    "docs.title": "使用说明",
    "docs.heroSub": "flagcdn.io 国旗图标库的引入方式与用法",
    "docs.section1Title": "1. 引入 CSS",
    "docs.section1Intro":
      '在页面 <code class="docs-inline-code">&lt;head&gt;</code> 中引入样式表（二选一）：',
    "docs.section1Cdn": "本站 CDN（推荐）",
    "docs.section2Title": "2. HTML 用法",
    "docs.section2Intro":
      '使用 <code class="docs-inline-code">fi</code> 与 <code class="docs-inline-code">fi-xx</code> 两个 class，<code class="docs-inline-code">xx</code> 为 ISO 3166-1-alpha-2 国家代码（小写）。',
    "docs.section2AspectNote":
      "本站提供两种比例：4:3（默认）与 1:1。其他不少国旗 CDN 的 SVG 尺寸比例不统一或不符合规范，本站将全部统一为 4:3，视觉更一致、更易用。",
    "docs.section2_4x3": "4:3 比例（默认）",
    "docs.section2_1x1":
      '<strong>1:1 正方形</strong>：在 class 中增加 <code class="docs-inline-code">fis</code>。',
    "docs.exampleUs": "美国",
    "docs.section3Title": "3. 作为背景图",
    "docs.section3Intro":
      '需要将国旗作为背景时，使用 <code class="docs-inline-code">fib</code> 类，并自行设置宽高或 padding。',
    "docs.section4Title": "4. 国家代码",
    "docs.section4Intro": "首页可搜索并点击任意国旗复制对应 HTML。常用示例：",
    "docs.section4Line1":
      '<code class="docs-inline-code">cn</code> 中国 · <code class="docs-inline-code">us</code> 美国 · <code class="docs-inline-code">gb</code> 英国 · <code class="docs-inline-code">jp</code> 日本',
    "docs.section4Line2":
      '<code class="docs-inline-code">de</code> 德国 · <code class="docs-inline-code">fr</code> 法国 · <code class="docs-inline-code">eu</code> 欧盟',
    "docs.section5Title": "5. 直接访问 SVG 地址",
    "docs.section5UrlIntro":
      '可通过显式资源路径直接获取国旗 SVG。可用于 <code class="docs-inline-code">&lt;img src="..."&gt;</code> 或背景图。',
    "docs.section5ExplicitPath": "4:3 / 1:1（显式路径）",
    "docs.section5ShortPath": "短链接（默认 4:3）",
    "docs.section6Title": "6. 许可与联系",
    "docs.section6Line1":
      '图标基于 <a href="https://github.com/lipis/flag-icons" target="_blank" rel="noopener">flag-icons</a>，采用 MIT 许可。',
    "docs.section6Line2":
      '本站域名：<a href="https://flagcdn.io">flagcdn.io</a>。开源仓库：<a href="https://github.com/gentpan/flagcdn" target="_blank" rel="noopener">github.com/gentpan/flagcdn</a>。问题或建议请联系：<a href="mailto:support@flagcdn.io">support@flagcdn.io</a>。',
    "toast.copied": "复制成功",
  },
  ja: {},
  de: {},
  ru: {},
  ar: {},
};
