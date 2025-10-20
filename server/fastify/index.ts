import Fastify from "fastify";
import cors from "@fastify/cors";
import { query } from "../db.ts";
import { connectRedis, redisClient } from "../redis.ts";

const port = Number(process.env.FASTIFY_PORT ?? 3001);

export const buildServer = async () => {
  const fastify = Fastify({ logger: process.env.NODE_ENV !== "test" });

  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN ?? "*"
  });

  fastify.get("/api/shipments", async () => {
    const cacheReady = await connectRedis();
    if (cacheReady) {
      const cached = await redisClient.get("shipments:all");
      if (cached) {
        return JSON.parse(cached);
      }
    }

    const rows = await query<{
      id: number;
      origin: string;
      destination: string;
      status: string;
      estimated_delivery: string;
    }>(
      "SELECT id, origin, destination, status, estimated_delivery FROM shipments ORDER BY estimated_delivery DESC"
    );

    if (cacheReady) {
      await redisClient.set("shipments:all", JSON.stringify(rows), {
        EX: Number(process.env.REDIS_SHIPMENTS_TTL ?? 60)
      });
    }

    return rows;
  });

  fastify.get("/healthz", async () => ({ status: "ok", service: "fastify" }));

  return fastify;
};

export const start = async () => {
  try {
    const server = await buildServer();
    await server.listen({ port, host: "0.0.0.0" });

    console.log(`Fastify API ready on http://localhost:${port}`);
  } catch (err) {
    console.error("Fastify boot failed", err);
    process.exit(1);
  }
};
