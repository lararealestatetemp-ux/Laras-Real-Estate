export type PropertyType = "house" | "land" | "commercial";

export type PropertyStatus = "available" | "unavailable";

export type PropertyImage = {
  src: string;
  alt: string;
};

export type MapPin = {
  /** Horizontal position as percent of map width (0–100). Layout only. */
  x: number;
  /** Vertical position as percent of map height (0–100). Layout only. */
  y: number;
};

export type Property = {
  id: string;
  slug: string;
  title: string;
  propertyType: PropertyType;
  price: number | null;
  location: string | null;
  description: string;
  status: PropertyStatus;
  ownerFinancingAvailable: boolean;
  images: PropertyImage[];
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  lotSize?: string;
  features: string[];
  /** Development-only map layout pin; not real geography. */
  mapPin?: MapPin;
  /** Always true for non-owner inventory in this phase. */
  isDevelopmentPlaceholder: true;
};
