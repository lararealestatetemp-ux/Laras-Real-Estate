import {
  filterPropertiesByType,
  getAllProperties,
  getAvailableProperties,
  getPropertyBySlug,
} from "@/lib/properties/queries";

describe("property queries", () => {
  test("returns every fixture", () => {
    const items = getAllProperties();

    expect(items).toHaveLength(7);
    expect(items.some((property) => property.status === "unavailable")).toBe(
      true,
    );
  });

  test("returns available properties only by default listing helper", () => {
    const items = getAvailableProperties();

    expect(items).toHaveLength(6);
    expect(items.every((property) => property.status === "available")).toBe(
      true,
    );
  });

  test("gets a property by slug", () => {
    const fixture = getAllProperties()[0];

    expect(getPropertyBySlug(fixture.slug)).toEqual(fixture);
  });

  test("returns undefined for an unknown slug", () => {
    expect(getPropertyBySlug("does-not-exist")).toBeUndefined();
  });

  test("returns all available properties for the all filter", () => {
    expect(filterPropertiesByType("all")).toEqual(getAvailableProperties());
  });

  test("filters available properties by type", () => {
    const houses = filterPropertiesByType("house");

    expect(houses.length).toBeGreaterThan(0);
    expect(
      houses.every(
        (property) =>
          property.propertyType === "house" &&
          property.status === "available",
      ),
    ).toBe(true);
  });

  test("covers house, land, commercial, and unavailable fixtures", () => {
    const items = getAllProperties();
    const house = items.find((property) => property.propertyType === "house");
    const land = items.find((property) => property.propertyType === "land");

    expect(house?.ownerFinancingAvailable).toBe(true);
    expect(land).not.toHaveProperty("bedrooms");
    expect(
      items.some((property) => property.propertyType === "commercial"),
    ).toBe(true);
    expect(items.some((property) => property.status === "unavailable")).toBe(
      true,
    );
  });

  test("marks fixtures as development placeholders with local stock images", () => {
    const items = getAllProperties();

    expect(
      items.every(
        (property) =>
          property.isDevelopmentPlaceholder === true &&
          property.images.length > 0 &&
          property.images.every((image) =>
            /^\/images\/properties\/(placeholder|gallery)-[a-z0-9-]+\.jpg$/.test(
              image.src,
            ),
          ),
      ),
    ).toBe(true);
  });

  test("featured house listing includes a multi-image gallery", () => {
    const house = getPropertyBySlug("placeholder-family-house");

    expect(house?.title).toBe("Modern Home in Livingston");
    expect(house?.images.length).toBeGreaterThanOrEqual(4);
  });
});
