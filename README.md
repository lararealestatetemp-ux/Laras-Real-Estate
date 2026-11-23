# Laras Real Estate

Multi-page marketing site for Laras Real Estate, built with Next.js (App Router,
Cache Components) and TypeScript.

> This project uses a Next.js version with breaking changes. See `AGENTS.md` and
> `node_modules/next/dist/docs/` before changing framework-level code.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in values (never commit .env.local)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables (names only)

| Name | Purpose |
| --- | --- |
| `LEAD_INBOX_EMAIL` | Inbox that receives lead emails |
| `RESEND_API_KEY` | Resend API key used to send lead emails |
| `NEXT_PUBLIC_SITE_URL` | Optional. Public site origin for `sitemap.xml` / `robots.txt` (defaults to `http://localhost:3000`) |

Leads are emailed only when `LEAD_INBOX_EMAIL` and `RESEND_API_KEY` are both
set. Without them the lead API returns a safe message that points visitors to
the business phone number and no email is sent. Submissions are rate-limited in
memory to 10 requests per IP/route per 10 minutes. This limiter is
process-local and must be replaced with shared storage before deploying across
multiple server instances.

## Routes

`/`, `/sell`, `/properties`, `/properties/[slug]`, `/remodeling`, `/financing`,
`/contact`, plus `/api/leads/{seller,property-inquiry,consultation,contact}`,
`/sitemap.xml`, `/robots.txt`.

## Quality checks

```bash
npx vitest run                                   # unit/component tests
npx vitest run tests/unit/palette/audit.test.ts  # locked-palette audit
npm run lint
npx tsc --noEmit
npx playwright install chromium                  # first run only
npx playwright test                              # e2e
```

Playwright builds the site and serves it with `next start` on port 3100
(`playwright.config.ts`), so e2e runs against production output and does not
collide with a dev server on port 3000. In `next dev`, client-side navigation
to a `#hash` link may drop the hash; production behaves correctly.

## Placeholder content

Everything below is development placeholder data, clearly labeled in the UI and
meant to be replaced with owner-approved content:

- Property listings: `lib/properties/fixtures.ts` (stock images, sample
  addresses/prices, `isDevelopmentPlaceholder: true`)
- Remodeling services and before/after imagery: `lib/remodeling/placeholders.ts`
- Home page remodeling image area

Only the business name, phone number (936-208-3019), locked palette, route
categories, and the tagline are treated as known facts.

## UNKNOWN content

Business facts the owner has not supplied are omitted or labeled, never invented:
email address, office address/map, business hours, Facebook URL, real property
inventory, remodeling service list, financing rates/terms/eligibility,
testimonials/awards/stats/licenses/staff names, and any completed-project claims.
See section 6 of
[`docs/superpowers/specs/2026-11-23-laras-real-estate-design.md`](docs/superpowers/specs/2026-11-23-laras-real-estate-design.md)
for the authoritative list.
