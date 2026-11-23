import { createElement } from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import PropertiesPage, { PropertyListing } from "@/app/properties/page";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import * as propertyQueries from "@/lib/properties/queries";
import type { Property } from "@/lib/properties/types";

const push = vi.fn();
let currentParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () => "/properties",
  useRouter: () => ({ push }),
  useSearchParams: () => currentParams,
}));

const property: Property = {
  id: "test-house",
  slug: "test-house",
  title: "Test House",
  propertyType: "house",
  price: 250_000,
  location: "Test Location",
  description: "A test property.",
  status: "available",
  ownerFinancingAvailable: true,
  images: [{ src: "/test-house.jpg", alt: "Test house exterior" }],
  features: [],
  isDevelopmentPlaceholder: true,
};

beforeEach(() => {
  push.mockReset();
  currentParams = new URLSearchParams();
});

test("property card provides details and inquiry click paths", () => {
  render(createElement(PropertyCard, { property }));

  expect(screen.getByRole("link", { name: "View Details" })).toHaveAttribute(
    "href",
    "/properties/test-house",
  );
  expect(
    screen.getByRole("link", { name: "Ask About This Property" }),
  ).toHaveAttribute("href", "/properties/test-house#inquiry");
  expect(
    screen.getByText("Development placeholder listing"),
  ).toBeInTheDocument();
  expect(screen.getByText("Owner financing available")).toBeInTheDocument();
});

test("property card omits financing badge when financing is unavailable", () => {
  render(
    createElement(PropertyCard, {
      property: { ...property, ownerFinancingAvailable: false },
    }),
  );

  expect(
    screen.queryByText("Owner financing available"),
  ).not.toBeInTheDocument();
});

test("property filters expose all categories and update the URL", async () => {
  const user = userEvent.setup();
  render(createElement(PropertyFilters));

  expect(
    screen.getAllByRole("button").map((button) => button.textContent),
  ).toEqual(["All", "Houses", "Land", "Commercial"]);

  await user.click(screen.getByRole("button", { name: "Land" }));
  expect(push).toHaveBeenCalledWith("/properties?type=land");

  await user.click(screen.getByRole("button", { name: "All" }));
  expect(push).toHaveBeenCalledWith("/properties");
});

test("properties page shows the hero and available cards", async () => {
  const props = {
    searchParams: Promise.resolve({ type: "house" }),
  };
  const page = render(createElement(PropertiesPage, props));

  expect(
    screen.getByRole("heading", { level: 1, name: "Properties for Sale" }),
  ).toBeInTheDocument();
  page.unmount();

  render(await PropertyListing(props));
  expect(screen.getAllByRole("article")).toHaveLength(1);
  expect(
    screen.queryByText("No properties available right now."),
  ).not.toBeInTheDocument();
});

test("properties page shows the required empty state", async () => {
  vi.spyOn(propertyQueries, "filterPropertiesByType").mockReturnValueOnce([]);

  render(
    await PropertyListing({
      searchParams: Promise.resolve({ type: "commercial" }),
    }),
  );

  expect(
    screen.getByText("No properties available right now."),
  ).toBeInTheDocument();
});
