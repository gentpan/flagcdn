export function useCopy() {
  const toast = useState<string | null>("copy-toast", () => null);
  let timer: ReturnType<typeof setTimeout> | null = null;

  async function copyText(text: string, message = "Copied") {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      toast.value = message;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { toast.value = null; }, 1600);
      return true;
    } catch {
      return false;
    }
  }

  return { toast, copyText };
}
