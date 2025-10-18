import fs from "node:fs/promises";
import path from "node:path";
import { pool, query } from "../server/db";

async function runSeeds() {
  const seedsDir = path.join(process.cwd(), "db", "seeds");
  const files = (await fs.readdir(seedsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No seeds to run.");
    return;
  }

  for (const file of files) {
    const filePath = path.join(seedsDir, file);
    const sql = await fs.readFile(filePath, "utf-8");
    console.log(`Seeding data from: ${file}`);
    await query(sql);
  }

  console.log("Seed data inserted.");
}

runSeeds()
  .catch((error) => {
    console.error("Seeding failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
