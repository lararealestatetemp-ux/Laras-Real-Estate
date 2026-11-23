import { createElement } from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";

import Home from "@/app/page";

test("home presents the approved sections and destinations", () => {
  render(createElement(Home));

  expect(
    screen.getByRole("heading", { level: 1, name: "Laras Real Estate" }),
  ).toBeVisible();
  expect(
    screen.getByText("Love Your Location. Reimagine Your Home."),
  ).toBeVisible();
  expect(
    screen.getByText("Real solutions for buyers, sellers, and investors."),
  ).toBeVisible();

  const expectedLinks = [
    ["Sell Your Property", "/sell"],
    ["View Available Properties", "/properties"],
    ["Explore Remodeling", "/remodeling"],
    ["Learn About Financing", "/financing"],
    ["Request a Remodeling Consultation", "/remodeling"],
    ["Contact Laras Real Estate", "/contact"],
  ] as const;

  for (const [name, href] of expectedLinks) {
    const links = screen.getAllByRole("link", { name });
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link).toHaveAttribute("href", href);
    }
  }

  const services = screen.getByRole("region", { name: "Ways we can help" });
  expect(
    within(services).getAllByRole("heading", { level: 3 }),
  ).toHaveLength(4);
  expect(
    screen.getByRole("heading", { level: 2, name: "Building Better Opportunities" }),
  ).toBeVisible();
});
