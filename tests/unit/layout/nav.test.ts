import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { isCurrentPath } from "@/components/layout/NavLink";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
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

test("mobile navigation toggles disclosure aria-expanded and reveals all six links", async () => {
  const user = userEvent.setup();
  render(createElement(MobileNavigation));

  const nav = screen.getByRole("navigation", { name: "Mobile navigation" });
  const button = within(nav).getByRole("button", { name: "Menu" });

  expect(button).toHaveAttribute("aria-controls", "mobile-navigation");
  expect(button).toHaveAttribute("aria-expanded", "false");
  expect(within(nav).queryAllByRole("link")).toHaveLength(0);

  await user.click(button);

  expect(button).toHaveAttribute("aria-expanded", "true");
  const links = within(nav).getAllByRole("link");
  expect(links).toHaveLength(6);
  for (const link of links) {
    expect(link).toBeVisible();
  }
  expect(
    links.map((link) => ({
      label: link.textContent,
      href: link.getAttribute("href"),
    })),
  ).toEqual(
    NAV_ITEMS.map((item) => ({
      label: item.label,
      href: item.href,
    })),
  );

  await user.click(button);

  expect(button).toHaveAttribute("aria-expanded", "false");
  expect(within(nav).queryAllByRole("link")).toHaveLength(0);
});

test("root layout wraps main content with the global shell", () => {
  const source = readFileSync(join(process.cwd(), "app/layout.tsx"), "utf8");

  expect(source).toMatch(
    /<SiteHeader\s*\/>[\s\S]*<main id="main">\{children\}<\/main>[\s\S]*<SiteFooter\s*\/>/,
  );
});

test("mobile header keeps the phone CTA reachable outside the menu panel", () => {
  const source = readFileSync(
    join(process.cwd(), "components/layout/SiteHeader.tsx"),
    "utf8",
  );

  expect(source).toMatch(/className=\{styles\.mobilePhone\}[\s\S]*href=\{BUSINESS_PHONE_TEL\}/);
});

test("NavLink marks the current page and nested routes", () => {
  expect(isCurrentPath("/", "/")).toBe(true);
  expect(isCurrentPath("/sell", "/")).toBe(false);
  expect(isCurrentPath("/properties/abc", "/properties")).toBe(true);
  expect(isCurrentPath("/propertiesx", "/properties")).toBe(false);
  expect(isCurrentPath(null, "/")).toBe(false);
});
