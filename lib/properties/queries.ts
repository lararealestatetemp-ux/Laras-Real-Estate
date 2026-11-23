import { properties } from "./fixtures";
import type { Property, PropertyType } from "./types";

export function getAllProperties(): Property[] {
  return properties;
}

export function getAvailableProperties(): Property[] {
  return properties.filter((property) => property.status === "available");
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((property) => property.slug === slug);
}

export function filterPropertiesByType(
  type: PropertyType | "all",
): Property[] {
  const availableProperties = getAvailableProperties();

  if (type === "all") {
    return availableProperties;
  }

  return availableProperties.filter(
    (property) => property.propertyType === type,
  );
}
