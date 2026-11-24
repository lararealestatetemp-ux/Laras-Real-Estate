# Properties Search, Filters, Autocomplete & Placeholder Map — Design Spec

**Date:** 2026-11-24  
**Status:** Implemented

**Page:** `/properties`  
**Sources:** Implementation prompt (simple type filters; no MLS portal), portfolio mockup (search + type filters + grid), stakeholder choices (option B + expanded scope + placeholder map A)

## 1. Purpose

Improve property discovery on the Properties for Sale page so visitors can search, narrow by type/price/beds/baths, get lightweight autocomplete suggestions, and see a labeled development-placeholder map of the currently visible listings—without turning the site into an MLS portal or inventing real geography.

## 2. Decisions Locked

| Decision | Choice |
|---|---|
| Search + type filters UI | Combined toolbar (mockup-aligned) |
| Extra filters | Price ranges, beds minimum, baths minimum |
| Autocomplete | Yes — suggestions from title/location |
| Map | Static development-placeholder map with pins for filtered listings; fake fixture coords for layout only |
| Owner-financing filter | Not included unless requested later |
| Live map providers | Out of scope (no Google/Mapbox) |
| MLS / saved searches | Out of scope |

## 3. UI Layout

### Desktop

1. Existing page media hero (unchanged).
2. **Discovery toolbar** above the listing grid:
   - Search text field (full-width or dominant left).
   - Type filter buttons: All / Houses / Land / Commercial.
   - Secondary filter controls (selects or large button groups):
     - Price: Any / Under $150k / $150k–$300k / $300k–$450k / $450k+
     - Beds: Any / 2+ / 3+ / 4+
     - Baths: Any / 1+ / 2+ / 3+
3. **Two-column content** (when width allows):
   - Main: property card grid (existing cards).
   - Side or top-adjacent: placeholder map panel.
4. Empty state when zero matches.

### Mobile

- Toolbar stacks: search → type buttons → price/beds/baths.
- Map stacks above or below the grid (prefer above the grid so pins are discoverable).
- Touch targets remain ≥ 2.75rem; no tiny controls.

### Accessibility

- Search has a visible `<label>` (may be visually associated; not placeholder-only).
- Autocomplete uses a listbox pattern (`aria-expanded`, `aria-controls`, `aria-activedescendant` or equivalent).
- Type filters keep `aria-pressed`.
- Map region has an accessible name and a clear “Development placeholder map” note; pins are focusable buttons/links that move focus to the related card.
- Honor existing palette (navy / gold / neutral / white only).

## 4. URL State

All discovery state is URL-driven so refresh and share work:

| Param | Values | Default |
|---|---|---|
| `q` | free text | absent = no text filter |
| `type` | `house` \| `land` \| `commercial` | absent = all |
| `price` | `under-150` \| `150-300` \| `300-450` \| `450-plus` | absent = any |
| `beds` | `2` \| `3` \| `4` | absent = any (minimum) |
| `baths` | `1` \| `2` \| `3` | absent = any (minimum) |

Invalid param values are ignored (treat as default).

## 5. Filtering & Search Behavior

### Base set

Only `status === "available"` properties (existing `getAvailableProperties` / `filterPropertiesByType` behavior).

### Type

Same as today via `type`.

### Text search (`q`)

Case-insensitive match if the query appears in any of:

- title  
- location (when present)  
- propertyType string  
- description  

Empty/`q` cleared → no text filter.

### Autocomplete

- While `q` has ≥ 1 non-whitespace character, show up to 6 suggestions.
- Suggestion sources: distinct matching **titles** and **locations** from the currently type-filtered available set (price/beds/baths may also constrain the suggestion pool so suggestions stay relevant).
- Keyboard: ArrowUp/ArrowDown move highlight; Enter applies highlighted suggestion into `q` and closes; Escape closes without changing URL if cancelled mid-nav.
- Clicking a suggestion sets `q` to that string and closes the list.
- Debounce typing before pushing URL updates (~250–300ms); Enter submits immediately.

### Price

Applied to `price` number fields only. Properties with `price === null` are excluded when a price band is active.

| Token | Rule |
|---|---|
| `under-150` | price &lt; 150_000 |
| `150-300` | 150_000 ≤ price &lt; 300_000 |
| `300-450` | 300_000 ≤ price &lt; 450_000 |
| `450-plus` | price ≥ 450_000 |

### Beds / baths

- Interpret as **minimum** counts.
- When `beds` or `baths` is set, only properties that **have** that numeric field and meet the minimum are included (land/commercial without bedrooms/bathrooms drop out when those filters are active).
- When beds/baths params are absent, land/commercial remain eligible under other filters.

### Combined logic

AND across all active filters (type ∩ text ∩ price ∩ beds ∩ baths).

### Empty state

Show a clear message, e.g. “No properties match your search.” Keep filters visible so the visitor can reset.

## 6. Placeholder Map

### Content

- Static visual panel (image and/or CSS “map” surface) labeled **Development placeholder map**.
- Must not imply real MLS coverage or accurate geography.
- Fixture schema gains optional development-only layout fields, e.g. `mapPin: { x: number; y: number }` as percentages (0–100) within the map panel—not lat/lng, not marketed as real coords.

### Pins

- Render one pin per property in the **current filtered result set**.
- Pin label/tooltip uses property title (and price when present).
- Activating a pin scrolls to / highlights the matching card (`id` on card or `data-property-id`).

### Empty map

- If zero results, show the map surface with no pins and a short note that no listings match.

## 7. Data / Code Touchpoints (expected)

- `lib/properties/types.ts` — optional `mapPin` on Property.
- `lib/properties/fixtures.ts` — assign placeholder `mapPin` for available listings; keep `isDevelopmentPlaceholder: true`.
- `lib/properties/queries.ts` — extend filtering helpers for `q`, price, beds, baths (pure functions, unit-tested).
- `components/property/PropertyFilters.tsx` (or split into search + filters) — toolbar UI + URL updates.
- New: autocomplete listbox component/section.
- New: `PropertyMapPlaceholder` (or similar) client component for pins + scroll-to-card.
- `app/properties/page.tsx` — pass searchParams into listing; layout for map + grid.
- `styles/property.module.css` — toolbar, autocomplete, map panel.
- Tests: query helpers; listing with combined filters; empty state; autocomplete keyboard smoke if practical; map pin count vs filtered set.

## 8. Non-Goals

- Google Maps / Mapbox / geocoding APIs  
- Real addresses or true lat/lng presented as factual  
- Complex MLS-style faceted search, sorting beyond current order, saved searches  
- Inventing business facts beyond labeled development placeholders  

## 9. Success Criteria

- Visitor can search and filter with shareable URLs.
- Type + price + beds + baths + text work together.
- Autocomplete is keyboard-accessible and limited to ~6 items.
- Placeholder map shows pins only for filtered listings and is clearly labeled as development placeholder.
- Empty state is obvious; mobile remains usable for older visitors (large controls, stacked layout).
- Palette and “no invented real geography” rules are respected.
