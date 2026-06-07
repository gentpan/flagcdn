import type { Ratio, RasterFormat } from "~/types/flag";

export function useRaster() {
  const config = useRuntimeConfig();

  function rasterUrl(ratio: Ratio, w: number, cc: string, fmt: RasterFormat) {
    return `/i/${ratio}/${w}/${encodeURIComponent(cc)}.${fmt}`;
  }

  /** 页面内展示、预览一律走 SVG */
  function svgUrl(ratio: Ratio, cc: string) {
    return `/flags/${ratio}/${encodeURIComponent(cc)}.svg`;
  }

  /** 导出 / 下载 / 复制热链用栅格格式 */
  function exportUrl(ratio: Ratio, w: number, cc: string, fmt: RasterFormat) {
    return rasterUrl(ratio, w, cc, fmt);
  }

  function absolute(path: string) {
    const base = config.public.siteUrl.replace(/\/$/, "");
    return base + path;
  }

  function height(ratio: Ratio, w: number) {
    return ratio === "1x1" ? w : Math.round((w * 3) / 4);
  }

  function sizeLabel(ratio: Ratio, w: number) {
    const h = height(ratio, w);
    return ratio === "1x1" ? `${w}×${w}` : `${w}×${h}`;
  }

  return { rasterUrl, exportUrl, svgUrl, absolute, height, sizeLabel };
}
