import { createElement } from "react";
import "@testing-library/jest-dom/vitest";
import {
  act,
  createEvent,
  fireEvent,
  render, screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import PropertiesPage, { PropertyListing } from "@/app/properties/page";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import type * as QueriesModule from "@/lib/properties/queries";
import type { Property } from "@/lib/properties/types";

const push = vi.fn();
const replace = vi.fn();
const router = { push, replace };
let currentParams = new URLSearchParams();
const hadScrollIntoView = "scrollIntoView" in Element.prototype;

const queriesOverride = vi.hoisted(() => ({ empty: false }));

vi.mock("@/lib/properties/queries", async (importOriginal) => {
  const actual = await importOriginal<typeof QueriesModule>();
  return {
    ...actual,
    getAvailableProperties: () =>
      queriesOverride.empty ? [] : actual.getAvailableProperties(),
  };
});

vi.mock("next/navigation", () => ({
  usePathname: () => "/properties",
  useRouter: () => router,
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
  replace.mockReset();
  queriesOverride.empty = false;
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
  expect(push).toHaveBeenCalledWith("/properties?type=land", { scroll: false });

  await user.click(screen.getByRole("button", { name: "All" }));
  expect(push).toHaveBeenCalledWith("/properties", { scroll: false });
});

test("discovery toolbar exposes search and secondary filters", async () => {
  render(
    await PropertyListing({
      searchParams: Promise.resolve({}),
    }),
  );

  expect(
    screen.getByRole("combobox", { name: /search properties/i }),
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
  expect(push).toHaveBeenLastCalledWith(
    "/properties?type=house&q=lot&beds=3",
    { scroll: false },
  );

  await user.selectOptions(screen.getByLabelText(/^beds$/i), "");
  expect(push).toHaveBeenLastCalledWith("/properties?type=house&q=lot", {
    scroll: false,
  });
});

test("discovery toolbar debounces search by 300ms", () => {
  vi.useFakeTimers();
  try {
    render(createElement(PropertyFilters));

    // fireEvent avoids user-event's internal timers, which hang under fake timers.
    const input = screen.getByRole("combobox", { name: /search properties/i });
    fireEvent.change(input, { target: { value: "lot" } });

    expect(replace).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(replace).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(replace).toHaveBeenCalledTimes(1);
    expect(push).not.toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith("/properties?q=lot", { scroll: false });
  } finally {
    vi.useRealTimers();
  }
});

test("discovery toolbar cancels pending debounce when Enter submits", () => {
  vi.useFakeTimers();
  try {
    render(createElement(PropertyFilters));

    const input = screen.getByRole("combobox", { name: /search properties/i });
    fireEvent.change(input, { target: { value: "lot" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/properties?q=lot", { scroll: false });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(push).toHaveBeenCalledTimes(1);
    expect(replace).not.toHaveBeenCalled();
  } finally {
    vi.useRealTimers();
  }
});

test("discovery toolbar keeps typing when the URL echoes a committed query", async () => {
  const user = userEvent.setup();
  const view = render(createElement(PropertyFilters));

  const input = screen.getByRole("combobox", { name: /search properties/i });
  await user.type(input, "a");
  await waitFor(() =>
    expect(replace).toHaveBeenCalledWith("/properties?q=a", { scroll: false }),
  );

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
    screen.getByRole("combobox", { name: /search properties/i }),
    "all{Enter}",
  );
  expect(push).toHaveBeenLastCalledWith("/properties?q=all", { scroll: false });
});

test("discovery toolbar offers keyboard autocomplete and closes on Escape", async () => {
  const user = userEvent.setup();
  render(createElement(PropertyFilters));

  const input = screen.getByRole("combobox", { name: /search properties/i });
  await user.type(input, "a");

  const listbox = await screen.findByRole("listbox");
  const options = screen.getAllByRole("option");
  expect(listbox).toBeInTheDocument();
  expect(options.length).toBeGreaterThan(0);
  expect(input).toHaveAttribute("aria-controls", listbox.id);
  expect(input).toHaveAttribute("aria-expanded", "true");
  expect(input).toHaveAttribute("aria-haspopup", "listbox");

  await user.keyboard("{ArrowDown}");
  expect(input).toHaveAttribute("aria-activedescendant", options[0].id);
  await user.keyboard("{Enter}");
  expect(push).toHaveBeenCalledWith(
    `/properties?${new URLSearchParams({ q: options[0].textContent ?? "" })}`,
    { scroll: false },
  );
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

test("discovery toolbar closes the listbox on Escape without selecting", async () => {
  const user = userEvent.setup();
  render(createElement(PropertyFilters));

  const input = screen.getByRole("combobox", { name: /search properties/i });
  await user.type(input, "a");
  expect(await screen.findByRole("listbox")).toBeInTheDocument();

  const escape = createEvent.keyDown(input, { key: "Escape" });
  fireEvent(input, escape);
  expect(escape.defaultPrevented).toBe(true);
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  expect(input).toHaveAttribute("aria-expanded", "false");

  // With the list closed, Escape is left to the browser.
  const secondEscape = createEvent.keyDown(input, { key: "Escape" });
  fireEvent(input, secondEscape);
  expect(secondEscape.defaultPrevented).toBe(false);
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

test("listing shows empty inventory message when nothing is available and no filters are active", async () => {
  queriesOverride.empty = true;

  render(await PropertyListing({ searchParams: Promise.resolve({}) }));

  expect(
    screen.getByText("No properties available right now."),
  ).toBeInTheDocument();
  expect(
    screen.queryByText("No properties match your search."),
  ).not.toBeInTheDocument();
  expect(screen.queryAllByRole("article")).toHaveLength(0);
  expect(screen.getByText("No listings match.")).toBeInTheDocument();
});
