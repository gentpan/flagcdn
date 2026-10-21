import { SITE_URL } from "../config";
import type { Ratio, RasterFormat } from "../types/flag";

export function rasterUrl(ratio: Ratio, w: number, cc: string, fmt: RasterFormat) {
  return `/${ratio}/${w}/${encodeURIComponent(cc)}.${fmt}`;
}

export function svgUrl(ratio: Ratio, cc: string) {
  return `/flags/${ratio}/${encodeURIComponent(cc)}.svg`;
}

export function absolute(path: string) {
  return SITE_URL + path;
}
