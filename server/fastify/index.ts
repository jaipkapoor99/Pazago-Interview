import Fastify from "fastify";
import cors from "@fastify/cors";
import { query } from "../db";

const port = Number(process.env.FASTIFY_PORT ?? 3001);

async function buildServer() {
  const fastify = Fastify({ logger: true });

  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN ?? "*"
  });

  fastify.get("/api/insights", async () => {
    const rows = await query<{
      id: number;
      title: string;
      summary: string;
      created_at: string;
    }>("SELECT id, title, summary, created_at FROM insights ORDER BY created_at DESC");

    return rows;
  });

  fastify.get("/healthz", async () => ({ status: "ok", service: "fastify" }));

  return fastify;
}

async function start() {
  try {
    const server = await buildServer();
    await server.listen({ port, host: "0.0.0.0" });

    console.log(`Fastify API ready on http://localhost:${port}`);
  } catch (err) {
    console.error("Fastify boot failed", err);
    process.exit(1);
  }
}

void start();
