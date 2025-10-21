// This file contains the main logic for the Express server.

import "dotenv/config";
import express from "express";
import cors from "cors";
import { query } from "../db.ts";
import { connectRedis, redisClient } from "../redis.ts";

// The port that the Express server will listen on. It defaults to 4000 if the EXPRESS_PORT environment variable is not set.
const port = Number(process.env.EXPRESS_PORT ?? 4000);

/**
 * Handles GET requests to the /api/trade-lanes endpoint.
 * @param _req The Express request object.
 * @param res The Express response object.
 * @param next The Express next function.
 */
export const handleGetTradeLanes = async (
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // Connect to Redis.
    const cacheReady = await connectRedis();
    // If the connection is successful, try to get the trade lanes from the cache.
    if (cacheReady) {
      const cached = await redisClient.get("trade_lanes:all");
      if (cached) {
        res.json(JSON.parse(cached));
        return;
      }
    }

    // If the trade lanes are not in the cache, get them from the database.
    const rows = await query<{
      id: number;
      name: string;
      average_duration_days: number;
      common_risks: string[];
    }>(
      "SELECT id, name, average_duration_days, common_risks FROM trade_lanes ORDER BY id ASC"
    );

    // If the connection to Redis is successful, store the trade lanes in the cache.
    if (cacheReady) {
      await redisClient.set("trade_lanes:all", JSON.stringify(rows), {
        EX: Number(process.env.REDIS_TRADE_LANES_TTL ?? 60)
      });
    }

    // Return the trade lanes.
    res.json(rows);
  } catch (error) {
    // If an error occurs, pass it to the error handling middleware.
    next(error);
  }
};

/**
 * Handles GET requests to the /healthz endpoint.
 * @param _req The Express request object.
 * @param res The Express response object.
 */
export const handleHealth = (_req: express.Request, res: express.Response) => {
  res.json({ status: "ok", service: "express" });
};

/**
 * Creates the Express application.
 * @returns The Express application.
 */
export const createApp = () => {
  const app = express();

  // Enable CORS.
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? "*"
    })
  );

  // Register the route handlers.
  app.get("/api/trade-lanes", handleGetTradeLanes);
  app.get("/healthz", handleHealth);

  // Register the error handling middleware.
  app.use((err: Error, _req: express.Request, res: express.Response) => {
    console.error(err);
    res.status(500).json({ message: err.message });
  });

  return app;
};

/**
 * Starts the Express server.
 */
export const start = () =>
  createApp().listen(port, () => {
    console.log(`Express API ready on http://localhost:${port}`);
  });
