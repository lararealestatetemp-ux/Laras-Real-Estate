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

  expect(screen.getAllByText("Awaiting owner approval")).toHaveLength(
    REMODELING_SERVICE_PLACEHOLDERS.length,
  );
  expect(
    screen.getByText(
      "Placeholder imagery — not completed Laras Real Estate projects",
    ),
  ).toBeVisible();
  expect(
    screen.getByRole("img", { name: "Placeholder before image" }),
  ).toBeVisible();
  expect(
    screen.getByRole("img", { name: "Placeholder after image" }),
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Request Consultation" }),
  ).toBeVisible();
});

test("all placeholder services remain flagged for owner approval", () => {
  expect(
    REMODELING_SERVICE_PLACEHOLDERS.every(
      (service) => service.awaitingOwnerApproval,
    ),
  ).toBe(true);
});
