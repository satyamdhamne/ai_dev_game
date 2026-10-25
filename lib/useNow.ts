"use client";

import { useEffect, useState } from "react";

/** Re-renders every `intervalMs` while `active`, returning the current time. */
export function useNow(intervalMs = 1000, active = true): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const tick = () => setNow(Date.now());
    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, active]);
  return now;
}
