import type { DiffRowView } from "@/lib/types";
import { TokenText } from "./TokenText";

export function DiffView({ rows }: { rows: DiffRowView[] }) {
  return (
    <div className="code overflow-x-auto rounded-xl border border-border bg-bg py-2 font-mono text-[12.5px] leading-6">
      <div className="w-max min-w-full">
        {rows.map((row, i) => {
          if (row.kind === "gap") {
            return (
              <div key={i} className="select-none px-4 text-muted/60" aria-hidden>
                ⋯
              </div>
            );
          }
          const sign = row.kind === "del" ? "-" : row.kind === "add" ? "+" : " ";
          return (
            <div
              key={i}
              className={`flex pr-4 ${
                row.kind === "del" ? "bg-danger-soft" : row.kind === "add" ? "bg-accent-soft" : ""
              }`}
            >
              <span className="w-9 shrink-0 select-none pr-2 text-right tabular-nums text-muted/60" aria-hidden>
                {row.kind === "del" ? row.oldNo : row.newNo}
              </span>
              <span
                className={`w-5 shrink-0 select-none text-center ${
                  row.kind === "del" ? "text-danger" : row.kind === "add" ? "text-accent" : "text-muted/40"
                }`}
              >
                <span className="sr-only">{row.kind === "del" ? "removed" : row.kind === "add" ? "added" : ""}</span>
                <span aria-hidden>{sign}</span>
              </span>
              <span className="whitespace-pre">
                <TokenText tokens={row.tokens} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
