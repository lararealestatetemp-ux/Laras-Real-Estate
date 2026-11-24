# Properties Search, Filters, Autocomplete & Placeholder Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add shareable URL-driven search, type/price/beds/baths filters, keyboard-accessible autocomplete, and a labeled development-placeholder map with pins for the filtered `/properties` listings.

**Architecture:** Keep available fixtures as the data source. Add pure discovery helpers in `lib/properties/` that parse URL search params and AND-filter properties. Client toolbar updates the URL (`q`, `type`, `price`, `beds`, `baths`). Server listing reads the same params and renders cards + a client map that pins filtered results and scrolls to cards. No live map providers.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS Modules (locked palette), Vitest + Testing Library, existing property fixtures

**Spec:** `docs/superpowers/specs/2026-11-24-properties-search-filter-map-design.md`

## Global Constraints

- Palette LOCKED: navy `#0C2340`, gold `#B08D57`, neutral `#F6F6F6`, white `#FFFFFF` only
- Never invent real geography; map pins use percentage layout coords labeled development placeholder
- Development fixtures/images must stay labeled as placeholders
- Older-visitor UX: large controls (≥2.75rem), no complex MLS UI
- Do not claim tests passed unless executed
- Follow Next.js 16 docs under `node_modules/next/dist/docs/` if App Router APIs differ from training data
- Imports at top of files only (no inline imports)

---

## File Structure

| File | Responsibility |
|---|---|
| `lib/properties/types.ts` | Add `MapPin`, `PriceBand`, `DiscoveryFilters` |
| `lib/properties/discovery.ts` | Parse params, filter, autocomplete suggestions (pure) |
| `lib/properties/fixtures.ts` | Add `mapPin` to available listings |
| `lib/properties/queries.ts` | Re-export or thin wrappers; keep existing helpers |
| `components/property/PropertyDiscoveryToolbar.tsx` | Search + filters + autocomplete → URL |
| `components/property/PropertyMapPlaceholder.tsx` | Placeholder map + pins → scroll to card |
| `components/property/PropertyCard.tsx` | Stable `id` / `data-property-id` for scroll target |
| `components/property/PropertyFilters.tsx` | Replace usage with toolbar (delete or re-export) |
| `app/properties/page.tsx` | Wire searchParams → discovery → grid + map layout |
| `styles/property.module.css` | Toolbar, autocomplete, map, discovery layout |
| `tests/unit/properties/discovery.test.ts` | Filter + parse + suggestions |
| `tests/unit/properties/listing.test.ts` | Combined filters / empty / map presence |
| `tests/unit/properties/queries.test.ts` | Update counts if fixtures gain only mapPin |

---

### Task 1: Discovery types and pure filter helpers (TDD)

**Files:**
- Create: `lib/properties/discovery.ts`
- Modify: `lib/properties/types.ts`
- Test: `tests/unit/properties/discovery.test.ts`

**Interfaces:**
- Produces:
  - `export type PriceBand = "under-150" | "150-300" | "300-450" | "450-plus"`
  - `export type DiscoveryFilters = { q: string; type: PropertyType \| "all"; price: PriceBand \| null; beds: number \| null; baths: number \| null }`
  - `export type MapPin = { x: number; y: number }` (percent 0–100)
  - `parseDiscoveryFilters(params: Record<string, string \| string[] \| undefined>): DiscoveryFilters`
  - `filterPropertiesByDiscovery(filters: DiscoveryFilters): Property[]`
  - `getDiscoverySuggestions(filters: DiscoveryFilters, limit?: number): string[]`

- [ ] **Step 1: Extend `Property` with optional `mapPin`**

In `lib/properties/types.ts`, add:

```ts
export type MapPin = {
  /** Horizontal position as percent of map width (0–100). Layout only. */
  x: number;
  /** Vertical position as percent of map height (0–100). Layout only. */
  y: number;
};
```

Add to `Property`:

```ts
  /** Development-only map layout pin; not real geography. */
  mapPin?: MapPin;
```

- [ ] **Step 2: Write failing discovery tests**

Create `tests/unit/properties/discovery.test.ts`:

```ts
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
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run tests/unit/properties/discovery.test.ts`  
Expected: FAIL (module not found)

- [ ] **Step 4: Implement `lib/properties/discovery.ts`**

```ts
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
  if (!needle) {
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
```

- [ ] **Step 5: Run discovery tests**

Run: `npx vitest run tests/unit/properties/discovery.test.ts`  
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/properties/types.ts lib/properties/discovery.ts tests/unit/properties/discovery.test.ts
git commit -m "feat: add property discovery filter helpers"
```

---

### Task 2: Add mapPin layout data to fixtures

**Files:**
- Modify: `lib/properties/fixtures.ts`
- Modify: `tests/unit/properties/queries.test.ts` (only if assertions break)

**Interfaces:**
- Consumes: `MapPin` from `types.ts`
- Produces: each **available** property has `mapPin: { x, y }` with distinct positions

- [ ] **Step 1: Assign placeholder pins**

Add spread positions for the six available listings (example values; keep unavailable without pin or with unused pin):

```ts
mapPin: { x: 22, y: 30 }, // family house
mapPin: { x: 48, y: 28 }, // ranch
mapPin: { x: 72, y: 35 }, // brick
mapPin: { x: 30, y: 62 }, // residential land
mapPin: { x: 58, y: 68 }, // acreage
mapPin: { x: 78, y: 55 }, // commercial
```

- [ ] **Step 2: Run existing property unit tests**

Run: `npx vitest run tests/unit/properties/`  
Expected: PASS (adjust query image/count tests only if needed)

- [ ] **Step 3: Commit**

```bash
git add lib/properties/fixtures.ts tests/unit/properties/queries.test.ts
git commit -m "feat: add development map pin layout to property fixtures"
```

---

### Task 3: PropertyDiscoveryToolbar (search, filters, autocomplete)

**Files:**
- Create: `components/property/PropertyDiscoveryToolbar.tsx`
- Modify: `styles/property.module.css`
- Modify or retire: `components/property/PropertyFilters.tsx` (keep file re-exporting toolbar temporarily OR delete and update imports)
- Test: extend `tests/unit/properties/listing.test.ts`

**Interfaces:**
- Consumes: `useRouter`, `usePathname`, `useSearchParams`; `getDiscoverySuggestions`, `parseDiscoveryFilters` shapes via URL only on client
- Produces: URL updates for `q`, `type`, `price`, `beds`, `baths`

- [ ] **Step 1: Write failing listing test for toolbar controls**

In `tests/unit/properties/listing.test.ts`, add (with existing next/navigation mock):

```ts
test("discovery toolbar exposes search and secondary filters", async () => {
  render(
    await PropertyListing({
      searchParams: Promise.resolve({}),
    }),
  );

  expect(
    screen.getByRole("searchbox", { name: /search properties/i }),
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^beds$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^baths$/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Houses" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `npx vitest run tests/unit/properties/listing.test.ts`  
Expected: FAIL missing searchbox

- [ ] **Step 3: Implement toolbar component**

Create `components/property/PropertyDiscoveryToolbar.tsx` as a client component that:

1. Reads current params via `useSearchParams`.
2. Local state for search input; debounce 300ms then `router.push` with updated `q`.
3. Type buttons same as current `PropertyFilters` but preserve other params.
4. `<select>` for price/beds/baths with labels “Price”, “Beds”, “Baths”.
5. Autocomplete: when input trimmed length ≥ 1, call `getDiscoverySuggestions(parseDiscoveryFilters(Object.fromEntries(searchParams)), 6)` but build filters from current URL + draft `q` for the suggestion query. Use listbox pattern (`role="listbox"`, options `role="option"`, Arrow keys, Enter, Escape).
6. Visible label for search: `Search properties` (associate with input via `htmlFor`).

Skeleton:

```tsx
"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  getDiscoverySuggestions,
  parseDiscoveryFilters,
  type PriceBand,
} from "@/lib/properties/discovery";
import type { PropertyType } from "@/lib/properties/types";
import styles from "@/styles/property.module.css";

// TYPE_FILTERS, PRICE_OPTIONS, BED_OPTIONS, BATH_OPTIONS constants
// buildHref(params) helper
// debounce with useEffect on draftQ
```

Update URL helper must delete keys when set to defaults (`all` / empty / any).

- [ ] **Step 4: Add CSS** for `.discoveryToolbar`, `.searchField`, `.suggestionList`, `.suggestionOption`, `.filterSelects`, keep `.filterButton` styles, min-height 2.75rem on controls.

- [ ] **Step 5: Wire page to use toolbar** (minimal in this task: swap `<PropertyFilters />` for `<PropertyDiscoveryToolbar />` inside `PropertyListing`; full discovery filtering in Task 4).

- [ ] **Step 6: Run listing tests**

Run: `npx vitest run tests/unit/properties/listing.test.ts`  
Expected: PASS for toolbar test (filter-by-type length tests may still use old server filter until Task 4)

- [ ] **Step 7: Commit**

```bash
git add components/property/PropertyDiscoveryToolbar.tsx components/property/PropertyFilters.tsx styles/property.module.css tests/unit/properties/listing.test.ts app/properties/page.tsx
git commit -m "feat: add properties discovery toolbar with search and filters"
```

---

### Task 4: Server listing uses discovery filters + empty copy

**Files:**
- Modify: `app/properties/page.tsx`
- Modify: `tests/unit/properties/listing.test.ts`

**Interfaces:**
- Consumes: `parseDiscoveryFilters`, `filterPropertiesByDiscovery`
- Produces: listing reflects all URL params; empty message when no matches

- [ ] **Step 1: Write failing tests**

```ts
test("listing applies q and price together", async () => {
  render(
    await PropertyListing({
      searchParams: Promise.resolve({
        q: "family",
        type: "house",
        price: "150-300",
      }),
    }),
  );

  const articles = screen.getAllByRole("article");
  expect(articles.length).toBeGreaterThan(0);
  expect(screen.getByText(/placeholder family house/i)).toBeInTheDocument();
});

test("listing shows no-match empty state", async () => {
  render(
    await PropertyListing({
      searchParams: Promise.resolve({ q: "zzzz-no-match" }),
    }),
  );

  expect(
    screen.getByText("No properties match your search."),
  ).toBeInTheDocument();
});
```

- [ ] **Step 2: Run — expect FAIL** on empty copy / combined filter

- [ ] **Step 3: Update `PropertyListing`**

```tsx
type PropertiesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function PropertyListing({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const filters = parseDiscoveryFilters(params);
  const properties = filterPropertiesByDiscovery(filters);

  return (
    <section className={styles.listing} aria-label="Property listings">
      <PropertyDiscoveryToolbar />
      {/* map added in Task 5 */}
      {properties.length > 0 ? (
        <div className={styles.grid}>
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>
          {filters.q || filters.type !== "all" || filters.price || filters.beds || filters.baths
            ? "No properties match your search."
            : "No properties available right now."}
        </p>
      )}
    </section>
  );
}
```

Remove unused `filterPropertiesByType` / `parsePropertyType` from this file.

- [ ] **Step 4: Fix house-filter length expectation** if still asserting `toHaveLength(3)` for `type=house` only — keep accurate to fixtures.

- [ ] **Step 5: Run** `npx vitest run tests/unit/properties/` — Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/properties/page.tsx tests/unit/properties/listing.test.ts
git commit -m "feat: apply discovery filters on properties listing"
```

---

### Task 5: Placeholder map + scroll-to-card

**Files:**
- Create: `components/property/PropertyMapPlaceholder.tsx`
- Modify: `components/property/PropertyCard.tsx`
- Modify: `app/properties/page.tsx`
- Modify: `styles/property.module.css`
- Test: `tests/unit/properties/listing.test.ts`

**Interfaces:**
- Consumes: `Property[]` (filtered), each with optional `mapPin`
- Produces: map region; pin activation focuses/scrolls to `#property-{id}`

- [ ] **Step 1: Add card anchor**

In `PropertyCard`:

```tsx
<article
  className={styles.card}
  id={`property-${property.id}`}
  data-property-id={property.id}
>
```

- [ ] **Step 2: Write test**

```ts
test("placeholder map lists a pin control per filtered property", async () => {
  render(
    await PropertyListing({
      searchParams: Promise.resolve({ type: "land" }),
    }),
  );

  expect(
    screen.getByRole("region", { name: /development placeholder map/i }),
  ).toBeInTheDocument();
  expect(
    screen.getAllByRole("button", { name: /view .* on listing/i }).length,
  ).toBe(2);
});
```

- [ ] **Step 3: Implement `PropertyMapPlaceholder`**

Client component:

```tsx
"use client";

import type { Property } from "@/lib/properties/types";
import styles from "@/styles/property.module.css";

export function PropertyMapPlaceholder({
  properties,
}: {
  properties: Property[];
}) {
  function focusCard(id: string) {
    const el = document.getElementById(`property-${id}`);
    if (!el) {
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    if (el instanceof HTMLElement) {
      el.focus({ preventScroll: true });
    }
  }

  return (
    <section
      className={styles.mapPanel}
      aria-label="Development placeholder map"
    >
      <p className={styles.mapNote}>Development placeholder map</p>
      <div className={styles.mapSurface} aria-hidden={properties.length === 0}>
        {properties.map((property) =>
          property.mapPin ? (
            <button
              key={property.id}
              type="button"
              className={styles.mapPin}
              style={{
                left: `${property.mapPin.x}%`,
                top: `${property.mapPin.y}%`,
              }}
              aria-label={`View ${property.title} on listing`}
              title={
                property.price !== null
                  ? `${property.title} — ${property.price}`
                  : property.title
              }
              onClick={() => focusCard(property.id)}
            />
          ) : null,
        )}
      </div>
      {properties.length === 0 ? (
        <p className={styles.mapEmpty}>No listings match.</p>
      ) : null}
    </section>
  );
}
```

Make cards focusable: `tabIndex={-1}` on the article so `focus()` works.

- [ ] **Step 4: Layout CSS**

```css
.discoveryLayout {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(16rem, 0.8fr);
  gap: var(--space-5);
  align-items: start;
  margin-bottom: var(--space-5);
}

.mapPanel {
  position: sticky;
  top: var(--space-4);
  padding: var(--space-3);
  background: var(--color-neutral);
  border: 1px solid var(--color-gold);
  border-radius: var(--space-1);
}

.mapSurface {
  position: relative;
  min-height: 18rem;
  background:
    linear-gradient(rgb(12 35 64 / 0.06), rgb(12 35 64 / 0.06)),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 23px,
      rgb(12 35 64 / 0.08) 24px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 23px,
      rgb(12 35 64 / 0.08) 24px
    );
  border-radius: var(--space-1);
}

.mapPin {
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  margin: 0;
  padding: 0;
  color: var(--color-white);
  background: var(--color-gold);
  border: 2px solid var(--color-navy);
  border-radius: 50% 50% 50% 0;
  transform: translate(-50%, -100%) rotate(-45deg);
  cursor: pointer;
}

@media (max-width: 48rem) {
  .discoveryLayout {
    grid-template-columns: 1fr;
  }

  .mapPanel {
    position: static;
  }
}
```

- [ ] **Step 5: Update page layout**

Inside `PropertyListing`, after toolbar:

```tsx
<div className={styles.discoveryLayout}>
  <div className={styles.grid}>
    {properties.map((property) => (
      <PropertyCard key={property.id} property={property} />
    ))}
  </div>
  <PropertyMapPlaceholder properties={properties} />
</div>
```

When empty, still show map with empty note + empty state text (toolbar remains).

- [ ] **Step 6: Run unit tests**

Run: `npx vitest run tests/unit/properties/`  
Expected: PASS

- [ ] **Step 7: Manual verify**

```bash
npm run build && npm run start -- --hostname 127.0.0.1 --port 3000
```

Open `/properties`, try `?q=ranch`, type Houses, price band, click a map pin, confirm card scrolls into view.

- [ ] **Step 8: Commit**

```bash
git add components/property/PropertyMapPlaceholder.tsx components/property/PropertyCard.tsx app/properties/page.tsx styles/property.module.css tests/unit/properties/listing.test.ts
git commit -m "feat: add development placeholder map pins for property discovery"
```

---

### Task 6: Polish, a11y smoke, and docs status

**Files:**
- Modify: `docs/superpowers/specs/2026-11-24-properties-search-filter-map-design.md` (status → Implemented)
- Optional: small e2e assert in `tests/e2e/` if an existing properties smoke exists; otherwise skip

- [ ] **Step 1: Keyboard smoke in unit test for suggestions** (optional but preferred)

Render toolbar with `q=sample` already in URL params mock; type into searchbox; assert listbox appears; ArrowDown + Enter calls `push` with suggestion.

- [ ] **Step 2: Run full related suite**

```bash
npx vitest run tests/unit/properties/
```

Expected: PASS

- [ ] **Step 3: Update spec status line** to `Status: Implemented`

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-11-24-properties-search-filter-map-design.md tests/
git commit -m "docs: mark properties discovery spec implemented"
```

---

## Spec coverage check

| Spec requirement | Task |
|---|---|
| Search field + type filters toolbar | 3 |
| Price / beds / baths | 3, 4 |
| URL params `q,type,price,beds,baths` | 1, 3, 4 |
| Autocomplete ≤6, keyboard | 3, 6 |
| AND filter logic + empty state | 1, 4 |
| mapPin on fixtures | 2 |
| Placeholder map + pins + scroll | 5 |
| Mobile stack / large controls | 3, 5 CSS |
| No live maps / no real geo claims | 5 copy + types |

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-11-24-properties-search-filter-map.md`. Two execution options:

**1. Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks  
**2. Inline Execution** — run tasks in this session with checkpoints  

Which approach?
