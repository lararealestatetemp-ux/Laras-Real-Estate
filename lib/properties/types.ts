export type PropertyType = "house" | "land" | "commercial";

export type PropertyStatus = "available" | "unavailable";

export type PropertyImage = {
  src: string;
  alt: string;
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
  /** Always true for non-owner inventory in this phase. */
  isDevelopmentPlaceholder: true;
};
