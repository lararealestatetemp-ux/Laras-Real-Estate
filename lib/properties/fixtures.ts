import type { Property } from "./types";

export const properties: Property[] = [
  {
    id: "placeholder-house-1",
    slug: "placeholder-family-house",
    title: "Placeholder Family House",
    propertyType: "house",
    price: 285_000,
    location: "Sample Neighborhood",
    description:
      "Development-only house listing used to preview the property experience.",
    status: "available",
    ownerFinancingAvailable: true,
    images: [
      {
        src: "https://picsum.photos/seed/placeholder-house-1/1200/800",
        alt: "Placeholder image for a sample family house",
      },
    ],
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1_850,
    lotSize: "0.24 acres",
    features: ["Covered patio", "Attached garage", "Fenced yard"],
    isDevelopmentPlaceholder: true,
  },
  {
    id: "placeholder-land-1",
    slug: "placeholder-residential-land",
    title: "Placeholder Residential Land",
    propertyType: "land",
    price: 79_000,
    location: "Sample Rural Area",
    description:
      "Development-only land listing used to preview vacant property details.",
    status: "available",
    ownerFinancingAvailable: false,
    images: [
      {
        src: "https://picsum.photos/seed/placeholder-land-1/1200/800",
        alt: "Placeholder image for sample residential land",
      },
    ],
    lotSize: "2.5 acres",
    features: ["Road access", "Surveyed boundaries", "Open terrain"],
    isDevelopmentPlaceholder: true,
  },
  {
    id: "placeholder-commercial-1",
    slug: "placeholder-commercial-space",
    title: "Placeholder Commercial Space",
    propertyType: "commercial",
    price: 450_000,
    location: "Sample Business District",
    description:
      "Development-only commercial listing used to preview business properties.",
    status: "available",
    ownerFinancingAvailable: false,
    images: [
      {
        src: "https://picsum.photos/seed/placeholder-commercial-1/1200/800",
        alt: "Placeholder image for a sample commercial space",
      },
    ],
    bathrooms: 2,
    squareFootage: 3_200,
    features: ["Storefront", "Parking area", "Storage room"],
    isDevelopmentPlaceholder: true,
  },
  {
    id: "placeholder-house-unavailable",
    slug: "placeholder-unavailable-house",
    title: "Placeholder Unavailable House",
    propertyType: "house",
    price: null,
    location: null,
    description:
      "Development-only unavailable listing used to verify inventory filtering.",
    status: "unavailable",
    ownerFinancingAvailable: false,
    images: [
      {
        src: "https://picsum.photos/seed/placeholder-house-unavailable/1200/800",
        alt: "Placeholder image for an unavailable sample house",
      },
    ],
    bedrooms: 2,
    bathrooms: 1,
    squareFootage: 1_100,
    features: [],
    isDevelopmentPlaceholder: true,
  },
];
