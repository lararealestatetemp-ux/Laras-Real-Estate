# Laras Real Estate Multi-Page Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Laras Real Estate public marketing site (7 routes) with locked palette, click-budget UX (≤2 clicks to primary forms), typed property fixtures with mock images, and email-only lead forms behind privacy-safe Route Handlers.

**Architecture:** Next.js App Router + TypeScript. Shared layout (header/footer). CSS variables for the locked palette only (no Tailwind default brand colors). Properties from typed fixtures. Forms POST to Route Handlers that validate, rate-limit, audit without PII, and email via Resend when `LEAD_INBOX_EMAIL` + `RESEND_API_KEY` are set.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, CSS Modules + global CSS variables, Vitest + Testing Library, Playwright (smoke/click-budget), Resend (server-only), zod (validation)

**Spec:** `docs/superpowers/specs/2026-11-23-laras-real-estate-design.md`

## Global Constraints

- Palette LOCKED: `--color-navy: #0C2340`, `--color-gold: #B08D57`, `--color-neutral: #F6F6F6`, `--color-white: #FFFFFF` only (navy-at-opacity overlays allowed; no new hues without approval)
- Never invent: email, address, hours, Facebook URL, real listings, financing terms, remodeling services as facts, testimonials, stats
- Development fixtures/mock images must be clearly labeled as placeholders
- No public auth; no PII in logs/analytics/URLs; no complete form payloads in general logs
- Click-budget: max 2 clicks from Home to any primary task form; property inquiry = card CTA + on-page detail form
- Phone KNOWN: `936-208-3019`; business name: `Laras Real Estate`
- Tagline from mockup OK: `Love Your Location. Reimagine Your Home.`
- Env names only: `LEAD_INBOX_EMAIL`, `RESEND_API_KEY`
- Do not claim tests passed unless executed

---

## File Structure (create)

```
package.json
tsconfig.json
next.config.ts
.env.example
README.md
vitest.config.ts
playwright.config.ts
app/
  layout.tsx
  page.tsx                          # Home
  globals.css
  sell/page.tsx
  properties/page.tsx
  properties/[slug]/page.tsx
  remodeling/page.tsx
  financing/page.tsx
  contact/page.tsx
  not-found.tsx
  sitemap.ts
  robots.ts
  api/leads/seller/route.ts
  api/leads/property-inquiry/route.ts
  api/leads/consultation/route.ts
  api/leads/contact/route.ts
components/
  layout/SiteHeader.tsx
  layout/MobileNavigation.tsx
  layout/SiteFooter.tsx
  ui/PrimaryButton.tsx
  ui/SecondaryButton.tsx
  ui/PageHero.tsx
  ui/ServiceCard.tsx
  ui/ContactCTA.tsx
  ui/FinancingBadge.tsx
  forms/FormField.tsx
  forms/FormSelect.tsx
  forms/FormTextarea.tsx
  forms/FormStatus.tsx
  forms/SellerForm.tsx
  forms/PropertyInquiryForm.tsx
  forms/ConsultationForm.tsx
  forms/ContactForm.tsx
  property/PropertyCard.tsx
  property/PropertyGallery.tsx
  property/PropertyFilters.tsx
  remodeling/BeforeAfterPair.tsx
  remodeling/ServicesList.tsx
lib/
  tokens.ts
  constants.ts
  properties/types.ts
  properties/fixtures.ts
  properties/queries.ts
  leads/types.ts
  leads/validation.ts
  leads/sanitize.ts
  leads/rate-limit.ts
  leads/audit.ts
  leads/email.ts
  leads/submit.ts
  seo.ts
styles/
  forms.module.css
  layout.module.css
  property.module.css
  home.module.css
tests/
  unit/leads/validation.test.ts
  unit/leads/sanitize.test.ts
  unit/properties/queries.test.ts
  unit/palette/audit.test.ts
  api/leads-seller.test.ts
  api/leads-property-inquiry.test.ts
  api/leads-consultation.test.ts
  api/leads-contact.test.ts
  e2e/navigation.spec.ts
  e2e/click-budget.spec.ts
  e2e/forms-smoke.spec.ts
public/
  images/placeholders/.gitkeep
```

---

### Task 1: Scaffold Next.js app + locked design tokens

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/globals.css`, `app/layout.tsx`, `lib/tokens.ts`, `lib/constants.ts`, `.env.example`, `vitest.config.ts`, `README.md`
- Test: `tests/unit/palette/audit.test.ts`

**Interfaces:**
- Produces: `BUSINESS_NAME`, `BUSINESS_PHONE`, `BUSINESS_PHONE_TEL`, `TAGLINE` from `lib/constants.ts`; CSS variables in `globals.css`; `APPROVED_COLORS` from `lib/tokens.ts`

- [ ] **Step 1: Write the failing palette audit test**

```ts
// tests/unit/palette/audit.test.ts
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { APPROVED_HEX } from "@/lib/tokens";

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "docs") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(css|tsx|ts|jsx|js)$/.test(name)) acc.push(p);
  }
  return acc;
}

test("source files only use approved hex colors (or CSS variables)", () => {
  const root = join(process.cwd());
  const files = walk(root);
  const hex = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
  const offenders: string[] = [];
  for (const file of files) {
    if (file.includes("tokens.ts") || file.includes("audit.test.ts")) continue;
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(hex)) {
      const value = match[0].toUpperCase();
      const normalized =
        value.length === 4
          ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
          : value;
      if (!APPROVED_HEX.has(normalized)) {
        offenders.push(`${file}: ${match[0]}`);
      }
    }
  }
  expect(offenders).toEqual([]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/palette/audit.test.ts`
Expected: FAIL (missing `@/lib/tokens` or project not scaffolded)

- [ ] **Step 3: Scaffold the Next.js TypeScript app**

```bash
cd "/Users/mturcios/Downloads/Lara Realestate"
npx create-next-app@latest . --typescript --eslint --app --src-dir=false --import-alias="@/*" --turbopack --no-tailwind
```

If the directory is non-empty due to `docs/`, create in a temp folder and move app files into the repo root, keeping `docs/` and `.git`. Do **not** enable Tailwind (palette lock).

Install deps:

```bash
npm install zod resend
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event playwright @playwright/test
```

- [ ] **Step 4: Add tokens, constants, globals, env example**

```ts
// lib/tokens.ts
export const APPROVED_HEX = new Set([
  "#0C2340",
  "#B08D57",
  "#F6F6F6",
  "#FFFFFF",
]);

export const cssVar = {
  navy: "var(--color-navy)",
  gold: "var(--color-gold)",
  neutral: "var(--color-neutral)",
  white: "var(--color-white)",
} as const;
```

```ts
// lib/constants.ts
export const BUSINESS_NAME = "Laras Real Estate";
export const BUSINESS_PHONE = "936-208-3019";
export const BUSINESS_PHONE_TEL = "tel:936-208-3019";
export const TAGLINE = "Love Your Location. Reimagine Your Home.";
export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/sell", label: "Sell Your Property" },
  { href: "/properties", label: "Properties for Sale" },
  { href: "/remodeling", label: "Remodeling" },
  { href: "/financing", label: "Financing" },
  { href: "/contact", label: "Contact" },
] as const;
```

```css
/* app/globals.css */
:root {
  --color-navy: #0C2340;
  --color-gold: #B08D57;
  --color-neutral: #F6F6F6;
  --color-white: #FFFFFF;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2rem;
  --space-6: 3rem;
  --space-7: 4rem;
  --font-sans: "Source Sans 3", "Segoe UI", sans-serif;
  --font-display: "Libre Franklin", "Segoe UI", sans-serif;
  --focus-ring: 0 0 0 3px var(--color-gold);
  --max-width: 72rem;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  color: var(--color-navy);
  background: var(--color-white);
  font-family: var(--font-sans);
  line-height: 1.5;
}

body {
  margin: 0;
  min-height: 100vh;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: var(--color-navy);
}

:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```ts
// app/layout.tsx
import type { Metadata } from "next";
import { Source_Sans_3, Libre_Franklin } from "next/font/google";
import "./globals.css";
import { BUSINESS_NAME, TAGLINE } from "@/lib/constants";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
});

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-display-loaded",
});

export const metadata: Metadata = {
  title: {
    default: BUSINESS_NAME,
    template: `%s | ${BUSINESS_NAME}`,
  },
  description: TAGLINE,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${libreFranklin.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

```bash
# .env.example
LEAD_INBOX_EMAIL=
RESEND_API_KEY=
```

```ts
// vitest.config.ts
import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.ts", "tests/api/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 5: Run palette test to verify it passes**

Run: `npx vitest run tests/unit/palette/audit.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts app lib tests vitest.config.ts .env.example README.md
git commit -m "chore: scaffold Next.js app with locked design tokens"
```

---

### Task 2: Global header, mobile nav, footer

**Files:**
- Create: `components/layout/SiteHeader.tsx`, `components/layout/MobileNavigation.tsx`, `components/layout/SiteFooter.tsx`, `styles/layout.module.css`, `components/ui/PrimaryButton.tsx`, `components/ui/SecondaryButton.tsx`
- Modify: `app/layout.tsx`
- Test: `tests/e2e/navigation.spec.ts` (Playwright scaffold; full run after routes exist — write smoke that header renders via component test if routes incomplete)

**Interfaces:**
- Consumes: `NAV_ITEMS`, `BUSINESS_NAME`, `BUSINESS_PHONE`, `BUSINESS_PHONE_TEL`, `TAGLINE`
- Produces: `SiteHeader`, `SiteFooter` used by root layout

- [ ] **Step 1: Write failing unit test for nav item coverage**

```ts
// tests/unit/layout/nav.test.ts
import { NAV_ITEMS } from "@/lib/constants";

test("nav exposes all six destinations", () => {
  expect(NAV_ITEMS.map((i) => i.href)).toEqual([
    "/",
    "/sell",
    "/properties",
    "/remodeling",
    "/financing",
    "/contact",
  ]);
});
```

- [ ] **Step 2: Run test**

Run: `npx vitest run tests/unit/layout/nav.test.ts`
Expected: PASS once constants exist (already from Task 1); keep as regression guard

- [ ] **Step 3: Implement buttons + header + mobile nav + footer**

```tsx
// components/ui/PrimaryButton.tsx
import Link from "next/link";
import styles from "@/styles/buttons.module.css";

type Props =
  | { href: string; children: React.ReactNode; type?: never; disabled?: never }
  | {
      href?: never;
      children: React.ReactNode;
      type?: "button" | "submit";
      disabled?: boolean;
      onClick?: () => void;
    };

export function PrimaryButton(props: Props) {
  if (props.href) {
    return (
      <Link className={styles.primary} href={props.href}>
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={styles.primary}
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
```

```tsx
// components/ui/SecondaryButton.tsx
import Link from "next/link";
import styles from "@/styles/buttons.module.css";

type Props =
  | { href: string; children: React.ReactNode }
  | {
      href?: never;
      children: React.ReactNode;
      type?: "button" | "submit";
      disabled?: boolean;
      onClick?: () => void;
    };

export function SecondaryButton(props: Props) {
  if ("href" in props && props.href) {
    return (
      <Link className={styles.secondary} href={props.href}>
        {props.children}
      </Link>
    );
  }
  const buttonProps = props as {
    children: React.ReactNode;
    type?: "button" | "submit";
    disabled?: boolean;
    onClick?: () => void;
  };
  return (
    <button
      className={styles.secondary}
      type={buttonProps.type ?? "button"}
      disabled={buttonProps.disabled}
      onClick={buttonProps.onClick}
    >
      {buttonProps.children}
    </button>
  );
}
```

```css
/* styles/buttons.module.css */
.primary,
.secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.75rem 1.25rem;
  font: inherit;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0.25rem;
  cursor: pointer;
  border: 2px solid transparent;
}

.primary {
  background: var(--color-gold);
  color: var(--color-navy);
  border-color: var(--color-gold);
}

.primary:hover {
  filter: brightness(0.95);
}

.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.secondary {
  background: transparent;
  color: var(--color-navy);
  border-color: var(--color-navy);
}

.secondary:hover {
  background: var(--color-neutral);
}
```

Implement `SiteHeader` with desktop nav + phone CTA, `MobileNavigation` as a disclosure button (`aria-expanded`, `aria-controls`) listing all `NAV_ITEMS`, and `SiteFooter` with brand, tagline, quick links, phone only (no invented email/social).

Wire both into `app/layout.tsx` wrapping `{children}` in `<SiteHeader />` / `<main id="main">` / `<SiteFooter />`.

- [ ] **Step 4: Commit**

```bash
git add components styles app/layout.tsx tests/unit/layout
git commit -m "feat: add site header, mobile nav, and footer"
```

---

### Task 3: Route shells + SEO helpers for all seven pages

**Files:**
- Create: `app/page.tsx`, `app/sell/page.tsx`, `app/properties/page.tsx`, `app/properties/[slug]/page.tsx`, `app/remodeling/page.tsx`, `app/financing/page.tsx`, `app/contact/page.tsx`, `app/not-found.tsx`, `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`
- Test: `tests/e2e/navigation.spec.ts`

**Interfaces:**
- Produces: `buildPageMetadata({ title, description, path })` in `lib/seo.ts`

- [ ] **Step 1: Add SEO helper**

```ts
// lib/seo.ts
import type { Metadata } from "next";
import { BUSINESS_NAME } from "@/lib/constants";

export function buildPageMetadata(input: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = input.path;
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${input.title} | ${BUSINESS_NAME}`,
      description: input.description,
      url,
      siteName: BUSINESS_NAME,
      type: "website",
    },
  };
}
```

- [ ] **Step 2: Create each route with a single H1 shell**

Each page exports `metadata` via `buildPageMetadata` and renders `<h1>` + short factual placeholder body (no invented claims). Example sell page:

```tsx
// app/sell/page.tsx
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Sell Your Property",
  description:
    "Request a cash-purchase evaluation for a house, land, or commercial building with Laras Real Estate.",
  path: "/sell",
});

export default function SellPage() {
  return (
    <section>
      <h1>Sell Your Property for Cash</h1>
      <p>
        We evaluate houses, land, and commercial buildings. Use the form on
        this page to request information.
      </p>
    </section>
  );
}
```

Repeat for all routes. Home H1 includes brand. Property `[slug]` shell can call `notFound()` until fixtures exist in Task 4–5.

- [ ] **Step 3: Add Playwright navigation smoke**

```ts
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://127.0.0.1:3000" },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
  },
});
```

```ts
// tests/e2e/navigation.spec.ts
import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/sell",
  "/properties",
  "/remodeling",
  "/financing",
  "/contact",
];

test("all primary routes respond", async ({ page }) => {
  for (const route of routes) {
    const res = await page.goto(route);
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator("h1")).toBeVisible();
  }
});
```

- [ ] **Step 4: Run e2e**

Run: `npx playwright install && npx playwright test tests/e2e/navigation.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app lib/seo.ts playwright.config.ts tests/e2e
git commit -m "feat: add public route shells and SEO metadata helpers"
```

---

### Task 4: Property types, fixtures, queries

**Files:**
- Create: `lib/properties/types.ts`, `lib/properties/fixtures.ts`, `lib/properties/queries.ts`
- Test: `tests/unit/properties/queries.test.ts`

**Interfaces:**
- Produces:
  - `PropertyType = "house" | "land" | "commercial"`
  - `PropertyStatus = "available" | "unavailable"`
  - `Property` type
  - `getAllProperties()`, `getAvailableProperties()`, `getPropertyBySlug(slug)`, `filterPropertiesByType(type | "all")`

- [ ] **Step 1: Write failing query tests**

```ts
// tests/unit/properties/queries.test.ts
import {
  filterPropertiesByType,
  getAvailableProperties,
  getPropertyBySlug,
} from "@/lib/properties/queries";

test("returns available properties only by default listing helper", () => {
  const items = getAvailableProperties();
  expect(items.length).toBeGreaterThan(0);
  expect(items.every((p) => p.status === "available")).toBe(true);
});

test("getPropertyBySlug returns undefined for unknown slug", () => {
  expect(getPropertyBySlug("does-not-exist")).toBeUndefined();
});

test("filterPropertiesByType filters houses", () => {
  const houses = filterPropertiesByType("house");
  expect(houses.every((p) => p.propertyType === "house")).toBe(true);
});

test("fixtures are marked as development placeholders", () => {
  const items = getAvailableProperties();
  expect(items.every((p) => p.isDevelopmentPlaceholder === true)).toBe(true);
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `npx vitest run tests/unit/properties/queries.test.ts`

- [ ] **Step 3: Implement types, fixtures, queries**

```ts
// lib/properties/types.ts
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
  /** Always true for non-owner inventory in this phase */
  isDevelopmentPlaceholder: true;
};
```

Create 3–4 fixture properties covering house (financing true), land (no beds), commercial, and one unavailable. Use `https://picsum.photos/seed/<id>/1200/800` mock images. Titles/prices must read as placeholders in UI via `isDevelopmentPlaceholder` badge/note — do not present as real Laras inventory.

```ts
// lib/properties/queries.ts
import { properties } from "./fixtures";
import type { Property, PropertyType } from "./types";

export function getAllProperties(): Property[] {
  return properties;
}

export function getAvailableProperties(): Property[] {
  return properties.filter((p) => p.status === "available");
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function filterPropertiesByType(
  type: PropertyType | "all",
): Property[] {
  const available = getAvailableProperties();
  if (type === "all") return available;
  return available.filter((p) => p.propertyType === type);
}
```

- [ ] **Step 4: Run tests — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add lib/properties tests/unit/properties
git commit -m "feat: add typed property fixtures and query helpers"
```

---

### Task 5: Properties listing + PropertyCard (click-budget CTAs)

**Files:**
- Create: `components/property/PropertyCard.tsx`, `components/property/PropertyFilters.tsx`, `styles/property.module.css`, `components/ui/FinancingBadge.tsx`, `components/ui/PageHero.tsx`
- Modify: `app/properties/page.tsx`
- Test: extend unit tests; e2e click path covered in Task 12

**Interfaces:**
- Consumes: `filterPropertiesByType`, `Property`
- Produces: Card with `View Details` → `/properties/[slug]` and `Ask About This Property` → `/properties/[slug]#inquiry`

- [ ] **Step 1: Implement PropertyCard with two CTAs**

```tsx
// components/property/PropertyCard.tsx
import Link from "next/link";
import { FinancingBadge } from "@/components/ui/FinancingBadge";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import type { Property } from "@/lib/properties/types";
import styles from "@/styles/property.module.css";

export function PropertyCard({ property }: { property: Property }) {
  const href = `/properties/${property.slug}`;
  const inquiryHref = `${href}#inquiry`;
  const image = property.images[0];

  return (
    <article className={styles.card}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.src} alt={image.alt} width={600} height={400} />
      ) : null}
      <div className={styles.cardBody}>
        {property.isDevelopmentPlaceholder ? (
          <p className={styles.placeholderNote}>Development placeholder listing</p>
        ) : null}
        <h2 className={styles.cardTitle}>
          <Link href={href}>{property.title}</Link>
        </h2>
        {property.price != null ? (
          <p className={styles.price}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(property.price)}
          </p>
        ) : null}
        {property.location ? <p>{property.location}</p> : null}
        <p className={styles.type}>{property.propertyType}</p>
        {property.ownerFinancingAvailable ? <FinancingBadge /> : null}
        <div className={styles.cardActions}>
          <SecondaryButton href={href}>View Details</SecondaryButton>
          <PrimaryButton href={inquiryHref}>Ask About This Property</PrimaryButton>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Implement filters + listing page**

Client filter component using buttons (All / Houses / Land / Commercial) that set `?type=` search param or local state. Prefer URL `?type=house` for shareability without putting PII in URLs.

Empty state copy: `No properties available right now.` when filtered list is empty.

- [ ] **Step 3: Manual check**

Run: `npm run dev` and open `/properties`
Expected: cards show both CTAs; placeholder note visible; financing badge only when true

- [ ] **Step 4: Commit**

```bash
git add components/property components/ui app/properties styles/property.module.css
git commit -m "feat: add properties listing with dual card CTAs"
```

---

### Task 6: Property detail, gallery, on-page inquiry form UI

**Files:**
- Create: `components/property/PropertyGallery.tsx`, `components/forms/PropertyInquiryForm.tsx`, `components/forms/FormField.tsx`, `components/forms/FormSelect.tsx`, `components/forms/FormTextarea.tsx`, `components/forms/FormStatus.tsx`, `styles/forms.module.css`
- Modify: `app/properties/[slug]/page.tsx`
- Test: `tests/unit/properties/queries.test.ts` (existing); gallery keyboard behavior covered in e2e later

**Interfaces:**
- Produces: inquiry section `id="inquiry"`; form posts to `/api/leads/property-inquiry` (handler in Task 8)
- Form fields: firstName, lastName, email, phone, message; hidden/honeypot `company`; hidden `propertySlug`

- [ ] **Step 1: Implement gallery (no auto-advance)**

Primary image + thumbnail buttons that set selected index. Keyboard: thumbnails are `<button>`s. Lazy-load non-primary images with `loading="lazy"`.

- [ ] **Step 2: Implement shared form field components**

`FormField` / `FormSelect` / `FormTextarea` require visible `<label htmlFor>`, mark required with text `(required)`, show `aria-invalid` + error text with `role="alert"` when present.

`FormStatus` shows progress / success / failure messages.

- [ ] **Step 3: Implement PropertyInquiryForm client component**

Preserve field values on failure. Disable submit while pending. On success show confirmation. Include honeypot field visually hidden with `tabIndex={-1}` and `aria-hidden`.

- [ ] **Step 4: Wire detail page**

```tsx
// app/properties/[slug]/page.tsx (structure)
// - getPropertyBySlug; if missing or unavailable -> notFound()
// - metadata from property title/description only
// - gallery, facts (omit missing), features
// - Financing CTA to /financing only if ownerFinancingAvailable
// - <section id="inquiry"><h2>Ask About This Property</h2><PropertyInquiryForm propertySlug={...} propertyTitle={...} /></section>
// - optional secondary Link to /contact
```

Show development placeholder banner when `isDevelopmentPlaceholder`.

- [ ] **Step 5: Commit**

```bash
git add components/property components/forms app/properties/[slug] styles/forms.module.css
git commit -m "feat: add property detail gallery and on-page inquiry form"
```

---

### Task 7: Shared lead pipeline (validate, sanitize, rate-limit, audit, email)

**Files:**
- Create: `lib/leads/types.ts`, `lib/leads/validation.ts`, `lib/leads/sanitize.ts`, `lib/leads/rate-limit.ts`, `lib/leads/audit.ts`, `lib/leads/email.ts`, `lib/leads/submit.ts`
- Test: `tests/unit/leads/validation.test.ts`, `tests/unit/leads/sanitize.test.ts`

**Interfaces:**
- Produces:
  - `LeadType = "SELLER" | "PROPERTY_BUYER" | "REMODELING" | "FINANCING" | "GENERAL"`
  - `validateSellerInput`, `validatePropertyInquiryInput`, `validateConsultationInput`, `validateContactInput` (zod)
  - `sanitizeText(input, maxLen)`
  - `assertRateLimit(key)` → throws/returns limited
  - `writeAuditEvent({ type, correlationId, ok })` logs **only** operational metadata
  - `sendLeadEmail({ subject, text })` returns `{ ok: true } | { ok: false, reason: "not_configured" | "send_failed" }`
  - `submitLead(...)` orchestration used by route handlers

- [ ] **Step 1: Write validation + sanitize failing tests**

```ts
// tests/unit/leads/validation.test.ts
import { validateSellerInput } from "@/lib/leads/validation";

test("rejects invalid email", () => {
  const result = validateSellerInput({
    firstName: "Ada",
    lastName: "Lovelace",
    email: "not-an-email",
    phone: "936-555-0100",
    propertyAddress: "123 Main",
    propertyType: "house",
    askingPrice: "100000",
    generalInfo: "Test",
    comments: "",
    company: "",
  });
  expect(result.success).toBe(false);
});

test("rejects unsupported property type", () => {
  const result = validateSellerInput({
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    phone: "936-555-0100",
    propertyAddress: "123 Main",
    propertyType: "castle",
    askingPrice: "100000",
    generalInfo: "Test",
    comments: "",
    company: "",
  });
  expect(result.success).toBe(false);
});

test("accepts valid seller payload", () => {
  const result = validateSellerInput({
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    phone: "936-555-0100",
    propertyAddress: "123 Main",
    propertyType: "house",
    askingPrice: "100000",
    generalInfo: "Brick home",
    comments: "Flexible",
    company: "",
  });
  expect(result.success).toBe(true);
});
```

```ts
// tests/unit/leads/sanitize.test.ts
import { sanitizeText } from "@/lib/leads/sanitize";

test("strips control characters and trims", () => {
  expect(sanitizeText("  hello\u0000world  ", 100)).toBe("helloworld");
});

test("enforces max length", () => {
  expect(sanitizeText("abcdef", 3)).toBe("abc");
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement pipeline modules**

Validation: zod schemas per lead type. Phone: require 10+ digits after stripping non-digits (US-friendly). Property inquiry requires `propertySlug` string matching `/^[a-z0-9-]+$/`.

Sanitize: strip null bytes/control chars; max lengths (e.g. names 80, message 2000, address 200).

Rate limit: in-memory Map keyed by `${ip}:${route}` with window (e.g. 10 requests / 10 minutes). Fine for single-node; document limitation in README.

Audit:

```ts
export function writeAuditEvent(event: {
  type:
    | "SELLER_FORM_SUBMITTED"
    | "PROPERTY_INQUIRY_SUBMITTED"
    | "CONSULTATION_FORM_SUBMITTED"
    | "CONTACT_FORM_SUBMITTED";
  correlationId: string;
  ok: boolean;
}) {
  console.info(
    JSON.stringify({
      kind: "audit",
      type: event.type,
      correlationId: event.correlationId,
      ok: event.ok,
      ts: new Date().toISOString(),
    }),
  );
}
```

Email (`lib/leads/email.ts`): if missing env → `{ ok: false, reason: "not_configured" }`; else Resend send; never log body.

`submitLead`: if honeypot `company` non-empty → fake success (no email, audit ok spam suppressed). Else validate → rate limit → sanitize → email → audit.

- [ ] **Step 4: Run unit tests — PASS**

- [ ] **Step 5: Commit**

```bash
git add lib/leads tests/unit/leads
git commit -m "feat: add privacy-safe lead validation and email pipeline"
```

---

### Task 8: Lead API routes + wire property inquiry + seller/contact/consultation forms

**Files:**
- Create: `app/api/leads/seller/route.ts`, `app/api/leads/property-inquiry/route.ts`, `app/api/leads/consultation/route.ts`, `app/api/leads/contact/route.ts`
- Create: `components/forms/SellerForm.tsx`, `components/forms/ConsultationForm.tsx`, `components/forms/ContactForm.tsx`
- Modify: `app/sell/page.tsx`, `app/remodeling/page.tsx`, `app/contact/page.tsx`, `components/forms/PropertyInquiryForm.tsx`
- Test: `tests/api/leads-seller.test.ts`, `tests/api/leads-property-inquiry.test.ts`, `tests/api/leads-consultation.test.ts`, `tests/api/leads-contact.test.ts`

**Interfaces:**
- POST JSON → `{ ok: true, correlationId }` or `{ ok: false, correlationId, error: string, fields?: Record<string,string> }`
- Never return stack traces or env details

- [ ] **Step 1: Write API tests using request handlers**

```ts
// tests/api/leads-seller.test.ts
import { POST } from "@/app/api/leads/seller/route";

function req(body: unknown) {
  return new Request("http://localhost/api/leads/seller", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "1.2.3.4" },
    body: JSON.stringify(body),
  });
}

test("invalid email returns 400 without leaking internals", async () => {
  const res = await POST(
    req({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "bad",
      phone: "9365550100",
      propertyAddress: "123 Main",
      propertyType: "house",
      askingPrice: "1",
      generalInfo: "x",
      comments: "",
      company: "",
    }) as never,
  );
  expect(res.status).toBe(400);
  const json = await res.json();
  expect(json.ok).toBe(false);
  expect(JSON.stringify(json)).not.toMatch(/stack|RESEND|LEAD_INBOX/i);
});

test("honeypot returns success without requiring email config", async () => {
  const res = await POST(
    req({
      firstName: "Bot",
      lastName: "Bot",
      email: "bot@example.com",
      phone: "9365550100",
      propertyAddress: "123 Main",
      propertyType: "land",
      askingPrice: "1",
      generalInfo: "x",
      comments: "",
      company: "spam",
    }) as never,
  );
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json.ok).toBe(true);
});
```

Mirror patterns for other lead routes (property inquiry requires slug; contact requires reason enum).

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement route handlers**

Each handler: parse JSON → `submitLead` → map `not_configured` to user message: `We could not send your message right now. Please call 936-208-3019.` (factual; uses known phone).

- [ ] **Step 4: Implement SellerForm, ConsultationForm, ContactForm; wire pages**

Sell page: two-column layout (process copy | form). Remodeling: form section id for scroll. Contact: phone link + form with reason select:
`sell | property | remodeling | financing | general` mapped to lead types.

- [ ] **Step 5: Run API tests — PASS**

- [ ] **Step 6: Commit**

```bash
git add app/api components/forms app/sell app/remodeling app/contact
git commit -m "feat: add lead API routes and wire public forms"
```

---

### Task 9: Home page

**Files:**
- Create: `components/ui/ServiceCard.tsx`, `components/ui/ContactCTA.tsx`, `styles/home.module.css`
- Modify: `app/page.tsx`
- Test: e2e navigation already covers `/`; add assertions in click-budget later

**Interfaces:**
- Home sections per spec: Hero → 4 service cards → intro → remodeling preview CTA → closing Contact CTA
- Primary CTA → `/sell`; Secondary → `/properties`

- [ ] **Step 1: Implement Home sections using only approved copy**

Hero:
- Brand / H1: Laras Real Estate
- Tagline: Love Your Location. Reimagine Your Home.
- Supporting: Real solutions for buyers, sellers, and investors.
- CTAs: Sell Your Property; View Available Properties

Service cards link to `/sell`, `/properties`, `/remodeling`, `/financing` with short factual blurbs (no invented claims).

Intro: factual “Building Better Opportunities” style section without “local expertise” / social proof unless approved (omit unsupported icons/claims).

Remodeling preview: labeled placeholder imagery + CTA to `/remodeling`.

Closing: ContactCTA → `/contact`.

- [ ] **Step 2: Visual check at mobile + desktop**

Run: `npm run dev`
Expected: no horizontal scroll; header phone visible; CTAs obvious

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx components/ui styles/home.module.css
git commit -m "feat: implement home page sections and service cards"
```

---

### Task 10: Remodeling page (placeholder services + before/after + consultation)

**Files:**
- Create: `components/remodeling/ServicesList.tsx`, `components/remodeling/BeforeAfterPair.tsx`
- Modify: `app/remodeling/page.tsx`
- Data: `lib/remodeling/placeholders.ts`

**Interfaces:**
- Services marked `awaitingOwnerApproval: true` with visible “Awaiting owner approval” label
- Before/after pairs labeled “Placeholder imagery — not completed Laras Real Estate projects”

- [ ] **Step 1: Create placeholder data module**

```ts
// lib/remodeling/placeholders.ts
export const REMODELING_SERVICE_PLACEHOLDERS = [
  { id: "kitchen", label: "Kitchen remodeling (placeholder)" },
  { id: "bath", label: "Bathroom remodeling (placeholder)" },
  { id: "flooring", label: "Flooring (placeholder)" },
] as const;

export const BEFORE_AFTER_PLACEHOLDERS = [
  {
    id: "demo-1",
    before: { src: "https://picsum.photos/seed/before1/800/600", alt: "Placeholder before image" },
    after: { src: "https://picsum.photos/seed/after1/800/600", alt: "Placeholder after image" },
  },
] as const;
```

- [ ] **Step 2: Build page with ServicesList, BeforeAfterPair, ConsultationForm**

- [ ] **Step 3: Commit**

```bash
git add lib/remodeling components/remodeling app/remodeling
git commit -m "feat: add remodeling page with labeled placeholder content"
```

---

### Task 11: Financing page (no invented terms) + Contact polish

**Files:**
- Modify: `app/financing/page.tsx`, `app/contact/page.tsx`
- Create: optional short `FinancingInquiryForm` reusing contact fields with reason locked to financing OR on-page CTA to contact form section — prefer **short on-page form** posting to `/api/leads/contact` with `reason: "financing"` to keep ≤2 clicks

- [ ] **Step 1: Financing copy audit while implementing**

Allowed: financing may be available on selected properties/projects; owner financing on select listings; contact to ask.
Forbidden strings to grep after implementation: `APR`, `interest rate`, `%`, `credit score`, `down payment`, `monthly payment`, `approved`, `guaranteed`.

- [ ] **Step 2: Contact page shows only phone + form; no map/hours/email/Facebook**

- [ ] **Step 3: Grep for forbidden financing claims**

```bash
rg -i "APR|interest rate|credit score|down payment|monthly payment" app/financing components || true
```

Expected: no matches in user-facing copy

- [ ] **Step 4: Commit**

```bash
git add app/financing app/contact
git commit -m "feat: add financing and contact pages without invented claims"
```

---

### Task 12: Click-budget + forms smoke e2e + final audits

**Files:**
- Create: `tests/e2e/click-budget.spec.ts`, `tests/e2e/forms-smoke.spec.ts`
- Modify: README with setup, env vars (names only), placeholder content notes
- Run: palette audit, unit tests, playwright

**Interfaces:**
- None new

- [ ] **Step 1: Write click-budget Playwright tests**

```ts
// tests/e2e/click-budget.spec.ts
import { test, expect } from "@playwright/test";

test("property inquiry reachable in 2 clicks from home via card CTA", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Properties for Sale" }).first().click();
  await page.getByRole("link", { name: "Ask About This Property" }).first().click();
  await expect(page.locator("#inquiry")).toBeVisible();
  await expect(page.getByRole("button", { name: /send|submit|ask/i })).toBeVisible();
});

test("sell form reachable in 1 click from home", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Sell Your Property" }).first().click();
  await expect(page.getByRole("button", { name: /submit/i })).toBeVisible();
});

test("remodeling consultation reachable in 1 click from home", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Remodeling" }).first().click();
  await expect(page.getByRole("button", { name: /submit|request|send/i })).toBeVisible();
});

test("contact form reachable in 1 click from home", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Contact" }).first().click();
  await expect(page.getByRole("button", { name: /send|submit/i })).toBeVisible();
});
```

- [ ] **Step 2: Forms smoke — validation errors visible; honeypot not required for users**

Submit empty seller form → expect visible field errors, focusable messages.

- [ ] **Step 3: Run full suite**

```bash
npx vitest run
npx playwright test
npx vitest run tests/unit/palette/audit.test.ts
```

Expected: all PASS. If email not configured, API success path for real submits may return failure message — assert that path returns safe message and still audits.

- [ ] **Step 4: Accessibility spot-check**

Manually verify: one H1/page, tab through header + mobile menu, form labels present, focus visible. Fix any blockers found before claiming done.

- [ ] **Step 5: Update README**

Document: how to run, env vars (names only), that fixtures are placeholders, that leads email when configured, UNKNOWN content list pointing to design spec.

- [ ] **Step 6: Commit**

```bash
git add tests/e2e README.md
git commit -m "test: add click-budget e2e coverage and finalize audits"
```

- [ ] **Step 7: Write implementation report in the PR/chat**

Follow the prompt’s FINAL AI AGENT REPORT structure (files, routes, env names, tests executed/results, UNKNOWN content, decisions needing approval). Do not claim unrun tests passed.

---

## Self-Review (plan vs spec)

| Spec area | Task coverage |
|---|---|
| Locked palette + audit | Task 1, 12 |
| Header/footer/mobile nav | Task 2 |
| Seven routes + SEO | Task 3, 9–11 |
| Home sections | Task 9 |
| Sell form + privacy API | Tasks 7–8 |
| Properties list/filters/cards | Task 5 |
| Property detail + gallery + financing conditional CTA | Task 6 |
| Click-budget option C | Tasks 5–6, 12 |
| Remodeling placeholders + consultation | Task 10 |
| Financing no invented terms | Task 11 |
| Contact phone-only + form | Task 11, 8 |
| Lead types + audit + email env | Task 7–8 |
| Responsive / a11y / regression | Task 12 |
| UNKNOWN content handling | Tasks 4, 10, 11 + report |

No TBD placeholders remain in tasks. Types aligned: `Property`, `LeadType`, inquiry `#inquiry` anchor, env `LEAD_INBOX_EMAIL` / `RESEND_API_KEY`.
