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

test("unseeded property routes return not found", async ({ page }) => {
  const response = await page.goto("/properties/unseeded");

  expect(response?.status()).toBe(404);
});
