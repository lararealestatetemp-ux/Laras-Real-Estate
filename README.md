# Laras Real Estate

Multi-page marketing site for Laras Real Estate, built with Next.js and
TypeScript.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Quality checks

```bash
npx vitest run
npm run lint
npm run build
```

## Lead delivery

Lead email delivery requires `LEAD_INBOX_EMAIL` and `RESEND_API_KEY`.
Submissions are rate-limited in memory to 10 requests per IP/route per 10
minutes. This limiter is process-local and must be replaced with shared
storage before deploying across multiple server instances.
