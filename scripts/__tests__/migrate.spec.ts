import path from "node:path";
import { runMigrations } from "../migrate";

jest.mock("node:fs/promises", () => ({
  readdir: jest.fn(),
  readFile: jest.fn()
}));

jest.mock("../../server/db", () => ({
  query: jest.fn(),
  pool: { end: jest.fn() }
}));

import { readdir, readFile } from "node:fs/promises";
import { query } from "../../server/db";

const mockReaddir = readdir as jest.MockedFunction<typeof readdir>;
const mockReadFile = readFile as jest.MockedFunction<typeof readFile>;
const mockQuery = query as jest.MockedFunction<typeof query>;

describe("runMigrations", () => {
  beforeEach(() => {
    mockReaddir.mockReset();
    mockReadFile.mockReset();
    mockQuery.mockReset();
  });

  it("executes .sql and .ddl migrations in order", async () => {
    mockReaddir.mockResolvedValue(["002_extra.ddl", "notes.txt", "001_base.sql"] as unknown as Awaited<
      ReturnType<typeof readdir>
    >);
    mockReadFile
      .mockResolvedValueOnce("CREATE TABLE one;")
      .mockResolvedValueOnce("ALTER TABLE two;");
    mockQuery.mockResolvedValue([]);

    await runMigrations();

    const migrationsDir = path.join(process.cwd(), "db", "migrations");

    expect(mockReaddir).toHaveBeenCalledWith(migrationsDir);
    expect(mockReadFile).toHaveBeenCalledTimes(2);
    expect(mockReadFile.mock.calls[0][0]).toContain(path.join("db", "migrations", "001_base.sql"));
    expect(mockReadFile.mock.calls[1][0]).toContain(path.join("db", "migrations", "002_extra.ddl"));
    expect(mockQuery).toHaveBeenNthCalledWith(1, "CREATE TABLE one;");
    expect(mockQuery).toHaveBeenNthCalledWith(2, "ALTER TABLE two;");
  });

  it("skips execution when no migrations exist", async () => {
    mockReaddir.mockResolvedValue([] as unknown as Awaited<ReturnType<typeof readdir>>);

    await runMigrations();

    expect(mockQuery).not.toHaveBeenCalled();
    expect(mockReadFile).not.toHaveBeenCalled();
  });
});
