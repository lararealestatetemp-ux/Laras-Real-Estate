import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { APPROVED_HEX } from "@/lib/tokens";

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "docs") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(css|tsx|ts|jsx|js)$/.test(name)) acc.push(p);
  }
  return acc;
}

test("source files only use approved hex colors (or CSS variables)", () => {
  const root = join(process.cwd());
  const files = walk(root);
  const hex = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
  const offenders: string[] = [];
  for (const file of files) {
    if (file.includes("tokens.ts") || file.includes("audit.test.ts")) continue;
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(hex)) {
      const value = match[0].toUpperCase();
      const normalized =
        value.length === 4
          ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
          : value;
      if (!APPROVED_HEX.has(normalized)) {
        offenders.push(`${file}: ${match[0]}`);
      }
    }
  }
  expect(offenders).toEqual([]);
});
