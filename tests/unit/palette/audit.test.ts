import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { APPROVED_COLORS, APPROVED_HEX } from "@/lib/tokens";

const SKIPPED_DIRS = new Set([
  "node_modules",
  ".next",
  "docs",
  ".git",
  ".worktrees",
]);

function walkMatching(
  dir: string,
  pattern: RegExp,
  acc: string[] = [],
): string[] {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    if (SKIPPED_DIRS.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkMatching(p, pattern, acc);
    else if (pattern.test(name)) acc.push(p);
  }
  return acc;
}

function walk(dir: string, acc: string[] = []): string[] {
  return walkMatching(dir, /\.(css|tsx|ts|jsx|js|svg)$/, acc);
}

test("source and svg files only use approved hex colors (or CSS variables)", () => {
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

test("tokens export APPROVED_COLORS and APPROVED_HEX for the locked palette", () => {
  expect(APPROVED_COLORS).toEqual({
    navy: "#0C2340",
    gold: "#B08D57",
    neutral: "#F6F6F6",
    white: "#FFFFFF",
  });
  expect([...APPROVED_HEX]).toEqual([
    "#0C2340",
    "#B08D57",
    "#F6F6F6",
    "#FFFFFF",
  ]);
});

test("globals.css and layout wire loaded Next font CSS variables into active typography", () => {
  const globalsCss = readFileSync(
    join(process.cwd(), "app", "globals.css"),
    "utf8",
  );
  const layoutTsx = readFileSync(
    join(process.cwd(), "app", "layout.tsx"),
    "utf8",
  );

  expect(globalsCss).toMatch(/--font-sans:.*var\(--font-sans-loaded/);
  expect(globalsCss).toMatch(/--font-display:.*var\(--font-display-loaded/);
  expect(globalsCss).toContain("font-family: var(--font-sans)");
  expect(globalsCss).toContain("font-family: var(--font-display)");
  expect(layoutTsx).toContain('variable: "--font-sans-loaded"');
  expect(layoutTsx).toContain('variable: "--font-display-loaded"');
  expect(layoutTsx).toMatch(/className=\{`.*\$\{sourceSans\.variable\}.*\$\{libreFranklin\.variable\}.*`\}/);
});

test("no binary .ico icon files exist under app/ or public/ (icons must be palette-audited SVG)", () => {
  const root = join(process.cwd());
  const icoFiles = [
    ...walkMatching(join(root, "app"), /\.ico$/i),
    ...walkMatching(join(root, "public"), /\.ico$/i),
  ];
  expect(icoFiles).toEqual([]);
  expect(existsSync(join(root, "app", "icon.svg"))).toBe(true);
});
