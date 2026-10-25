"use client";

import type { GuessResult, TokenLine } from "@/lib/types";
import { useRef, type KeyboardEvent } from "react";
import { lineText, TokenText } from "./TokenText";

export type LineMark = GuessResult | "reveal";

interface CodeBlockProps {
  lines: TokenLine[];
  fileName: string;
  marks: ReadonlyMap<number, LineMark>;
  selected: number | null;
  interactive: boolean;
  /** Bumped on every wrong guess to replay the shake animation. */
  shake: { line: number; key: number } | null;
  onSelect: (line: number) => void;
  onSubmit: (line: number) => void;
}

const MARK_LABEL: Record<LineMark, string> = {
  cold: "wrong guess, cold",
  warm: "wrong guess, warm",
  found: "the bug, found",
  reveal: "the bug",
};

export function CodeBlock({ lines, fileName, marks, selected, interactive, shake, onSelect, onSubmit }: CodeBlockProps) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const isSelectable = (n: number) =>
    interactive && n >= 1 && n <= lines.length && lineText(lines[n - 1]).trim() !== "" && !marks.has(n);

  const selectable = lines.map((_, i) => i + 1).filter(isSelectable);
  const focusTarget = selected !== null && isSelectable(selected) ? selected : (selectable[0] ?? null);

  const move = (n: number | undefined) => {
    if (n === undefined) return;
    onSelect(n);
    refs.current[n - 1]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>, n: number) => {
    if (!interactive) return;
    const pos = selectable.indexOf(n);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        move(pos === -1 ? selectable.find((s) => s > n) : selectable[pos + 1]);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(pos === -1 ? [...selectable].reverse().find((s) => s < n) : selectable[pos - 1]);
        break;
      case "Home":
        e.preventDefault();
        move(selectable[0]);
        break;
      case "End":
        e.preventDefault();
        move(selectable[selectable.length - 1]);
        break;
      case " ":
        e.preventDefault();
        if (isSelectable(n)) onSelect(n);
        break;
      case "Enter":
        e.preventDefault();
        if (isSelectable(n)) onSubmit(n);
        break;
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warm/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
        </span>
        <span className="ml-2 truncate font-mono text-xs text-muted">{fileName}</span>
      </div>
      <div
        role="listbox"
        aria-label={interactive ? "Code lines. Choose the line with the bug." : "Code"}
        aria-orientation="vertical"
        aria-disabled={!interactive}
        className="code overflow-x-auto py-2 font-mono text-[13px] leading-6 sm:text-[13.5px]"
      >
        <div className="w-max min-w-full">
          {lines.map((tokens, i) => {
            const n = i + 1;
            const text = lineText(tokens);
            const mark = marks.get(n);
            const canPick = isSelectable(n);
            const isSelected = selected === n && canPick;
            const shaking = shake?.line === n;
            const blank = text.trim() === "";
            return (
              <div
                key={shaking ? `${n}-${shake.key}` : n}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                role="option"
                aria-selected={isSelected}
                aria-disabled={!canPick}
                aria-label={`Line ${n}${blank ? ", blank" : `: ${text.trim()}`}${mark ? `, ${MARK_LABEL[mark]}` : ""}`}
                tabIndex={interactive && n === focusTarget ? 0 : -1}
                onClick={() => canPick && onSelect(n)}
                onKeyDown={(e) => onKeyDown(e, n)}
                className={[
                  "group relative flex items-center border-l-[3px] pr-4 outline-none transition-colors",
                  blank ? "min-h-5 sm:min-h-6" : "min-h-9 sm:min-h-7",
                  canPick ? "cursor-pointer hover:bg-surface-2" : "",
                  "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-select-ring",
                  isSelected ? "border-select-ring bg-select" : "",
                  mark === "cold" || mark === "warm" ? "border-danger bg-danger-soft" : "",
                  mark === "found" ? "animate-pop border-accent bg-accent-soft" : "",
                  mark === "reveal" ? "border-accent bg-accent-soft" : "",
                  !mark && !isSelected ? "border-transparent" : "",
                  shaking ? "animate-shake" : "",
                ].join(" ")}
              >
                <span
                  className={`w-11 shrink-0 select-none pr-3 text-right tabular-nums ${
                    mark === "found" || mark === "reveal"
                      ? "text-accent"
                      : mark
                        ? "text-danger"
                        : isSelected
                          ? "text-select-ring"
                          : "text-muted/60"
                  }`}
                  aria-hidden
                >
                  {mark === "found" || mark === "reveal" ? "✓" : mark ? "✕" : n}
                </span>
                <span className="whitespace-pre">
                  <TokenText tokens={tokens} />
                </span>
                {mark === "reveal" && (
                  <span className="ml-4 shrink-0 rounded bg-accent px-1.5 font-sans text-[11px] font-semibold text-accent-fg" aria-hidden>
                    ← the bug
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
