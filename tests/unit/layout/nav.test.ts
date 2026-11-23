import { readFileSync } from "node:fs";
import { join } from "node:path";

import { NAV_ITEMS } from "@/lib/constants";

test("nav exposes all six destinations", () => {
  expect(NAV_ITEMS.map((item) => item.href)).toEqual([
    "/",
    "/sell",
    "/properties",
    "/remodeling",
    "/financing",
    "/contact",
  ]);
});

test("mobile navigation exposes an accessible disclosure", () => {
  const source = readFileSync(
    join(process.cwd(), "components/layout/MobileNavigation.tsx"),
    "utf8",
  );

  expect(source).toContain('aria-controls="mobile-navigation"');
  expect(source).toContain("aria-expanded={isOpen}");
  expect(source).toContain("NAV_ITEMS.map");
});

test("root layout wraps main content with the global shell", () => {
  const source = readFileSync(join(process.cwd(), "app/layout.tsx"), "utf8");

  expect(source).toMatch(
    /<SiteHeader\s*\/>[\s\S]*<main id="main">\{children\}<\/main>[\s\S]*<SiteFooter\s*\/>/,
  );
});
