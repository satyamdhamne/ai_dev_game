import type { CSSProperties } from "react";
import type { TokenLine } from "@/lib/types";

export function TokenText({ tokens }: { tokens: TokenLine }) {
  if (tokens.length === 0) return <>{" "}</>;
  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} className="tok" style={{ "--tc": t.color, "--td": t.dark } as CSSProperties}>
          {t.content}
        </span>
      ))}
    </>
  );
}

export const lineText = (tokens: TokenLine) => tokens.map((t) => t.content).join("");
