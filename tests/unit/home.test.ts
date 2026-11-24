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
    screen.getByText(
      "Real Solutions for Buyers, Sellers, and Better Living.",
    ),
  ).toBeVisible();
  expect(
    screen.getByRole("img", {
      name: "Development placeholder stock photo: modern home exterior at twilight",
    }),
  ).toBeInTheDocument();

  const expectedLinks = [
    ["Sell Your Property →", "/sell"],
    ["View Available Properties →", "/properties"],
    ["Get Started →", "/sell"],
    ["View Properties →", "/properties"],
    ["Learn More →", "/remodeling"],
    ["Explore Financing →", "/financing"],
    ["Contact Us →", "/contact"],
    ["View More Projects →", "/remodeling"],
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
  expect(screen.getByText("About Us")).toBeVisible();
  expect(screen.getByText("Local Expertise")).toBeVisible();
  expect(screen.getByText("Trusted & Reliable")).toBeVisible();
  expect(screen.getByText("Community Focused")).toBeVisible();
  expect(
    screen.getByRole("img", {
      name: "Development placeholder stock photo: modern kitchen interior",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { level: 2, name: "Before & After" }),
  ).toBeVisible();
  expect(screen.getByText("Our Work")).toBeVisible();
  expect(
    screen.getByRole("img", {
      name: "Development placeholder: kitchen before remodel of the same property",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", {
      name: "Development placeholder: kitchen after remodel of the same property",
    }),
  ).toBeInTheDocument();
});
