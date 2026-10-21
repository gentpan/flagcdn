import { useEffect, useState } from "react";
import { formatCompact } from "../utils/format";

export function useNavStats() {
  const [requestCount, setRequestCount] = useState("-");
  const githubStars = "";

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats")
      .then((res) => res.json() as Promise<{ requests?: number }>)
      .then((data) => {
        if (!cancelled && typeof data.requests === "number") {
          setRequestCount(formatCompact(data.requests));
        }
      })
      .catch(() => {
        /* keep dash */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { requestCount, githubStars };
}
