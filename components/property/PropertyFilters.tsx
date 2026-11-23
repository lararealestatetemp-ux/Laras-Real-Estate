"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { PropertyType } from "@/lib/properties/types";
import styles from "@/styles/property.module.css";

type FilterValue = PropertyType | "all";

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Houses", value: "house" },
  { label: "Land", value: "land" },
  { label: "Commercial", value: "commercial" },
];

function isFilterValue(value: string | null): value is FilterValue {
  return FILTERS.some((filter) => filter.value === value);
}

export function PropertyFilters() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedType = searchParams.get("type");
  const activeFilter = isFilterValue(requestedType) ? requestedType : "all";

  function selectFilter(value: FilterValue) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("type");
    } else {
      params.set("type", value);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className={styles.filters} aria-label="Filter properties">
      {FILTERS.map((filter) => (
        <button
          className={styles.filterButton}
          key={filter.value}
          type="button"
          aria-pressed={activeFilter === filter.value}
          onClick={() => selectFilter(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
