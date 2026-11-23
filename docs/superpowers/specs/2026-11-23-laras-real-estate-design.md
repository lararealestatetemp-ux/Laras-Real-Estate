# Laras Real Estate Multi-Page Website — Design Spec

**Date:** 2026-11-23  
**Status:** Approved for planning (pending user review of this document)  
**Sources of truth:** `laras_real_estate_multi_page_ai_implementation_prompt.txt`, homepage mockup, portfolio mockup  
**Original project specification / reference HTML:** Not supplied — treat as absent

## 1. Purpose

Build a simple, modern, production-oriented multi-page marketing site for Laras Real Estate covering property cash-sale inquiries, property listings, remodeling consultation, financing information (non-lender framing), and contact.

Reproduce the approved mockup **direction** (structure, hierarchy, professionalism), not pixel-for-pixel generated-image artifacts. Do not invent business facts.

## 2. Decisions Locked With Stakeholder

| Decision | Choice |
|---|---|
| Source of truth | Implementation prompt + mockups only |
| Stack | Next.js App Router + TypeScript |
| Architecture | Typed fixtures + email-only lead delivery (Approach 1) |
| Form delivery | Email only for now; storage later |
| Lead inbox | Env var `LEAD_INBOX_EMAIL` (unconfigured until set) |
| Property content at launch | Development fixtures with mock images, clearly labeled as placeholders |
| Click-budget UX | Max 2 clicks from Home to any primary task form; property inquiry uses card CTA + on-page detail form (option C) |

## 3. Architecture

- **Framework:** Next.js (App Router) + TypeScript
- **Layout:** Shared root layout with `SiteHeader` and `SiteFooter` on every public page
- **Styling:** Centralized CSS variables for the locked palette; no scattered hex values; no UI-library brand colors
- **Auth:** None for public visitors
- **Properties:** Typed TypeScript/JSON fixtures; listing and detail pages read from fixtures
- **Leads:** Client forms → Route Handlers → validate/sanitize → privacy-safe audit → email via Resend when configured
- **Deploy target:** Standard Next.js hosting (e.g. Vercel later); not required for initial implementation

### Public routes

| Path | Page |
|---|---|
| `/` | Home |
| `/sell` | Sell Your Property |
| `/properties` | Properties for Sale |
| `/properties/[slug]` | Property Details |
| `/remodeling` | Remodeling |
| `/financing` | Financing |
| `/contact` | Contact |

## 4. Design tokens (LOCKED)

```css
--color-navy: #0C2340;
--color-gold: #B08D57;
--color-neutral: #F6F6F6;
--color-white: #FFFFFF;
```

Rules:

- Use approved colors only.
- Hover/focus/disabled/active/border/overlay/validation states must stay within this palette unless accessibility requires an additional color — report before adding.
- Transparent overlays may use navy at reduced opacity for hero readability (implementation decision; not a new hue).
- Palette audit is part of regression.

### Visual direction

Modern, simple, professional, spacious, comfortable for older and less technical visitors. Generous whitespace, clear section boundaries, large readable headings, obvious buttons, predictable structure.

Avoid: dense dashboards, excessive animation, small controls, hidden nav, complex filters, decorative clutter, autoplay video, carousels that hide essentials, excessive modals, low-contrast text, unnecessary icons, competing CTAs.

Motion: minimal; honor `prefers-reduced-motion`.

## 5. Click-budget UX (older-visitor priority)

Primary tasks must be reachable with as few clicks as possible. **Do not count** typing into form fields. Count only navigation clicks to reach the place where the task can be completed (form visible or phone CTA usable).

### Rule

- **Maximum 2 clicks from Home** to any primary task form.
- **Header phone CTA** (`tel:936-208-3019`) remains visible on every page so calling is always available without hunting.
- Prefer **forms on the destination page** over forcing a hop to `/contact` when the user already has context (especially a specific property).
- Prefer large, clearly labeled buttons over icon-only actions.
- Keep primary task CTAs visible without relying on tiny or hidden controls.

### Target click budgets

| Goal | Target path | Max clicks from Home |
|---|---|---|
| Ask about a specific property | Properties → property (inquiry form on detail) **or** Properties → Ask About This Property on card | **2** |
| General question | Contact | **1** |
| Remodeling consultation | Remodeling (form on page) | **1** (+ scroll if needed) |
| Sell / cash-offer request | Sell (form on page) | **1** |
| Financing information / inquire | Financing (inquire CTA or short form on page) | **1–2** |
| Browse listings | Properties | **1** |
| Call the business | Header phone CTA | **1** (or 0 if using click-to-call awareness on landing) |

### Property inquiry (option C — locked)

1. **On each property card** (`/properties`): a clear **Ask About This Property** (or equivalent) control that goes straight to that property’s detail page anchored to the inquiry form (or opens the inquiry path with property context). This keeps “I already know I want to ask” at **2 clicks** and does not require reading the full detail first.
2. **On the property detail page**: an **on-page inquiry form** (not only a link to `/contact`) so “Contact About This Property” is completed without a third navigation hop. Prefill/associate internal lead context with the property slug/title server-side; do not put PII in the URL.
3. Retain a secondary text link to general Contact if useful, but the primary path must not depend on it.

Lead type for property-specific questions: `PROPERTY_BUYER` (internal).

## 6. Known vs unknown business content

### KNOWN (may display as facts)

- Business name: Laras Real Estate
- Phone: 936-208-3019
- Locked palette (above)
- Route/service categories: Sell, Properties, Remodeling, Financing, Contact
- Mockup-visible tagline/headings may be used when they appear in the supplied mockups (e.g. “Love Your Location. Reimagine Your Home.”)

### UNKNOWN (omit or mark as awaiting owner approval; never invent)

- Email address
- Office address / map location
- Business hours
- Facebook URL (prompt cites reference HTML that was not supplied)
- Real property inventory, prices, addresses, features
- Remodeling service list (structure with placeholders until owner supplies)
- Financing rates, APR, terms, down payment, credit requirements, partners, eligibility
- Testimonials, reviews, awards, stats, licenses, employee names, years in business
- Completed project claims using stock/generated imagery as company work

Development placeholders must be clearly labeled and easy to replace.

## 7. Pages

### Home `/`

1. Hero: brand, approved tagline, short factual intro, primary CTA Sell Your Property, secondary CTA View Available Properties
2. Four service cards: Sell for Cash, Properties for Sale, Remodeling, Financing
3. Business introduction: approved/factual copy only; imagery as labeled placeholder if not owner assets
4. Remodeling preview → `/remodeling`
5. Closing CTA → `/contact`

No fabricated claims (“number one,” “trusted by thousands,” etc.).

### Sell `/sell`

- Hero: “Sell Your Property for Cash”; explain houses, land, commercial using non-guarantee wording
- Desktop two-column: process/categories | seller form; single column on small screens
- Form fields: first name, last name, email, phone, property address, property type (House | Land | Commercial Building), asking price, general property information, additional comments
- Required indicators, plain-language validation, progress/success/safe failure states
- No sensitive fields beyond the approved set; no private values in URLs

### Properties `/properties`

- Hero + short description
- Simple filters: All | Houses | Land | Commercial
- Grid of property cards from fixtures, or clear empty state
- Card may show only available fields: image, title, price, type, location, attributes, owner-financing badge
- Card actions (both required for click-budget option C):
  - **View Details** → property detail page
  - **Ask About This Property** → property detail page inquiry section (hash/anchor to on-page form), with property context preserved without putting PII in the URL
- Omit missing fields cleanly; do not invent values

### Property details `/properties/[slug]`

1. Image gallery (no auto-advance; keyboard/touch friendly)
2. Title, price, financing indicator if applicable
3. Core facts, approved location, description, features
4. **On-page property inquiry form** (primary path for questions; lead type `PROPERTY_BUYER`; associate property slug/title server-side). Do not require navigating to `/contact` to ask about this property.
5. Apply for Financing CTA **only** when `ownerFinancingAvailable` is true (routes to `/financing`; no external URL supplied)
6. Optional secondary link to general Contact for non-property questions

Invalid/unavailable slug → not-found response.

### Remodeling `/remodeling`

- Hero + short description
- Services checklist/grid with **clearly marked development placeholders** until owner list arrives
- Before/after pairs: mock imagery labeled as placeholders, not as completed Laras work
- Free consultation form: first name, last name, phone, email, project type, project description

### Financing `/financing`

- Hero + short factual explanation that financing may be available for selected properties/projects
- Owner-financing / selective-project sections in plain language only
- Prefer an **on-page inquire path** (short form or clear Contact CTA that still meets the ≤2 click budget from Home)
- **Never** invent rates, APR, terms, credit scores, payments, eligibility, lender identity, or legal disclosures
- No external application URL supplied → do not invent one

### Contact `/contact`

- Display verified phone only (tel link)
- Do not invent email, address, hours, or map
- Form: first name, last name, email, phone, reason (Sell a Property | Property for Sale | Remodeling | Financing | General), message
- Omit Facebook until URL is supplied

## 8. Components

Reusable presentational components (business data kept outside):

- `SiteHeader`, `MobileNavigation`, `SiteFooter`
- `PageHero`
- `PrimaryButton`, `SecondaryButton`
- `ServiceCard`
- `PropertyCard`, `PropertyGallery`, `FinancingBadge`
- `PropertyInquiryForm` (on-page detail inquiry; reusable field pattern with property context)
- `FormField`, `FormSelect`, `FormTextarea`, `FormStatus`
- `BeforeAfterPair`
- `ContactCTA`

Header: logo/brand left, nav (Home, Sell Your Property, Properties for Sale, Remodeling, Financing, Contact), phone CTA right; current page indicated; compact; keyboard-accessible mobile menu exposing all six destinations.

Footer: brand, short tagline if approved, quick links, verified contact only, copyright. No invented email/address/hours/social.

## 9. Data model

### Property (fixture)

Support as applicable:

- `id`, `slug`, `title`, `propertyType` (`house` | `land` | `commercial`)
- `price`, `address` / `location`, `description`, `status`
- `ownerFinancingAvailable`
- `images[]`
- Optional residential fields: `bedrooms`, `bathrooms`, `squareFootage`
- Optional: `lotSize`, `features[]`

Do not require residential-only fields for land or commercial. Do not fabricate missing values. Fixtures must be marked as development placeholders.

### Lead types (internal only)

`SELLER` | `PROPERTY_BUYER` | `REMODELING` | `FINANCING` | `GENERAL`

Do not expose submission records via public APIs.

## 10. Forms, privacy, and email

### Pipeline

1. Client validation (labels required; not placeholder-only)
2. POST to Route Handler (HTTPS in production)
3. Server validation + sanitization
4. Spam protection (honeypot + rate limiting)
5. Privacy-safe audit event (`SELLER_FORM_SUBMITTED` | `CONSULTATION_FORM_SUBMITTED` | `CONTACT_FORM_SUBMITTED` | property-inquiry equivalent under `PROPERTY_BUYER`) with event type, timestamp, correlation id, success/failure — **no** names, phones, emails, messages, or full payloads in general logs
6. Send email if `LEAD_INBOX_EMAIL` and `RESEND_API_KEY` are set; otherwise return a safe “delivery not configured” failure without leaking internals
7. User-facing success / safe failure; preserve entered values after transient failure when safe

Property inquiry submissions include non-PII property identifiers (slug/id/title) for routing context only.

### Privacy rules

- Do not log complete form payloads
- Do not send form contents to analytics or ad pixels
- Do not place PII in URLs
- Keep credentials server-side only
- Never log secrets, tokens, cookies, or auth headers

### Environment variables (names only)

- `LEAD_INBOX_EMAIL`
- `RESEND_API_KEY`
- Optional rate-limit related vars if needed

## 11. Error handling

- User errors: plain language; what failed; no stack traces, DB, or internal API details
- Server: correlation ids for troubleshooting
- Preserve form input in the browser after transient failures when safe

## 12. SEO

Every public page:

- Unique title and meta description from approved/factual content
- Canonical URL
- Semantic headings; crawlable HTML; internal nav
- Open Graph where appropriate
- Property detail metadata from fixture data only

Do not: fake location landing pages, mass-generated SEO pages, fake review/rating structured data.

## 13. Accessibility

Target WCAG 2.2 AA: semantic HTML, one H1 per page, logical heading order, form labels, descriptive errors, keyboard navigation, visible focus, accessible mobile menu, sufficient contrast, alt text, decorative images excluded from assistive reading where appropriate, buttons vs links used correctly, no color-only interaction, comfortable touch targets, `prefers-reduced-motion`.

## 14. Responsive design

Mobile-first. Breakpoints by content behavior. Verify small mobile, large mobile, tablet, laptop, large desktop.

Rules: no horizontal scroll; forms single-column when needed; usable nav; easy tap targets; text no overflow; property cards reflow; galleries usable; footer stacks; never hide critical information solely for mobile.

## 15. Testing strategy

- Home: CTAs, service cards, nav, no unsupported claims, alt text, mobile, palette, keyboard focus
- Sell: valid/invalid/missing fields, property type, large/malicious input, duplicate behavior, network/server failure, keyboard/mobile, privacy logging
- Properties: zero/one/many, missing image/optional fields, long title/description, financing true/false, unavailable, mobile cards, detail navigation, **Ask About This Property** reaches detail inquiry in ≤2 clicks from Home
- Property detail: valid/invalid slug, single/multiple/broken images, financing CTAs, **on-page inquiry submit**, SEO from fixture data only
- Click-budget: verify primary tasks meet Section 5 budgets
- Remodeling: service placeholders, before/after pairing, consultation validation/submission, privacy
- Financing: CTA behavior, no unsupported financial claims, a11y/mobile
- Contact: phone link, form + reason routing, validation, spam, privacy
- Global: responsive audit, WCAG audit, privacy/security audit, palette audit, full regression

Do not claim a test passed unless executed.

## 16. Implementation order (summary)

1. Design tokens + global typography/spacing/buttons/forms
2. Header, mobile nav, footer
3. Route shells for all seven pages
4. Home → Sell UI → seller API/privacy → Properties list → Property detail → Remodeling → Financing → Contact
5. Responsive, a11y, privacy, palette, and regression audits
6. Structured implementation report (files, routes, env names, tests, UNKNOWN content, decisions needing approval)

## 17. Out of scope (for this phase)

- Lead database / CRM
- Admin UI for properties
- MLS integration
- Real email inbox configuration (env-ready only)
- Facebook / map / hours / office address
- Real owner-approved remodeling list and project photos
- Lender/application deep integration

## 18. Implementation decisions needing human approval later

- Whether navy-at-opacity overlays for hero text are acceptable (recommended; no new hue)
- Email provider locked to Resend for this phase (swap later if desired)
- Financing CTA from property detail routes to `/financing` until an external URL is supplied
- Exact placeholder copy for remodeling services list
- Exact card button labels (“Ask About This Property” vs shorter wording) if owner prefers different phrasing

## 19. Success criteria

Implementation is complete only when applicable acceptance checklist items from the implementation prompt pass: seven routes, working nav, locked palette, no invented business facts, form workflows (email when configured), property fixture behavior, **click-budget targets in Section 5**, mobile/keyboard, privacy, SEO from approved content, and executed regression/palette/privacy/a11y checks with honest results.
