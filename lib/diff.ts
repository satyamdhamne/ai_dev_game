export type DiffKind = "ctx" | "del" | "add";

export interface DiffOp {
  kind: DiffKind;
  /** 0-based index into the old lines (ctx/del) */
  oldIndex?: number;
  /** 0-based index into the new lines (ctx/add) */
  newIndex?: number;
}

export type DiffRow = DiffOp | { kind: "gap" };

/**
 * `fixedCode` may be the whole corrected snippet or just the replacement for
 * the bug line. Normalize to a full corrected snippet.
 */
export function resolveFixedLines(codeLines: string[], fixedLines: string[], bugLine: number): string[] {
  const isFragment = fixedLines.length < Math.ceil(codeLines.length / 2);
  if (!isFragment) return fixedLines;
  return [...codeLines.slice(0, bugLine - 1), ...fixedLines, ...codeLines.slice(bugLine)];
}

/** Line-level LCS diff. Snippets are tiny, so O(n*m) is fine. */
export function diffLines(a: string[], b: string[]): DiffOp[] {
  const n = a.length;
  const m = b.length;
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ kind: "ctx", oldIndex: i++, newIndex: j++ });
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      ops.push({ kind: "del", oldIndex: i++ });
    } else {
      ops.push({ kind: "add", newIndex: j++ });
    }
  }
  while (i < n) ops.push({ kind: "del", oldIndex: i++ });
  while (j < m) ops.push({ kind: "add", newIndex: j++ });
  return ops;
}

/** Keeps only changed lines plus `context` lines around them, with gap markers. */
export function toHunks(ops: DiffOp[], context = 2): DiffRow[] {
  const keep = new Array<boolean>(ops.length).fill(false);
  ops.forEach((op, idx) => {
    if (op.kind === "ctx") return;
    for (let k = Math.max(0, idx - context); k <= Math.min(ops.length - 1, idx + context); k++) keep[k] = true;
  });
  const rows: DiffRow[] = [];
  let skipped = false;
  ops.forEach((op, idx) => {
    if (keep[idx]) {
      if (skipped && rows.length > 0) rows.push({ kind: "gap" });
      skipped = false;
      rows.push(op);
    } else {
      skipped = true;
    }
  });
  return rows;
}
