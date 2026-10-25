import { readFileSync } from "node:fs";
import { join } from "node:path";
import { validatePuzzles } from "../lib/validatePuzzles";

const file = join(__dirname, "..", "data", "puzzles.json");
let data: unknown;
try {
  data = JSON.parse(readFileSync(file, "utf8"));
} catch (e) {
  console.error(`✖ Could not parse ${file}: ${(e as Error).message}`);
  process.exit(1);
}

const { errors, warnings } = validatePuzzles(data);
for (const w of warnings) console.warn(`⚠ ${w}`);
for (const e of errors) console.error(`✖ ${e}`);

const count = Array.isArray(data) ? data.length : 0;
if (errors.length > 0) {
  console.error(`\n${errors.length} error(s) in ${count} puzzles.`);
  process.exit(1);
}
console.log(`✔ ${count} puzzles valid${warnings.length ? ` (${warnings.length} warning(s))` : ""}.`);
