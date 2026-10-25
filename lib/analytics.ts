import { track as vercelTrack } from "@vercel/analytics";

type Props = Record<string, string | number | boolean | null>;

export type AnalyticsEvent =
  | "puzzle_started"
  | "line_guessed"
  | "puzzle_solved"
  | "puzzle_failed"
  | "share_clicked"
  | "waitlist_submitted";

export function track(event: AnalyticsEvent, props?: Props): void {
  try {
    vercelTrack(event, props);
  } catch {
    // Analytics must never break the game.
  }
}
