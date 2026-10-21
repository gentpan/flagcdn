import { useRef, useState } from "react";
import { useCopy } from "../../hooks/useCopy";
import { useSiteI18n } from "../../hooks/useSiteI18n";

export function DocsCopyBlock({ text }: { text: string }) {
  const { copyText } = useCopy();
  const { t } = useSiteI18n();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function onCopy() {
    const ok = await copyText(text, t("toast.copied"));
    if (!ok) return;
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="docs-code squircle">
      <pre className="docs-code__pre">
        <code>{text}</code>
      </pre>
      <button
        type="button"
        className={`docs-code__btn squircle${copied ? " is-copied" : ""}`}
        aria-label={copied ? "Copied" : "Copy"}
        onClick={onCopy}
      >
        <i className={copied ? "fa-solid fa-check" : "fa-regular fa-copy"} aria-hidden="true" />
      </button>
    </div>
  );
}
