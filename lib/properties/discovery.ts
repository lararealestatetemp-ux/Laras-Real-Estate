import { getAvailableProperties } from "./queries";
import type { Property, PropertyType } from "./types";

export type PriceBand = "under-150" | "150-300" | "300-450" | "450-plus";

export type DiscoveryFilters = {
  q: string;
  type: PropertyType | "all";
  price: PriceBand | null;
  beds: number | null;
  baths: number | null;
};

const PRICE_BANDS = new Set<PriceBand>([
  "under-150",
  "150-300",
  "300-450",
  "450-plus",
]);

const BED_OPTIONS = new Set([2, 3, 4]);
const BATH_OPTIONS = new Set([1, 2, 3]);

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export function parseDiscoveryFilters(
  params: Record<string, string | string[] | undefined>,
): DiscoveryFilters {
  const q = (firstParam(params.q) ?? "").trim();
  const typeRaw = firstParam(params.type);
  const type: PropertyType | "all" =
    typeRaw === "house" || typeRaw === "land" || typeRaw === "commercial"
      ? typeRaw
      : "all";

  const priceRaw = firstParam(params.price);
  const price =
    priceRaw && PRICE_BANDS.has(priceRaw as PriceBand)
      ? (priceRaw as PriceBand)
      : null;

  const bedsRaw = Number(firstParam(params.beds));
  const bathsRaw = Number(firstParam(params.baths));

  return {
    q,
    type,
    price,
    beds: BED_OPTIONS.has(bedsRaw) ? bedsRaw : null,
    baths: BATH_OPTIONS.has(bathsRaw) ? bathsRaw : null,
  };
}

function matchesPrice(property: Property, band: PriceBand): boolean {
  if (property.price === null) {
    return false;
  }
  const price = property.price;
  switch (band) {
    case "under-150":
      return price < 150_000;
    case "150-300":
      return price >= 150_000 && price < 300_000;
    case "300-450":
      return price >= 300_000 && price < 450_000;
    case "450-plus":
      return price >= 450_000;
    default: {
      const _exhaustive: never = band;
      return _exhaustive;
    }
  }
}

function matchesQuery(property: Property, q: string): boolean {
  if (!q) {
    return true;
  }
  const haystack = [
    property.title,
    property.location ?? "",
    property.propertyType,
    property.description,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q.toLowerCase());
}

export function filterPropertiesByDiscovery(
  filters: DiscoveryFilters,
): Property[] {
  return getAvailableProperties().filter((property) => {
    if (filters.type !== "all" && property.propertyType !== filters.type) {
      return false;
    }
    if (!matchesQuery(property, filters.q)) {
      return false;
    }
    if (filters.price && !matchesPrice(property, filters.price)) {
      return false;
    }
    if (filters.beds !== null) {
      if (property.bedrooms === undefined || property.bedrooms < filters.beds) {
        return false;
      }
    }
    if (filters.baths !== null) {
      if (
        property.bathrooms === undefined ||
        property.bathrooms < filters.baths
      ) {
        return false;
      }
    }
    return true;
  });
}

export function getDiscoverySuggestions(
  filters: DiscoveryFilters,
  limit = 6,
): string[] {
  const needle = filters.q.trim().toLowerCase();
  if (!needle || limit <= 0) {
    return [];
  }

  const pool = filterPropertiesByDiscovery({
    ...filters,
    q: "",
  });

  const values: string[] = [];
  for (const property of pool) {
    for (const candidate of [property.title, property.location]) {
      if (!candidate) {
        continue;
      }
      if (!candidate.toLowerCase().includes(needle)) {
        continue;
      }
      if (!values.includes(candidate)) {
        values.push(candidate);
      }
      if (values.length >= limit) {
        return values;
      }
    }
  }
  return values;
}
