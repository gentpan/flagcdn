export interface Country {
  code: string;
  name: string;
  name_zh?: string;
  name_ja?: string;
  name_de?: string;
  name_ru?: string;
  name_ar?: string;
  capital?: string;
  continent?: string;
  iso: boolean;
  flag_1x1?: string;
  flag_4x3?: string;
}

export interface FlagDetailResponse {
  country: Country;
  related: Country[];
  svg: Record<"1x1" | "4x3", string>;
}

export type Ratio = "1x1" | "4x3";
export type RasterFormat = "png" | "webp" | "avif";
export type ExportFormat = RasterFormat | "svg";

export const RASTER_SIZES = [16, 24, 32, 48, 64, 128, 256, 512] as const;
export const RATIOS: Ratio[] = ["1x1", "4x3"];
export const RASTER_FORMATS: RasterFormat[] = ["png", "webp", "avif"];
