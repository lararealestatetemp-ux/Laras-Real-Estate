"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  getDiscoverySuggestions,
  parseDiscoveryFilters,
  type PriceBand,
} from "@/lib/properties/discovery";
import type { PropertyType } from "@/lib/properties/types";
import styles from "@/styles/property.module.css";

type TypeFilter = PropertyType | "all";
type SelectParam = "price" | "beds" | "baths";

const SEARCH_DEBOUNCE_MS = 300;
const SUGGESTION_LIMIT = 6;

const TYPE_FILTERS: { label: string; value: TypeFilter }[] = [
  { label: "All", value: "all" },
  { label: "Houses", value: "house" },
  { label: "Land", value: "land" },
  { label: "Commercial", value: "commercial" },
];

const PRICE_OPTIONS: { label: string; value: PriceBand | "" }[] = [
  { label: "Any price", value: "" },
  { label: "Under $150,000", value: "under-150" },
  { label: "$150,000 – $300,000", value: "150-300" },
  { label: "$300,000 – $450,000", value: "300-450" },
  { label: "$450,000 and up", value: "450-plus" },
];

const BED_OPTIONS = [
  { label: "Any", value: "" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
  { label: "4+", value: "4" },
];

const BATH_OPTIONS = [
  { label: "Any", value: "" },
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
];

function isTypeFilter(value: string | null): value is TypeFilter {
  return TYPE_FILTERS.some((filter) => filter.value === value);
}

function withParam(
  current: URLSearchParams,
  key: "q" | "type" | SelectParam,
  value: string,
): URLSearchParams {
  const next = new URLSearchParams(current.toString());

  const isDefault = value === "" || (key === "type" && value === "all");

  if (isDefault) {
    next.delete(key);
  } else {
    next.set(key, value);
  }

  return next;
}

export function PropertyDiscoveryToolbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const baseId = useId();
  const searchId = `${baseId}-search`;
  const listboxId = `${baseId}-suggestions`;

  const urlQuery = searchParams.get("q") ?? "";
  const requestedType = searchParams.get("type");
  const activeType = isTypeFilter(requestedType) ? requestedType : "all";

  const [draftQ, setDraftQ] = useState(urlQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  // The query this component last pushed (or received from the URL).
  const committedQuery = useRef(urlQuery.trim());

  // Sync the field from the URL only for external navigation (e.g.
  // back/forward). URL changes we pushed ourselves must not overwrite typing.
  useEffect(() => {
    const trimmed = urlQuery.trim();

    if (trimmed === committedQuery.current) {
      return;
    }

    committedQuery.current = trimmed;
    setDraftQ(urlQuery);
  }, [urlQuery]);

  function navigate(params: URLSearchParams) {
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function commitQuery(value: string) {
    const trimmed = value.trim();
    committedQuery.current = trimmed;
    navigate(withParam(searchParams, "q", trimmed));
  }

  useEffect(() => {
    const trimmed = draftQ.trim();

    if (trimmed === committedQuery.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      committedQuery.current = trimmed;
      const query = withParam(searchParams, "q", trimmed).toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [draftQ, pathname, router, searchParams]);

  const suggestions = useMemo(() => {
    if (draftQ.trim().length < 1) {
      return [];
    }

    const filters = parseDiscoveryFilters(
      Object.fromEntries(searchParams.entries()),
    );

    return getDiscoverySuggestions(
      { ...filters, q: draftQ },
      SUGGESTION_LIMIT,
    );
  }, [draftQ, searchParams]);

  const showList = isOpen && suggestions.length > 0;
  const optionId = (index: number) => `${listboxId}-option-${index}`;

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setDraftQ(event.target.value);
    setIsOpen(true);
    setActiveIndex(-1);
  }

  function selectSuggestion(value: string) {
    setDraftQ(value);
    setIsOpen(false);
    setActiveIndex(-1);
    commitQuery(value);
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown": {
        if (suggestions.length === 0) {
          return;
        }
        event.preventDefault();
        setIsOpen(true);
        setActiveIndex((index) => (index + 1) % suggestions.length);
        return;
      }
      case "ArrowUp": {
        if (suggestions.length === 0) {
          return;
        }
        event.preventDefault();
        setIsOpen(true);
        setActiveIndex((index) =>
          index <= 0 ? suggestions.length - 1 : index - 1,
        );
        return;
      }
      case "Enter": {
        event.preventDefault();
        if (showList && activeIndex >= 0) {
          selectSuggestion(suggestions[activeIndex]);
        } else {
          setIsOpen(false);
          commitQuery(draftQ);
        }
        return;
      }
      case "Escape": {
        setIsOpen(false);
        setActiveIndex(-1);
        return;
      }
      default:
        return;
    }
  }

  function handleSelectChange(key: SelectParam, value: string) {
    navigate(withParam(searchParams, key, value));
  }

  return (
    <div className={styles.discoveryToolbar} role="search">
      <div className={styles.searchField}>
        <label className={styles.fieldLabel} htmlFor={searchId}>
          Search properties
        </label>
        <input
          id={searchId}
          className={styles.searchInput}
          type="search"
          value={draftQ}
          autoComplete="off"
          placeholder="Title or location"
          aria-autocomplete="list"
          aria-controls={showList ? listboxId : undefined}
          aria-activedescendant={
            showList && activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          onBlur={() => setIsOpen(false)}
        />
        {showList ? (
          <ul
            className={styles.suggestionList}
            id={listboxId}
            role="listbox"
            aria-label="Search suggestions"
            onMouseDown={(event) => event.preventDefault()}
          >
            {suggestions.map((suggestion, index) => (
              <li
                className={styles.suggestionOption}
                id={optionId(index)}
                key={suggestion}
                role="option"
                aria-selected={index === activeIndex}
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className={styles.filterSelects}>
        <div className={styles.selectField}>
          <label className={styles.fieldLabel} htmlFor={`${baseId}-price`}>
            Price
          </label>
          <select
            id={`${baseId}-price`}
            className={styles.filterSelect}
            value={searchParams.get("price") ?? ""}
            onChange={(event) => handleSelectChange("price", event.target.value)}
          >
            {PRICE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.selectField}>
          <label className={styles.fieldLabel} htmlFor={`${baseId}-beds`}>
            Beds
          </label>
          <select
            id={`${baseId}-beds`}
            className={styles.filterSelect}
            value={searchParams.get("beds") ?? ""}
            onChange={(event) => handleSelectChange("beds", event.target.value)}
          >
            {BED_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.selectField}>
          <label className={styles.fieldLabel} htmlFor={`${baseId}-baths`}>
            Baths
          </label>
          <select
            id={`${baseId}-baths`}
            className={styles.filterSelect}
            value={searchParams.get("baths") ?? ""}
            onChange={(event) => handleSelectChange("baths", event.target.value)}
          >
            {BATH_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.filters} role="group" aria-label="Filter properties">
        {TYPE_FILTERS.map((filter) => (
          <button
            className={styles.filterButton}
            key={filter.value}
            type="button"
            aria-pressed={activeType === filter.value}
            onClick={() => navigate(withParam(searchParams, "type", filter.value))}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
