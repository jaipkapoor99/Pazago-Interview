# GEMINI.md

> This file provides an overview of the project, including the architecture, how to build and run the project, and the development conventions.

## Project Overview

> This section provides a high-level overview of the project's architecture.

This project is a full-stack application built with a Next.js frontend and two microservices (Fastify and Express) for the backend. It uses PostgreSQL as the database and Redis for caching. The application displays shipment and trade lane information.

- **Frontend:** A Next.js application using the App Router. It fetches data from the two backend APIs and displays it on the homepage.
- **Backend:**
  - **Fastify Server:** A microservice built with Fastify that exposes a `/api/shipments` endpoint. It retrieves data from the `shipments` table in the PostgreSQL database and uses Redis for caching.
  - **Express Server:** A microservice built with Express that exposes a `/api/trade_lanes` endpoint. It retrieves data from the `trade_lanes` table in the PostgreSQL database and uses Redis for caching.
- **Database:** A PostgreSQL database with two tables: `shipments` and `trade_lanes`. The schema is defined in `db/migrations/001_init.ddl.sql`.
- **Caching:** Redis is used to cache the responses from both the Fastify and Express APIs to reduce the load on the PostgreSQL database.
- **Authentication:** The project is set up with `next-auth`, but the implementation in `app/api/auth/[...nextauth]/route.ts` is currently empty.

## Building and Running

> This section explains how to build and run the project, both with Docker and locally.

### With Docker (Recommended)

1.  Copy the example environment file: `cp .env.example .env`
2.  Start all services: `docker compose up -d`
3.  Install dependencies: `npm install`
4.  Run the development server: `npm run dev`

The application will be available at `http://localhost:3000`.

### Locally

1.  Make sure you have PostgreSQL and Redis running.
2.  Install dependencies: `npm install`
3.  Run the development servers: `npm run dev`

This will start the Next.js frontend, the Fastify server, and the Express server in parallel.

### Key Scripts

> This section lists the key npm scripts that are available in the project.

- `npm run dev`: Starts the Next.js frontend, Fastify server, and Express server in development mode.
- `npm run dev:web`: Starts only the Next.js frontend.
- `npm run dev:fastify`: Starts only the Fastify server.
- `npm run dev:express`: Starts only the Express server.
- `npm run build`: Builds the Next.js application for production.
- `npm run start`: Starts the production Next.js server.
- `npm test`: Runs the tests using Jest.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run format`: Formats the codebase using Prettier.
- `npm run check`: Runs linting, testing, formatting, and a production build.

## Development Conventions

> This section describes the development conventions that are used in the project.

- **TypeScript:** The entire project is written in TypeScript.
- **Microservices:** The backend is split into two microservices, one for each data type (shipments and trade_lanes). This is a good pattern to follow for adding new features.
- **Testing:** The project uses Jest for testing. New features should include corresponding tests.
- **Linting and Formatting:** The project uses ESLint and Prettier to maintain code quality and consistency. It's recommended to run `npm run check` before committing changes.
- **Authentication:** While `next-auth` is set up, the implementation is missing. This is a TODO for the project.
- **MCP:** Use relevant MCP servers whenever possible.
