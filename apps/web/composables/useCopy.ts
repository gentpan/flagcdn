export function useCopy() {
  const toast = useState<string | null>("copy-toast", () => null);
  let timer: ReturnType<typeof setTimeout> | null = null;

  function fallbackCopy(text: string) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = typeof document.execCommand === "function" && document.execCommand("copy");
    document.body.removeChild(ta);
    if (!ok) throw new Error("copy failed");
  }

  async function copyText(text: string, message = "Copied") {
    try {
      const clipboard = typeof navigator !== "undefined" ? navigator.clipboard : null;
      if (clipboard?.writeText) {
        try {
          await clipboard.writeText(text);
        } catch {
          fallbackCopy(text);
        }
      } else {
        fallbackCopy(text);
      }
      toast.value = message;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { toast.value = null; }, 2200);
      return true;
    } catch {
      return false;
    }
  }

  return { toast, copyText };
}
