"use client";

import { getDayNumber } from "@/lib/day";
import { KEYS, readString, writeString } from "@/lib/storage";
import { useHydrated } from "@/lib/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { HowToPlayContent } from "./HowToPlayContent";
import { ChartIcon, HelpIcon } from "./icons";
import { Modal } from "./Modal";
import { StatsModal } from "./StatsModal";
import { ThemeToggle } from "./ThemeToggle";

interface ShellContext {
  openStats: () => void;
  openHelp: () => void;
}

const Ctx = createContext<ShellContext>({ openStats: () => {}, openHelp: () => {} });
export const useShell = () => useContext(Ctx);

export function AppShell({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<"stats" | "help" | null>(null);
  const pathname = usePathname();
  const hydrated = useHydrated();

  // First visit: show the rules once.
  useEffect(() => {
    if (pathname === "/how-to-play") return;
    if (readString(KEYS.seenHowTo)) return;
    writeString(KEYS.seenHowTo, "1");
    const id = window.setTimeout(() => setModal("help"), 250);
    return () => window.clearTimeout(id);
  }, [pathname]);

  const ctx: ShellContext = { openStats: () => setModal("stats"), openHelp: () => setModal("help") };

  return (
    <Ctx.Provider value={ctx}>
      <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link href="/" className="group flex items-center gap-2 font-mono text-[15px] font-semibold tracking-tight" aria-label="Spot the AI Bug home">
            <span className="text-accent" aria-hidden>
              &gt;
            </span>
            <span>
              spot_the<span className="text-accent">_ai_</span>bug
            </span>
            <span className="h-4 w-2 animate-blink bg-accent" aria-hidden />
          </Link>
          <nav className="flex items-center gap-0.5" aria-label="Game menu">
            <IconButton label="How to play" onClick={ctx.openHelp}>
              <HelpIcon />
            </IconButton>
            <IconButton label="Statistics" onClick={ctx.openStats}>
              <ChartIcon />
            </IconButton>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {children}

      <Modal open={modal === "help"} onClose={() => setModal(null)} title="How to play">
        <HowToPlayContent />
        <button
          type="button"
          onClick={() => setModal(null)}
          className="mt-6 min-h-11 w-full rounded-xl bg-accent font-semibold text-accent-fg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-select-ring"
        >
          Let&apos;s hunt
        </button>
      </Modal>
      <StatsModal open={modal === "stats"} onClose={() => setModal(null)} today={hydrated ? getDayNumber() : null} />
    </Ctx.Provider>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-lg p-2 text-muted transition hover:bg-surface-2 hover:text-fg focus-visible:outline-2 focus-visible:outline-select-ring"
    >
      {children}
    </button>
  );
}
