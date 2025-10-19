# Provue Interview Sandbox

This project showcases a lightweight Provue-inspired stack with a Next.js frontend, Fastify and Express microservices, and a PostgreSQL backend. It is designed as an interview artifact demonstrating how you build Node.js services around data-driven insights.

## Getting Started

```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

The command above runs the frontend (`http://localhost:3000`), the Fastify API (`http://localhost:3001`), and the Express API (`http://localhost:4000`) together.

To launch only the backend containers (Postgres, Redis, Fastify, and Express):

```bash
docker compose up -d postgres redis fastify-api express-api
```

Fastify listens on `http://localhost:3001` and Express on `http://localhost:4000` when started this way. Redis is available on `redis://localhost:6379`.

Environment defaults are wired through `.env.example`, including `REDIS_URL`, `REDIS_INSIGHTS_TTL`, and `REDIS_PLAYBOOKS_TTL` for cache tuning.

## Project Layout

- `app/` – Next.js App Router UI that fetches insights and playbooks.
- `server/fastify/` – Fastify service exposing `/api/insights` (mirrored by the `fastify-api` Docker service).
- `server/express/` – Express service exposing `/api/playbooks` (mirrored by the `express-api` Docker service).
- `server/db.ts` – Shared PostgreSQL pool.
- `db/migrations/` – Schema migrations automatically loaded by Docker on first run.
- `db/seeds/` – Sample data automatically inserted when the Postgres container initializes.

## Key Scripts

- `npm run dev` – Run Next.js + Fastify + Express together in watch mode.
- `npm run dev:web` – Start the Next.js frontend only.
- `npm run dev:fastify` – Start the Fastify API locally.
- `npm run dev:express` – Start the Express API locally.

## Data Flow

1. PostgreSQL stores insights and playbook rows created by migrations/seeds.
2. Fastify queries the `insights` table and returns recent market summaries.
3. Express queries the `playbooks` table and returns recommended actions.
4. Next.js renders both datasets on the homepage, showing agent-ready intel.
5. Redis caches the latest insights and playbooks to reduce load on Postgres.

You can extend this scaffold with authentication, background jobs, or AI integrations to align even more closely with the Pazago Provue role.**_End Patch_** End Patch
