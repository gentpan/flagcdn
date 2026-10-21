import { useState } from "react";
import type { Ratio } from "../../types/flag";
import { absolute, rasterUrl, svgUrl } from "../../hooks/useRaster";
import { useCopy } from "../../hooks/useCopy";

type TabId = "react" | "vue" | "html" | "next" | "css" | "svg" | "cdn" | "img";
type CodeTab = { id: TabId; label: string; icon?: string };

const useTabs: CodeTab[] = [
  { id: "react", label: "React", icon: "fa-brands fa-react" },
  { id: "vue", label: "Vue", icon: "fa-brands fa-vuejs" },
  { id: "html", label: "HTML", icon: "fa-brands fa-html5" },
  { id: "next", label: "Next.js", icon: "fa-solid fa-circle-half-stroke" },
  { id: "css", label: "CSS", icon: "fa-brands fa-css3-alt" },
];
const copyTabs: CodeTab[] = [
  { id: "svg", label: "SVG" },
  { id: "cdn", label: "CDN" },
  { id: "img", label: "IMG" },
];

export function CodePanel({
  cc,
  name,
  ratio,
  svg1x1,
  svg4x3,
}: {
  cc: string;
  name: string;
  ratio: Ratio;
  svg1x1: string;
  svg4x3: string;
}) {
  const [tab, setTab] = useState<TabId>("next");
  const [copied, setCopied] = useState(false);
  const { copyText } = useCopy();

  const rawSvg = ratio === "1x1" ? svg1x1 : svg4x3;
  const flagUrl = absolute(svgUrl(ratio, cc));
  const flagHeight = ratio === "1x1" ? 32 : 24;

  let displayCode: string;
  if (tab === "react") {
    displayCode = `export default function FlagIcon() {\n  return (\n    <img\n      src="${flagUrl}"\n      alt="${name} flag"\n      width={32}\n      height={${flagHeight}}\n    />\n  );\n}`;
  } else if (tab === "vue") {
    displayCode = `<template>\n  <img\n    src="${flagUrl}"\n    alt="${name} flag"\n    width="32"\n    height="${flagHeight}"\n  >\n</template>`;
  } else if (tab === "html") {
    displayCode = `<img src="${flagUrl}" alt="${name} flag" width="32" height="${flagHeight}" />`;
  } else if (tab === "next") {
    displayCode = `import Image from "next/image";\n\nexport default function FlagIcon() {\n  return (\n    <Image\n      src="${flagUrl}"\n      alt="${name} flag"\n      width={32}\n      height={${flagHeight}}\n      unoptimized\n    />\n  );\n}`;
  } else if (tab === "css") {
    displayCode = `<link rel="stylesheet" href="${absolute("/css/flag-icons.min.css")}" />\n<span class="fi fi-${cc}"></span>`;
  } else if (tab === "svg") {
    displayCode = rawSvg
      .replace(/>\s*</g, ">\n<")
      .replace(/\s{2,}/g, " ")
      .trim();
  } else if (tab === "cdn") {
    displayCode = absolute(svgUrl(ratio, cc));
  } else {
    displayCode = absolute(rasterUrl(ratio, 64, cc, "png"));
  }

  async function onCopy() {
    const text = tab === "svg" ? rawSvg.trim() : displayCode;
    await copyText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const renderTabs = (tabs: CodeTab[]) =>
    tabs.map((t) => (
      <button
        key={t.id}
        type="button"
        className={`ts-code__tab squircle${tab === t.id ? " is-active" : ""}`}
        onClick={() => setTab(t.id)}
      >
        {t.icon && <i className={t.icon} aria-hidden="true" />}
        <span>{t.label}</span>
      </button>
    ));

  return (
    <section className="ts-code squircle">
      <div className="ts-code__tabs">
        <div className="ts-code__group">{renderTabs(useTabs)}</div>
        <div className="ts-code__divider" />
        <div className="ts-code__group">{renderTabs(copyTabs)}</div>
      </div>
      <div className="ts-code__body">
        <button type="button" className="ts-code__copy squircle" onClick={onCopy}>
          <i className={copied ? "fa-solid fa-check" : "fa-regular fa-copy"} />
          {copied ? "Copied" : "Copy"}
        </button>
        <pre className="ts-code__pre">
          <code>{displayCode}</code>
        </pre>
      </div>
    </section>
  );
}
