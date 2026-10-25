"use client";

import { useSyncExternalStore } from "react";
import { KEYS, writeString } from "@/lib/storage";
import { MoonIcon, SunIcon } from "./icons";

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const isDark = () => document.documentElement.classList.contains("dark");

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => true);

  const toggle = () => {
    const next = !isDark();
    document.documentElement.classList.toggle("dark", next);
    writeString(KEYS.theme, next ? "dark" : "light");
    listeners.forEach((l) => l());
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="rounded-lg p-2 text-muted transition hover:bg-surface-2 hover:text-fg focus-visible:outline-2 focus-visible:outline-select-ring"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

