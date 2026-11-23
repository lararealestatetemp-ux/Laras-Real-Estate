# Task 12 Report

## Status
Complete (with concerns below).

## Changes
- `tests/e2e/click-budget.spec.ts` (new): property inquiry in 2 clicks (Home -> Properties for Sale -> card "Ask About This Property" -> `#inquiry` + submit button); sell, remodeling, contact each 1 click from home. Uses exact link names and URL assertions.
- `tests/e2e/forms-smoke.spec.ts` (new): empty seller form shows `role=alert` errors for all 8 required fields, with `aria-invalid` and `aria-describedby` wiring; honeypot is `aria-hidden`, `tabindex=-1`, not required; Tab order from first field reaches next field.
- `components/forms/*Form.tsx` (5 forms): added `noValidate`. Native `required` blocked submit, so the server's accessible field errors never appeared for an empty form.
- `playwright.config.ts`: e2e now runs `npm run build && npm run start` on port 3100 (production output, no collision with dev on 3000). Reason: in `next dev` a client-side `<Link href="...#inquiry">` drops the hash and does not scroll; production is correct.
- `tests/e2e/navigation.spec.ts`: the `/properties/unseeded` test asserted HTTP 404, which could not pass (see Concerns). Now asserts not-found UI + `noindex` meta.
- `README.md`: setup, env var names only, routes, quality-check commands, placeholder content, UNKNOWN content pointer to design spec section 6.
- `.gitignore`: `/test-results/`, `/playwright-report/`, `/blob-report/`, `/playwright/.cache/`, `/AGENTS.md`.

## Verification (all executed)
- `npx vitest run`: 15 files, 69 tests passed.
- `npx playwright test`: 9 passed (4 click-budget, 2 forms-smoke, 3 navigation).
- `npx vitest run tests/unit/palette/audit.test.ts`: 5 passed.
- `npm run lint`: clean. `npx tsc --noEmit`: clean. `npm run build`: passed.
- Chromium installed (v1255). Inside the Cursor sandbox the browser path pointed at a missing x64 build and launches failed; running unsandboxed worked. Not a project issue.

## Accessibility spot-check
Automated only: one H1 on every route (navigation test), labelled fields, error messages linked by `aria-describedby`. NOT done: manual screen-reader pass, mobile-menu keyboard walk-through, visual focus-ring review.

## Concerns
1. `/properties/<unknown>` returns HTTP 200 (with not-found UI and `noindex`), not 404. Cause: `cacheComponents: true` streams the shell first; `dynamicParams` is incompatible with cacheComponents. A true 404 would need a `proxy.ts` slug check. Needs controller decision.
2. `noValidate` on all forms changes UX: validation is server-side only (no client pre-check, no focus move to first error). Consider client-side validation + focus management.
3. Dev-mode hash-link quirk (above) affects local `npm run dev` only.
4. Email delivery success path not e2e tested (no env configured); only validation path covered.

---

# FINAL AI AGENT REPORT (draft for controller)

## Files / areas
- App routes in `app/`; components in `components/{forms,layout,property,remodeling,ui}`; logic in `lib/{leads,properties,remodeling}`; styles in `styles/`, tokens in `lib/tokens.ts`, `app/globals.css`.
- Tests: `tests/unit/**` (vitest), `tests/e2e/*.spec.ts` (Playwright). Specs/plan in `docs/superpowers/`.

## Routes
Pages: `/`, `/sell`, `/properties`, `/properties/[slug]` (3 placeholder slugs), `/remodeling`, `/financing`, `/contact`, custom not-found. Other: `/sitemap.xml`, `/robots.txt`, `/icon.svg`.
API (POST): `/api/leads/seller`, `/api/leads/property-inquiry`, `/api/leads/consultation`, `/api/leads/contact`.

## Env var names
`LEAD_INBOX_EMAIL`, `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL` (optional). Values not recorded anywhere in the repo or report.

## Tests executed (results)
vitest 69/69 pass; Playwright 9/9 pass (production build); palette audit 5/5 pass; lint, tsc, build clean. Real email send was NOT tested (no credentials); manual a11y/screen-reader and real-device responsive checks NOT performed.

## UNKNOWN content (omitted or labeled, not invented)
Email address, office address/map, business hours, Facebook URL, real property inventory/prices/addresses, remodeling service list, financing rates/terms/eligibility/partners, testimonials/reviews/awards/stats/licenses/staff names/years in business, completed-project claims. Placeholders: `lib/properties/fixtures.ts`, `lib/remodeling/placeholders.ts`, home remodeling image area.

## Decisions needing approval
1. Accept HTTP 200 + noindex for unknown property slugs, or add `proxy.ts` for real 404s.
2. Keep server-only validation (`noValidate`) or add client-side validation with focus-to-first-error.
3. Replace in-memory rate limiter with shared storage before multi-instance deploy.
4. Provide real owner content to replace placeholders; configure Resend sender domain (currently `onboarding@resend.dev`).
5. Playwright now uses production build on port 3100 (slower start, higher fidelity).

---

## Important Finding Fix — Validation Focus

- Updated `useLeadForm` to focus the first control named in server `fieldErrors`; non-field failures fall back to the form status region.
- Added a unique ID and `tabindex="-1"` to error `FormStatus` messages across all lead forms.
- Replaced the manual-focus smoke assertion with an empty seller submission that verifies the browser's resulting active element.
- Verification: `npx vitest run` (69 passed), `npx tsc --noEmit` (passed), and targeted Playwright forms-smoke + click-budget (6 passed).
