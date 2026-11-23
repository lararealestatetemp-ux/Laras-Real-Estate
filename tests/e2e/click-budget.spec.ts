import { expect, test } from "@playwright/test";

test("property inquiry reachable in 2 clicks from home via card CTA", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Properties for Sale", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/properties$/);

  await page
    .getByRole("link", { name: "Ask About This Property" })
    .first()
    .click();
  await expect(page).toHaveURL(/\/properties\/[^/]+#inquiry$/);
  await expect(page.locator("#inquiry")).toBeVisible();
  await expect(
    page.locator("#inquiry").getByRole("button", { name: /send|submit|ask/i }),
  ).toBeVisible();
});

test("sell form reachable in 1 click from home", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Sell Your Property", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/sell$/);
  await expect(page.getByRole("button", { name: /request cash offer/i })).toBeVisible();
});

test("remodeling consultation reachable in 1 click from home", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Remodeling", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/remodeling$/);
  await expect(
    page.getByRole("button", { name: /submit|request|send/i }),
  ).toBeVisible();
});

test("contact form reachable in 1 click from home", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Contact", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("button", { name: /send|submit/i })).toBeVisible();
});
