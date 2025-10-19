import type { FastifyInstance } from "fastify";
import { buildServer } from "./index";

jest.mock("../db", () => ({
  query: jest.fn()
}));

import { query } from "../db";

const mockQuery = query as jest.MockedFunction<typeof query>;

describe("Fastify server", () => {
  let server: FastifyInstance | undefined;

  afterEach(async () => {
    if (server) {
      await server.close();
      server = undefined;
    }
    mockQuery.mockReset();
  });

  it("returns insights from the database", async () => {
    mockQuery.mockResolvedValueOnce([
      {
        id: 1,
        title: "Insight",
        summary: "Summary",
        created_at: "2025-01-01T00:00:00.000Z"
      }
    ]);

    server = await buildServer();
    const response = await server.inject({
      method: "GET",
      url: "/api/insights"
    });

    expect(response.statusCode).toBe(200);
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT id, title, summary, created_at FROM insights ORDER BY created_at DESC"
    );
    expect(JSON.parse(response.payload)).toEqual([
      {
        id: 1,
        title: "Insight",
        summary: "Summary",
        created_at: "2025-01-01T00:00:00.000Z"
      }
    ]);
  });

  it("exposes a health endpoint", async () => {
    server = await buildServer();
    const response = await server.inject({ method: "GET", url: "/healthz" });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({ status: "ok", service: "fastify" });
  });
});
