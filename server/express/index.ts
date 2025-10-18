import "dotenv/config";
import express from "express";
import cors from "cors";
import { query } from "../db";

const app = express();
const port = Number(process.env.EXPRESS_PORT ?? 4000);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "*"
  })
);

app.get("/api/playbooks", async (_req, res, next) => {
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
});

app.get("/healthz", (_req, res) => {
  res.json({ status: "ok", service: "express" });
});

app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`Express API ready on http://localhost:${port}`);
});
