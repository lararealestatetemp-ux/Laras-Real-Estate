import { createElement } from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";

import RemodelingPage from "@/app/remodeling/page";
import { REMODELING_SERVICE_PLACEHOLDERS } from "@/lib/remodeling/placeholders";

test("remodeling page discloses placeholder content and offers consultation", () => {
  render(createElement(RemodelingPage));

  expect(
    screen.getByRole("heading", { level: 1, name: "Remodeling" }),
  ).toBeVisible();
  expect(
    screen.getByRole("heading", { level: 2, name: "Our Services" }),
  ).toBeVisible();
  expect(
    screen.getByRole("heading", { level: 2, name: "Request Consultation" }),
  ).toBeVisible();
  expect(
    screen.getByRole("heading", { level: 2, name: "Before & After" }),
  ).toBeVisible();

  expect(screen.getAllByText("Kitchen Remodeling").length).toBeGreaterThan(0);
  expect(screen.getAllByText("General Renovations").length).toBeGreaterThan(0);
  expect(screen.getAllByRole("listitem")).toHaveLength(
    REMODELING_SERVICE_PLACEHOLDERS.length,
  );
  expect(
    screen.getByText(
      "Placeholder imagery — not completed Laras Real Estate projects",
    ),
  ).toBeVisible();
  expect(
    screen.getByRole("img", {
      name: "Development placeholder: kitchen before remodel",
    }),
  ).toBeVisible();
  expect(
    screen.getByRole("img", {
      name: "Development placeholder: kitchen after remodel",
    }),
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: /previous before and after/i }),
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: /next before and after/i }),
  ).toBeVisible();
  expect(screen.getAllByRole("tab")).toHaveLength(3);
  expect(
    screen.getByRole("button", { name: "Request Consultation →" }),
  ).toBeVisible();
});

test("all placeholder services remain flagged for owner approval", () => {
  expect(REMODELING_SERVICE_PLACEHOLDERS).toHaveLength(10);
  expect(
    REMODELING_SERVICE_PLACEHOLDERS.every(
      (service) => service.awaitingOwnerApproval,
    ),
  ).toBe(true);
});
