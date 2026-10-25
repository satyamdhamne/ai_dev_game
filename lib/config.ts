/** Day 1 of the game, as a calendar date in IST (YYYY-MM-DD). */
export const LAUNCH_DATE = "2026-10-25";

/** India Standard Time is a fixed UTC+05:30 offset (no DST). */
export const IST_OFFSET_MINUTES = 5 * 60 + 30;

export const MAX_ATTEMPTS = 3;
/** A miss within this many lines of the bug counts as "warm". */
export const WARM_DISTANCE = 2;
export const BUG_TYPE_CHOICES = 4;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://spottheaibug.com";
export const SITE_DOMAIN = "spottheaibug.com";
export const SITE_NAME = "Spot the AI Bug";
export const TAGLINE = "AI writes your code. Can you catch its bugs?";

export const AUTHOR_NAME = "[NAME]";
export const AUTHOR_X_URL = "https://x.com/yourhandle";
