import fs from "node:fs/promises";
import path from "node:path";
import { pool, query } from "../server/db";

async function runMigrations() {
  const migrationsDir = path.join(process.cwd(), "db", "migrations");
  const supportedExtensions = [".ddl", ".sql"];
  const files = (await fs.readdir(migrationsDir))
    .filter((file) => supportedExtensions.some((extension) => file.endsWith(extension)))
    .sort();

  if (files.length === 0) {
    console.log("No migrations to run.");
    return;
  }

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = await fs.readFile(filePath, "utf-8");

    console.log(`Running migration: ${file}`);
    await query(sql);
  }

  console.log("All migrations applied.");
}

runMigrations()
  .catch((error) => {
    console.error("Migration failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
