import "dotenv/config";
import express from "express";
import cors from "cors";
import { query } from "../db";

const port = Number(process.env.EXPRESS_PORT ?? 4000);

export async function handleGetPlaybooks(
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const rows = await query<{
      id: number;
      name: string;
      description: string;
      tags: string[];
    }>("SELECT id, name, description, tags FROM playbooks ORDER BY id ASC");

    res.json(rows);
  } catch (error) {
    next(error);
  }
}

export function handleHealth(_req: express.Request, res: express.Response) {
  res.json({ status: "ok", service: "express" });
}

export function createApp() {
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
}

export function start() {
  const app = createApp();
  return app.listen(port, () => {
    console.log(`Express API ready on http://localhost:${port}`);
  });
}
