import path from "node:path";
import { runSeeds } from "../seed";

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

describe("runSeeds", () => {
  beforeEach(() => {
    mockReaddir.mockReset();
    mockReadFile.mockReset();
    mockQuery.mockReset();
  });

  it("executes seed files in alphabetical order", async () => {
    mockReaddir.mockResolvedValue([
      "002_playbooks.sql",
      "README.md",
      "001_insights.sql"
    ] as unknown as Awaited<ReturnType<typeof readdir>>);
    mockReadFile
      .mockResolvedValueOnce("INSERT INTO insights DEFAULT VALUES;")
      .mockResolvedValueOnce("INSERT INTO playbooks DEFAULT VALUES;");
    mockQuery.mockResolvedValue([]);

    await runSeeds();

    const seedsDir = path.join(process.cwd(), "db", "seeds");

    expect(mockReaddir).toHaveBeenCalledWith(seedsDir);
    expect(mockReadFile).toHaveBeenCalledTimes(2);
    expect(mockReadFile.mock.calls[0][0]).toContain(path.join("db", "seeds", "001_insights.sql"));
    expect(mockReadFile.mock.calls[1][0]).toContain(path.join("db", "seeds", "002_playbooks.sql"));
    expect(mockQuery).toHaveBeenNthCalledWith(1, "INSERT INTO insights DEFAULT VALUES;");
    expect(mockQuery).toHaveBeenNthCalledWith(2, "INSERT INTO playbooks DEFAULT VALUES;");
  });

  it("does nothing when no seed files are found", async () => {
    mockReaddir.mockResolvedValue([] as unknown as Awaited<ReturnType<typeof readdir>>);

    await runSeeds();

    expect(mockQuery).not.toHaveBeenCalled();
    expect(mockReadFile).not.toHaveBeenCalled();
  });
});
