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

## Project Layout

- `app/` – Next.js App Router UI that fetches insights and playbooks.
- `server/fastify/` – Fastify service exposing `/api/insights`.
- `server/express/` – Express service exposing `/api/playbooks`.
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

You can extend this scaffold with authentication, background jobs, or AI integrations to align even more closely with the Pazago Provue role.**_End Patch_** End Patch
