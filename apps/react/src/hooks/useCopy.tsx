import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

interface CopyContextValue {
  toast: string | null;
  copyText: (text: string, message?: string) => Promise<boolean>;
}

const CopyContext = createContext<CopyContextValue | null>(null);

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

export function CopyProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyText = useCallback(async (text: string, message = "Copied") => {
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
      setToast(message);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setToast(null), 2200);
      return true;
    } catch {
      return false;
    }
  }, []);

  return <CopyContext.Provider value={{ toast, copyText }}>{children}</CopyContext.Provider>;
}

export function useCopy() {
  const ctx = useContext(CopyContext);
  if (!ctx) throw new Error("useCopy must be used within CopyProvider");
  return ctx;
}
