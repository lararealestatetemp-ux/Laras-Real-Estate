import type { Property } from "./types";

export const properties: Property[] = [
  {
    id: "placeholder-house-1",
    slug: "placeholder-family-house",
    title: "Modern Home in Livingston",
    propertyType: "house",
    price: 285_000,
    location: "Livingston area (placeholder)",
    description:
      "Development placeholder listing. Preview of an open floor plan home with an updated kitchen feel and a spacious backyard — sample content only, not a live offering.",
    status: "available",
    ownerFinancingAvailable: true,
    images: [
      {
        src: "/images/properties/placeholder-family-house.jpg",
        alt: "Development placeholder stock photo: home exterior",
      },
      {
        src: "/images/properties/gallery-kitchen.jpg",
        alt: "Development placeholder stock photo: kitchen interior",
      },
      {
        src: "/images/properties/gallery-living.jpg",
        alt: "Development placeholder stock photo: living room",
      },
      {
        src: "/images/properties/gallery-bedroom.jpg",
        alt: "Development placeholder stock photo: bedroom",
      },
      {
        src: "/images/properties/gallery-backyard.jpg",
        alt: "Development placeholder stock photo: backyard exterior",
      },
    ],
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1_650,
    lotSize: "0.24 acres",
    features: [
      "Updated kitchen",
      "Two-car garage",
      "Spacious backyard",
      "Quiet neighborhood",
      "Open floor plan",
      "Close to shopping and schools",
    ],
    isDevelopmentPlaceholder: true,
  },
  {
    id: "placeholder-house-2",
    slug: "placeholder-ranch-home",
    title: "Ranch Home in Sample Suburb",
    propertyType: "house",
    price: 319_000,
    location: "Sample Suburban Area",
    description:
      "Development placeholder ranch-style house listing used to preview the property experience.",
    status: "available",
    ownerFinancingAvailable: true,
    images: [
      {
        src: "/images/properties/placeholder-ranch-home.jpg",
        alt: "Development placeholder stock photo: ranch home exterior",
      },
      {
        src: "/images/properties/gallery-living.jpg",
        alt: "Development placeholder stock photo: living room",
      },
      {
        src: "/images/properties/gallery-kitchen.jpg",
        alt: "Development placeholder stock photo: kitchen interior",
      },
    ],
    bedrooms: 4,
    bathrooms: 2,
    squareFootage: 2_100,
    lotSize: "0.31 acres",
    features: ["Single story", "Large driveway", "Mature trees", "Covered patio"],
    isDevelopmentPlaceholder: true,
  },
  {
    id: "placeholder-house-3",
    slug: "placeholder-brick-home",
    title: "Brick Home on Sample Street",
    propertyType: "house",
    price: 349_000,
    location: "Sample Residential Street",
    description:
      "Development placeholder brick house listing used to preview the property experience.",
    status: "available",
    ownerFinancingAvailable: false,
    images: [
      {
        src: "/images/properties/placeholder-brick-home.jpg",
        alt: "Development placeholder stock photo: brick home exterior",
      },
      {
        src: "/images/properties/gallery-bedroom.jpg",
        alt: "Development placeholder stock photo: bedroom",
      },
    ],
    bedrooms: 3,
    bathrooms: 2.5,
    squareFootage: 2_050,
    lotSize: "0.28 acres",
    features: ["Brick exterior", "Front porch", "Updated kitchen"],
    isDevelopmentPlaceholder: true,
  },
  {
    id: "placeholder-land-1",
    slug: "placeholder-residential-land",
    title: "Residential Land — Sample Rural Area",
    propertyType: "land",
    price: 79_000,
    location: "Sample Rural Area",
    description:
      "Development placeholder land listing used to preview vacant property details.",
    status: "available",
    ownerFinancingAvailable: false,
    images: [
      {
        src: "/images/properties/placeholder-residential-land.jpg",
        alt: "Development placeholder stock photo: residential land",
      },
    ],
    lotSize: "2.5 acres",
    features: ["Road access", "Surveyed boundaries", "Open terrain"],
    isDevelopmentPlaceholder: true,
  },
  {
    id: "placeholder-land-2",
    slug: "placeholder-acreage-land",
    title: "Acreage Land — Sample Countryside",
    propertyType: "land",
    price: 160_000,
    location: "Sample Countryside",
    description:
      "Development placeholder acreage listing used to preview larger vacant property details.",
    status: "available",
    ownerFinancingAvailable: true,
    images: [
      {
        src: "/images/properties/placeholder-acreage-land.jpg",
        alt: "Development placeholder stock photo: acreage land",
      },
    ],
    lotSize: "5 acres",
    features: ["Open pasture", "County road frontage", "Utilities nearby"],
    isDevelopmentPlaceholder: true,
  },
  {
    id: "placeholder-commercial-1",
    slug: "placeholder-commercial-space",
    title: "Commercial Space — Sample District",
    propertyType: "commercial",
    price: 450_000,
    location: "Sample Business District",
    description:
      "Development placeholder commercial listing used to preview business properties.",
    status: "available",
    ownerFinancingAvailable: false,
    images: [
      {
        src: "/images/properties/placeholder-commercial-space.jpg",
        alt: "Development placeholder stock photo: commercial building",
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
        src: "/images/properties/placeholder-unavailable-house.jpg",
        alt: "Development placeholder stock photo: unavailable sample house",
      },
    ],
    bedrooms: 2,
    bathrooms: 1,
    squareFootage: 1_100,
    features: [],
    isDevelopmentPlaceholder: true,
  },
];
