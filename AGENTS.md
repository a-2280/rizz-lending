<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

The full breaking-change list is in `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`. Confirmed differences that matter here:

- `params` and `searchParams` are **Promises** — they must be `await`ed (or unwrapped with React's `use`). `cookies()`, `headers()`, and `draftMode()` are async too.
- The `middleware.js` file convention is deprecated and renamed: use a root-level `proxy.js`.
- `next lint` is removed — linting is plain ESLint with flat config (`eslint.config.mjs`).
- Turbopack is the default for both `next dev` and `next build` (no flag needed).

## Commands

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — runs `eslint` (not `next lint`)
- `npm start` intentionally runs `next dev`, not `next start`. **Never "fix" this.**
- No test framework is set up.
- Sanity Studio is a separate npm project: `cd sanity && npm run dev` (or `npm run deploy`).
- **The user runs all testing themselves** — never run `npm run dev`, `npm run build`, `npm run lint`, or start the Sanity Studio to verify changes. Make the code changes and stop; let the user do the verification.

## Architecture

Next.js 16 App Router, **JavaScript (no TypeScript)**, React 19. Everything is a Server Component so far — there is no `"use client"` in the codebase yet. Path alias: `@/*` → `./src/*` (`jsconfig.json`).

- **`RIZZPROTO3.html` (repo root) is the design source of truth.** Pages are built from this prototype, and the files in `src/data/` were extracted from it.
- **Styling is global SCSS — no CSS modules.** `src/scss/site.scss` is imported once in the root layout. Brand palette and design tokens live as CSS custom properties in `src/scss/_layout.scss`; `src/scss/_global.scss` provides a utility-class system (grid/flex/spacing, `.m-hide`/`.m-show` at the 768px breakpoint).
- **Fonts** are set up in `src/fonts/index.js` via `next/font` (self-hosted Clash Display and Gambetta, plus Archivo from Google) and exposed as `--font-clash` / `--font-gambetta` / `--font-archivo` CSS variables on `<html>`.
- **SEO**: the root layout defines `title.template` and `metadataBase`; every page exports its own `metadata` object. `src/app/robots.js` and `src/app/sitemap.js` are driven by `ROUTES` and `SITE_URL` from `src/data/site.js`. The env var `NEXT_PUBLIC_SITE_URL` overrides the production URL fallback.
- Payment math (`monthlyPayment`, `fmtUSD`) lives inline in `src/components/blocks/estimationBlock.js` — it's the only calculator wired up so far. If /borrow-smart or /apply grow their own calculators, revisit whether this should move back to a shared module. The APR itself is a Sanity-editable field (stored as a percent, e.g. `9.9`), not a code constant.
- **Sanity** is a standalone Studio in `sanity/` (projectId `gx0bybp7`, dataset `production`) with its own `package.json`. Schemas are empty and it is **not yet wired into the frontend** — `/admin` just redirects to the hosted studio.

## Compliance constraints

- `src/data/states.js` — per-state lending availability is **legally sensitive**. Verify changes against the licensing sheet; compliance sign-off is required before launch.
- The estimator's `apr` field (`sanity/schemaTypes/blocks/estimationBlock.js`) is editorially set in Sanity, not calculated — it's illustrative, not a rate quote. It must be replaced with real underwriting logic before launch, and the on-page "illustrative, not a rate quote" disclaimers stay regardless.
- `src/data/state-paths.js` — import only from the availability-map component so the SVG path data stays out of the shared bundle.

## Formatting

Root `.prettierrc` uses `printWidth: 999` (effectively no line wrapping) with semicolons. The `sanity/` project has its own, different Prettier config (no semicolons, single quotes) — don't apply one project's style to the other.
