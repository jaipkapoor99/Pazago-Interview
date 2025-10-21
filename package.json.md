# package.json Explained

> This file contains the metadata of the project and the dependencies required to run the project.

## Top-level properties

- `name`: The name of the project.
- `version`: The version of the project.
- `private`: Whether the project is private or not.

## scripts

> This section contains the scripts that can be run using `npm run <script-name>`.

- `dev`: Starts the Next.js frontend, Fastify server, and Express server in parallel.
- `dev:web`: Starts only the Next.js frontend.
- `dev:fastify`: Starts only the Fastify server.
- `dev:express`: Starts only the Express server.
- `build`: Builds the Next.js application for production.
- `start`: Starts the production Next.js server.
- `lint`: Lints the codebase using ESLint.
- `test`: Runs the tests using Jest.
- `format`: Formats the codebase using Prettier.
- `format:view`: Checks the formatting of the codebase using Prettier.
- `check`: Runs linting, testing, formatting, and a production build.

## dependencies

> This section contains the dependencies required to run the project in production.

- `@fastify/cors`: A Fastify plugin for enabling CORS.
- `cors`: An Express middleware for enabling CORS.
- `dotenv`: A module for loading environment variables from a `.env` file.
- `express`: A web framework for Node.js.
- `fastify`: A web framework for Node.js.
- `next`: A React framework for building server-side rendered applications.
- `next-auth`: An authentication library for Next.js.
- `pg`: A PostgreSQL client for Node.js.
- `react`: A JavaScript library for building user interfaces.
- `redis`: A Redis client for Node.js.

## devDependencies

> This section contains the dependencies required for development.

- `@next/eslint-plugin-next`: An ESLint plugin for Next.js.
- `@types/cors`: TypeScript definitions for the `cors` module.
- `@types/express`: TypeScript definitions for the `express` module.
- `@types/jest`: TypeScript definitions for the `jest` module.
- `@types/node`: TypeScript definitions for Node.js.
- `@types/pg`: TypeScript definitions for the `pg` module.
- `@types/react`: TypeScript definitions for the `react` module.
- `@typescript-eslint/eslint-plugin`: An ESLint plugin for TypeScript.
- `eslint`: A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
- `eslint-config-next`: The default ESLint configuration for Next.js.
- `jest`: A JavaScript testing framework.
- `npm-run-all`: A CLI tool to run multiple npm-scripts in parallel or sequential.
- `prettier`: A code formatter.
- `ts-jest`: A Jest transformer with source map support for TypeScript.
- `ts-node-dev`: A tool that restarts the server on file changes.
- `typescript`: A typed superset of JavaScript that compiles to plain JavaScript.