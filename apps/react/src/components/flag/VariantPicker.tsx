import { RATIOS, type Ratio } from "../../types/flag";
import { svgUrl } from "../../hooks/useRaster";

export function VariantPicker({ cc, value, onChange }: { cc: string; value: Ratio; onChange: (r: Ratio) => void }) {
  return (
    <div className="ts-variants">
      <p className="detail-label">Aspect ratio</p>
      <div className="ts-variants__grid">
        {RATIOS.map((r) => (
          <button
            key={r}
            type="button"
            className={`ts-variants__item squircle${value === r ? " is-active" : ""}`}
            onClick={() => onChange(r)}
          >
            <div className="ts-variants__thumb squircle icon-preview-bg">
              <img
                src={svgUrl(r, cc)}
                alt={r}
                className={`ts-variants__img ${r === "1x1" ? "is-square" : "is-wide"}`}
              />
            </div>
            <span className="ts-variants__label">{r}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
