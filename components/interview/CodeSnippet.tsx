import { highlightCached } from "@/lib/highlight";
import type { Language } from "@/lib/types";
import { TokenText } from "../TokenText";

/** Static, server-highlighted code block with line numbers. */
export async function CodeSnippet({ code, language, label }: { code: string; language: Language; label?: string }) {
  const lines = await highlightCached(code, language);
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-bg">
      {label && <figcaption className="border-b border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-muted">{label}</figcaption>}
      <pre className="code overflow-x-auto py-2 font-mono text-[12.5px] leading-6 sm:text-[13px]">
        <code className="numbered block w-max min-w-full">
          {lines.map((tokens, i) => (
            <span key={i} className="ln">
              <TokenText tokens={tokens} />
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
