import { createElement } from "react";
import "@testing-library/jest-dom/vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import PropertiesPage, { PropertyListing } from "@/app/properties/page";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import type { Property } from "@/lib/properties/types";

const push = vi.fn();
let currentParams = new URLSearchParams();
const hadScrollIntoView = "scrollIntoView" in Element.prototype;

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

afterEach(() => {
  vi.restoreAllMocks();
  if (!hadScrollIntoView) {
    delete (Element.prototype as Partial<Element>).scrollIntoView;
  }
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

test("discovery toolbar exposes search and secondary filters", async () => {
  render(
    await PropertyListing({
      searchParams: Promise.resolve({}),
    }),
  );

  expect(
    screen.getByRole("searchbox", { name: /search properties/i }),
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^beds$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^baths$/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Houses" })).toBeInTheDocument();
});

test("discovery toolbar updates URL for selects and preserves other params", async () => {
  const user = userEvent.setup();
  currentParams = new URLSearchParams("type=house&q=lot");
  render(createElement(PropertyFilters));

  await user.selectOptions(screen.getByLabelText(/^beds$/i), "3");
  expect(push).toHaveBeenLastCalledWith("/properties?type=house&q=lot&beds=3");

  await user.selectOptions(screen.getByLabelText(/^beds$/i), "");
  expect(push).toHaveBeenLastCalledWith("/properties?type=house&q=lot");
});

test("discovery toolbar debounces search by 300ms", () => {
  vi.useFakeTimers();
  try {
    render(createElement(PropertyFilters));

    // fireEvent avoids user-event's internal timers, which hang under fake timers.
    const input = screen.getByRole("searchbox", { name: /search properties/i });
    fireEvent.change(input, { target: { value: "lot" } });

    expect(push).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(push).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/properties?q=lot");
  } finally {
    vi.useRealTimers();
  }
});

test("discovery toolbar keeps typing when the URL echoes a committed query", async () => {
  const user = userEvent.setup();
  const view = render(createElement(PropertyFilters));

  const input = screen.getByRole("searchbox", { name: /search properties/i });
  await user.type(input, "a");
  await waitFor(() => expect(push).toHaveBeenCalledWith("/properties?q=a"));

  // User keeps typing while the pushed URL arrives.
  await user.type(input, "b");
  currentParams = new URLSearchParams("q=a");
  view.rerender(createElement(PropertyFilters));

  expect(input).toHaveValue("ab");

  // A genuinely external navigation (back/forward) still syncs the field.
  currentParams = new URLSearchParams("q=zzz");
  view.rerender(createElement(PropertyFilters));
  await waitFor(() => expect(input).toHaveValue("zzz"));
});

test("discovery toolbar preserves q=all as a search term", async () => {
  const user = userEvent.setup();
  render(createElement(PropertyFilters));

  await user.type(
    screen.getByRole("searchbox", { name: /search properties/i }),
    "all{Enter}",
  );
  expect(push).toHaveBeenLastCalledWith("/properties?q=all");
});

test("discovery toolbar offers keyboard autocomplete and closes on Escape", async () => {
  const user = userEvent.setup();
  render(createElement(PropertyFilters));

  const input = screen.getByRole("searchbox", { name: /search properties/i });
  await user.type(input, "a");

  const listbox = await screen.findByRole("listbox");
  const options = screen.getAllByRole("option");
  expect(listbox).toBeInTheDocument();
  expect(options.length).toBeGreaterThan(0);
  expect(input).toHaveAttribute("aria-controls", listbox.id);

  await user.keyboard("{ArrowDown}");
  expect(input).toHaveAttribute("aria-activedescendant", options[0].id);
  await user.keyboard("{Enter}");
  expect(push).toHaveBeenCalledWith(
    `/properties?${new URLSearchParams({ q: options[0].textContent ?? "" })}`,
  );
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

test("discovery toolbar closes the listbox on Escape without selecting", async () => {
  const user = userEvent.setup();
  render(createElement(PropertyFilters));

  const input = screen.getByRole("searchbox", { name: /search properties/i });
  await user.type(input, "a");
  expect(await screen.findByRole("listbox")).toBeInTheDocument();

  await user.keyboard("{Escape}");
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
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
  expect(screen.getAllByRole("article")).toHaveLength(3);
  expect(
    screen.queryByText("No properties available right now."),
  ).not.toBeInTheDocument();
});

test("listing applies q and price together", async () => {
  render(
    await PropertyListing({
      searchParams: Promise.resolve({
        q: "family",
        type: "house",
        price: "150-300",
      }),
    }),
  );

  expect(screen.getAllByRole("article")).toHaveLength(1);
  expect(screen.getByText(/placeholder family house/i)).toBeInTheDocument();
});

test("listing shows no-match empty state", async () => {
  render(
    await PropertyListing({
      searchParams: Promise.resolve({ q: "zzzz-no-match" }),
    }),
  );

  expect(
    screen.getByText("No properties match your search."),
  ).toBeInTheDocument();
});

test("placeholder map lists a pin control per filtered property", async () => {
  render(
    await PropertyListing({
      searchParams: Promise.resolve({ type: "land" }),
    }),
  );

  expect(
    screen.getByRole("region", { name: /development placeholder map/i }),
  ).toBeInTheDocument();
  expect(
    screen.getAllByRole("button", { name: /view .* on listing/i }).length,
  ).toBe(2);
});

test("placeholder map pin scrolls to and focuses its card", async () => {
  const user = userEvent.setup();
  render(
    await PropertyListing({
      searchParams: Promise.resolve({ type: "land" }),
    }),
  );
  if (!hadScrollIntoView) {
    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      value: () => undefined,
    });
  }
  const scrollIntoView = vi
    .spyOn(Element.prototype, "scrollIntoView")
    .mockImplementation(() => undefined);

  const pin = screen.getAllByRole("button", { name: /view .* on listing/i })[0];
  await user.click(pin);

  const card = document.querySelector<HTMLElement>("[data-property-id]");
  expect(card).not.toBeNull();
  expect(card?.id).toBe(`property-${card?.dataset.propertyId}`);
  expect(scrollIntoView).toHaveBeenCalledWith({
    behavior: "smooth",
    block: "center",
  });
  expect(card).toHaveFocus();
});

test("placeholder map stays visible with empty note when nothing matches", async () => {
  render(
    await PropertyListing({
      searchParams: Promise.resolve({ q: "zzzz-no-match" }),
    }),
  );

  expect(
    screen.getByRole("region", { name: /development placeholder map/i }),
  ).toBeInTheDocument();
  expect(screen.getByText("No listings match.")).toBeInTheDocument();
  expect(screen.queryAllByRole("button", { name: /view .* on listing/i })).toHaveLength(0);
});
