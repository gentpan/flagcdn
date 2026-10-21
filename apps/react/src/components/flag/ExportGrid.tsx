import { useState } from "react";
import type { Ratio, RasterFormat } from "../../types/flag";
import { rasterUrl, svgUrl } from "../../hooks/useRaster";

const EXPORT_SIZES = [32, 64, 128, 256, 512] as const;
const formats = ["png", "webp", "avif", "svg"] as const;
type Format = (typeof formats)[number];

const sizes = EXPORT_SIZES.map((size) => ({
  size,
  display: Math.min(44, Math.max(12, Math.round(size * 0.09))),
}));

export function ExportGrid({ cc, ratio }: { cc: string; ratio: Ratio }) {
  const [fmt, setFmt] = useState<Format>("png");

  function previewH(item: { size: number; display: number }) {
    return ratio === "1x1" ? item.display : Math.round((item.display * 3) / 4);
  }

  function downloadUrl(size: number) {
    if (fmt === "svg") return svgUrl(ratio, cc);
    return rasterUrl(ratio, size, cc, fmt as RasterFormat);
  }

  function fileName(size: number) {
    if (fmt === "svg") return `${cc}_${ratio}.svg`;
    return `${cc}_${ratio}_${size}.${fmt}`;
  }

  return (
    <section className="ts-export">
      <div className="ts-export__head">
        <i className="fa-regular fa-image ts-export__icon" aria-hidden="true" />
        <p className="detail-label ts-export__label">Export {fmt.toUpperCase()}</p>
      </div>
      <div className="ts-export__formats">
        {formats.map((f) => (
          <button
            key={f}
            type="button"
            className={`ts-export__fmt squircle${fmt === f ? " is-active" : ""}`}
            onClick={() => setFmt(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="ts-export__grid">
        {sizes.map((item) => (
          <a key={item.size} href={downloadUrl(item.size)} download={fileName(item.size)} className="ts-export__card squircle">
            <div className="ts-export__preview squircle icon-preview-bg">
              <img
                src={svgUrl(ratio, cc)}
                alt={`${item.size}px`}
                style={{ width: `${item.display}px`, height: `${previewH(item)}px` }}
                loading="lazy"
              />
            </div>
            <div className="ts-export__meta">
              <i className="fa-solid fa-download" aria-hidden="true" />
              <span>{item.size}px</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
