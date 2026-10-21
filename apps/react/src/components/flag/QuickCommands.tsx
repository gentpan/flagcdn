import { useRef, useState } from "react";
import type { Ratio } from "../../types/flag";
import { absolute, rasterUrl, svgUrl } from "../../hooks/useRaster";
import { useCopy } from "../../hooks/useCopy";

const stripProto = (url: string) => url.replace(/^https?:\/\//, "");

export function QuickCommands({ cc, ratio }: { cc: string; ratio: Ratio }) {
  const { copyText } = useCopy();
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const cssFull = `<link rel="stylesheet" href="${absolute("/css/flag-icons.min.css")}" />`;
  const cdnFull = absolute(svgUrl(ratio, cc));
  const imgFull = absolute(rasterUrl(ratio, 64, cc, "png"));

  async function copy(key: string, text: string) {
    await copyText(text);
    setCopied(key);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1500);
  }

  const rows = [
    { key: "css", tagClass: "ts-cmds__tag--css", label: "CSS", short: stripProto(cssFull), full: cssFull },
    { key: "cdn", tagClass: "ts-cmds__tag--cdn", label: "CDN", short: stripProto(cdnFull), full: cdnFull },
    { key: "img", tagClass: "ts-cmds__tag--img", label: "IMG", short: stripProto(imgFull), full: imgFull },
  ];

  return (
    <div className="ts-cmds">
      {rows.map((row) => (
        <div key={row.key} className="ts-cmds__row squircle">
          <span className={`ts-cmds__tag ${row.tagClass}`}>{row.label}</span>
          <code className="ts-cmds__code">{row.short}</code>
          <button type="button" className="ts-cmds__copy squircle" onClick={() => copy(row.key, row.full)}>
            <i className={copied === row.key ? "fa-solid fa-check" : "fa-regular fa-copy"} />
          </button>
        </div>
      ))}
    </div>
  );
}
