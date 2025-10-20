import "dotenv/config";
import express from "express";
import cors from "cors";
import { query } from "../db.ts";
import { connectRedis, redisClient } from "../redis.ts";

const port = Number(process.env.EXPRESS_PORT ?? 4000);

export const handleGetPlaybooks = async (
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const cacheReady = await connectRedis();
    if (cacheReady) {
      const cached = await redisClient.get("playbooks:all");
      if (cached) {
        res.json(JSON.parse(cached));
        return;
      }
    }

    const rows = await query<{
      id: number;
      name: string;
      description: string;
      tags: string[];
    }>("SELECT id, name, description, tags FROM playbooks ORDER BY id ASC");

    if (cacheReady) {
      await redisClient.set("playbooks:all", JSON.stringify(rows), {
        EX: Number(process.env.REDIS_PLAYBOOKS_TTL ?? 60)
      });
    }

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const handleHealth = (_req: express.Request, res: express.Response) => {
  res.json({ status: "ok", service: "express" });
};

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? "*"
    })
  );

  app.get("/api/playbooks", handleGetPlaybooks);
  app.get("/healthz", handleHealth);

  app.use((err: Error, _req: express.Request, res: express.Response) => {
    console.error(err);
    res.status(500).json({ message: err.message });
  });

  return app;
};

export const start = () =>
  createApp().listen(port, () => {
    console.log(`Express API ready on http://localhost:${port}`);
  });
