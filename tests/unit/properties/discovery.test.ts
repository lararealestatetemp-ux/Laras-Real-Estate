import {
  filterPropertiesByDiscovery,
  getDiscoverySuggestions,
  parseDiscoveryFilters,
} from "@/lib/properties/discovery";

describe("parseDiscoveryFilters", () => {
  test("parses valid params and ignores invalid", () => {
    expect(
      parseDiscoveryFilters({
        q: "ranch",
        type: "house",
        price: "150-300",
        beds: "3",
        baths: "2",
      }),
    ).toEqual({
      q: "ranch",
      type: "house",
      price: "150-300",
      beds: 3,
      baths: 2,
    });

    expect(
      parseDiscoveryFilters({
        type: "castle",
        price: "nope",
        beds: "9",
        baths: ["1"],
      }),
    ).toEqual({
      q: "",
      type: "all",
      price: null,
      beds: null,
      baths: 1,
    });
  });
});

describe("filterPropertiesByDiscovery", () => {
  test("ANDs type, text, price, beds, and baths", () => {
    const results = filterPropertiesByDiscovery({
      q: "",
      type: "house",
      price: "150-300",
      beds: 3,
      baths: 2,
    });

    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every(
        (p) =>
          p.status === "available" &&
          p.propertyType === "house" &&
          p.price !== null &&
          p.price >= 150_000 &&
          p.price < 300_000 &&
          (p.bedrooms ?? 0) >= 3 &&
          (p.bathrooms ?? 0) >= 2,
      ),
    ).toBe(true);
  });

  test("excludes land when beds filter is active", () => {
    const results = filterPropertiesByDiscovery({
      q: "",
      type: "all",
      price: null,
      beds: 2,
      baths: null,
    });

    expect(results.every((p) => p.bedrooms !== undefined)).toBe(true);
    expect(results.every((p) => p.propertyType !== "land")).toBe(true);
  });

  test("matches q against title location type description", () => {
    const results = filterPropertiesByDiscovery({
      q: "acreage",
      type: "all",
      price: null,
      beds: null,
      baths: null,
    });

    expect(results.some((p) => /acreage/i.test(p.title))).toBe(true);
  });
});

describe("getDiscoverySuggestions", () => {
  test("returns up to 6 distinct title/location matches", () => {
    const suggestions = getDiscoverySuggestions(
      {
        q: "sample",
        type: "all",
        price: null,
        beds: null,
        baths: null,
      },
      6,
    );

    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.length).toBeLessThanOrEqual(6);
    expect(new Set(suggestions).size).toBe(suggestions.length);
  });

  test("returns empty for blank q", () => {
    expect(
      getDiscoverySuggestions({
        q: "   ",
        type: "all",
        price: null,
        beds: null,
        baths: null,
      }),
    ).toEqual([]);
  });

  test("returns empty when limit is zero or negative", () => {
    const filters = {
      q: "sample",
      type: "all" as const,
      price: null,
      beds: null,
      baths: null,
    };

    expect(getDiscoverySuggestions(filters, 0)).toEqual([]);
    expect(getDiscoverySuggestions(filters, -1)).toEqual([]);
  });
});
