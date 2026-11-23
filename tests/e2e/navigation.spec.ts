import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/sell",
  "/properties",
  "/remodeling",
  "/financing",
  "/contact",
] as const;

test("all primary routes respond with one page heading", async ({ page }) => {
  for (const route of routes) {
    const response = await page.goto(route);

    expect(response?.ok(), `${route} should respond successfully`).toBe(true);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
  }
});

test("unknown routes use the custom not-found page", async ({ page }) => {
  const response = await page.goto("/does-not-exist");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "Page Not Found" }),
  ).toBeVisible();
});

test("unseeded property routes render not-found UI and stay out of search indexes", async ({
  page,
}) => {
  await page.goto("/properties/unseeded");

  // With Cache Components the shell streams first, so the HTTP status stays
  // 200 for unknown slugs; Next.js renders the not-found UI and adds noindex.
  await expect(
    page.getByRole("heading", { level: 1, name: "Page Not Found" }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});
