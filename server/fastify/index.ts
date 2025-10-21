// This file contains the main logic for the Fastify server.

import Fastify from "fastify";
import cors from "@fastify/cors";
import { query } from "../db.ts";
import { connectRedis, redisClient } from "../redis.ts";

// The port that the Fastify server will listen on. It defaults to 3001 if the FASTIFY_PORT environment variable is not set.
const port = Number(process.env.FASTIFY_PORT ?? 3001);

/**
 * Builds the Fastify server.
 * @returns A promise that resolves to the Fastify server instance.
 */
export const buildServer = async () => {
  // Create a new Fastify server instance.
  const fastify = Fastify({ logger: process.env.NODE_ENV !== "test" });

  // Register the CORS plugin with the Fastify server.
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN ?? "*"
  });

  // A route that returns a list of all shipments.
  fastify.get("/api/shipments", async () => {
    // Connect to Redis.
    const cacheReady = await connectRedis();
    // If the connection is successful, try to get the shipments from the cache.
    if (cacheReady) {
      const cached = await redisClient.get("shipments:all");
      if (cached) {
        return JSON.parse(cached);
      }
    }

    // If the shipments are not in the cache, get them from the database.
    const rows = await query<{
      id: number;
      origin: string;
      destination: string;
      status: string;
      estimated_delivery: string;
    }>(
      "SELECT id, origin, destination, status, estimated_delivery FROM shipments ORDER BY estimated_delivery DESC"
    );

    // If the connection to Redis is successful, store the shipments in the cache.
    if (cacheReady) {
      await redisClient.set("shipments:all", JSON.stringify(rows), {
        EX: Number(process.env.REDIS_SHIPMENTS_TTL ?? 60)
      });
    }

    // Return the shipments.
    return rows;
  });

  // A health check route that returns the status of the service.
  fastify.get("/healthz", async () => ({ status: "ok", service: "fastify" }));

  // Return the Fastify server instance.
  return fastify;
};

/**
 * Starts the Fastify server.
 */
export const start = async () => {
  try {
    // Build the Fastify server.
    const server = await buildServer();
    // Start the server.
    await server.listen({ port, host: "0.0.0.0" });

    // Log a message to the console to indicate that the server is ready.
    console.log(`Fastify API ready on http://localhost:${port}`);
  } catch (err) {
    // If an error occurs, log it to the console and exit the process.
    console.error("Fastify boot failed", err);
    process.exit(1);
  }
};