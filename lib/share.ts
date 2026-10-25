import { MAX_ATTEMPTS, SITE_DOMAIN, SITE_NAME } from "./config";
import { formatDuration, type GameState } from "./game";
import type { GuessResult } from "./types";

const SQUARES: Record<GuessResult, string> = { cold: "🟥", warm: "🟨", found: "🟩" };
const UNUSED = "⬛";

export function buildShareText(state: GameState, correctBugType: string, seconds: number, streak: number): string {
  const squares = state.guesses.map((g) => SQUARES[g.result]);
  while (squares.length < MAX_ATTEMPTS) squares.push(UNUSED);

  const used = state.guesses.length;
  const hunt = state.outcome === "won" ? `found in ${used}/${MAX_ATTEMPTS}` : `missed X/${MAX_ATTEMPTS}`;
  const bugType =
    state.bugTypeGuess === null ? "➖" : state.bugTypeGuess === correctBugType ? "✅" : "❌";

  return [
    `${SITE_NAME} — Day ${state.day} 🐛`,
    `${squares.join("")}  ${hunt}`,
    `🧠 Bug type: ${bugType}`,
    `⏱️ ${formatDuration(seconds)}  🔥 Streak: ${streak}`,
    SITE_DOMAIN,
  ].join("\n");
}
