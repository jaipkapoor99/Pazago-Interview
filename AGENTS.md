# Repository Guidelines

## Project Structure & Module Organization

- `app/` contains the Next.js App Router UI; keep new routes modular inside feature folders.
- `server/fastify/` and `server/express/` expose backend APIs. Share database helpers via `server/db.ts` and avoid duplicating connection logic.
- `db/migrations/` and `db/seeds/` store SQL files executed through `npm run db:migrate` and `npm run db:seed`.
- `scripts/` holds TypeScript utilities for database automation. Add new scripts here and reference them in `package.json`.

## Build, Test, and Development Commands

- `npm run dev` boots the Next.js app, Fastify API, and Express API concurrently.
- `npm run dev:web`, `npm run dev:fastify`, and `npm run dev:express` start each service independently for focused debugging.
- `npm run db:migrate` applies schema changes; `npm run db:seed` resets demo data (uses `TRUNCATE` before inserts).
- `npm run lint` runs the Next.js ESLint rules; fix issues before committing.

## Coding Style & Naming Conventions

- TypeScript uses 2-space indentation and strict mode. Export typed helpers and avoid `any`.
- Fastify handlers live beside the route definition; Express endpoints use a flat structure for clarity.
- Environment variables belong in `.env` (derived from `.env.example`). Document new keys inside the example file.

## Testing Guidelines

- Add Jest when tests are introduced; place `.spec.ts` files adjacent to the code under test.
- Prefer dependency-injection-friendly patterns so handlers can be unit tested without touching Postgres.
- Record manual verification steps in PRs until automated tests land.

## Commit & Pull Request Guidelines

- Follow Conventional Commits (`feat: add insights timeline`, `chore: bump next version`).
- Summarize behaviour changes, note database migrations, and include curl or browser screenshots for API/UI updates.
- Request review from another contributor and link tracking issues using `Fixes #ID`.

## Security & Configuration Tips

- Never check in `.env` or real credentials. Use Docker secrets or local `.env` files ignored by git.
- Rotate demo data regularly; avoid storing confidential customer records in the shared Postgres instance.
