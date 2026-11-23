import { expect, test } from "@playwright/test";

test("empty seller form shows accessible validation errors", async ({ page }) => {
  await page.goto("/sell");

  await page.getByRole("button", { name: /request cash offer/i }).click();

  const alerts = page.locator("form").getByRole("alert");
  await expect(alerts.first()).toBeVisible();
  await expect(page.getByText(/correct the highlighted fields/i)).toBeVisible();

  // Every required field reports an error and links it via aria-describedby.
  for (const id of [
    "seller-first-name",
    "seller-last-name",
    "seller-email",
    "seller-phone",
    "seller-property-address",
    "seller-property-type",
    "seller-asking-price",
    "seller-general-info",
  ]) {
    const field = page.locator(`#${id}`);
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(field).toHaveAttribute("aria-describedby", `${id}-error`);
    await expect(page.locator(`#${id}-error`)).toBeVisible();
  }

  // Honeypot must not be reachable or announced for real users.
  const honeypot = page.locator("#seller-company");
  await expect(honeypot).toHaveAttribute("aria-hidden", "true");
  await expect(honeypot).toHaveAttribute("tabindex", "-1");
  await expect(honeypot).not.toHaveAttribute("required", /.*/);
  await expect(page.locator("#seller-company-error")).toHaveCount(0);
});

test("seller error messages are reachable by keyboard focus order", async ({
  page,
}) => {
  await page.goto("/sell");
  await page.getByRole("button", { name: /request cash offer/i }).click();
  await expect(page.locator("#seller-first-name-error")).toBeVisible();

  await page.locator("#seller-first-name").focus();
  await expect(page.locator("#seller-first-name")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#seller-last-name")).toBeFocused();
});
