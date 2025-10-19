import type { FastifyInstance } from "fastify";
import { buildServer } from "./index";

jest.mock("../db", () => ({
  query: jest.fn()
}));

jest.mock("../redis", () => ({
  connectRedis: jest.fn(),
  redisClient: {
    get: jest.fn(),
    set: jest.fn()
  }
}));

import { query } from "../db";
import { connectRedis, redisClient } from "../redis";

const mockQuery = query as jest.MockedFunction<typeof query>;
const mockConnectRedis = connectRedis as jest.MockedFunction<typeof connectRedis>;
const mockRedisClient = redisClient as unknown as {
  get: jest.MockedFunction<typeof redisClient.get>;
  set: jest.MockedFunction<typeof redisClient.set>;
};

describe("Fastify server", () => {
  let server: FastifyInstance | undefined;

  afterEach(async () => {
    if (server) {
      await server.close();
      server = undefined;
    }
    mockQuery.mockReset();
    mockConnectRedis.mockReset();
    mockRedisClient.get.mockReset();
    mockRedisClient.set.mockReset();
  });

  it("returns insights from the database", async () => {
    mockConnectRedis.mockResolvedValue(true);
    mockRedisClient.get.mockResolvedValue(null);
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
    expect(mockConnectRedis).toHaveBeenCalled();
    expect(mockRedisClient.get).toHaveBeenCalledWith("insights:latest");
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT id, title, summary, created_at FROM insights ORDER BY created_at DESC"
    );
    expect(mockRedisClient.set).toHaveBeenCalledWith(
      "insights:latest",
      JSON.stringify([
        {
          id: 1,
          title: "Insight",
          summary: "Summary",
          created_at: "2025-01-01T00:00:00.000Z"
        }
      ]),
      { EX: 60 }
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

  it("returns cached insights when present", async () => {
    mockConnectRedis.mockResolvedValue(true);
    mockRedisClient.get.mockResolvedValue(
      JSON.stringify([
        { id: 2, title: "Cached", summary: "Hit", created_at: "2025-02-01T00:00:00.000Z" }
      ])
    );

    server = await buildServer();
    const response = await server.inject({ method: "GET", url: "/api/insights" });

    expect(response.statusCode).toBe(200);
    expect(mockConnectRedis).toHaveBeenCalled();
    expect(mockRedisClient.get).toHaveBeenCalledWith("insights:latest");
    expect(mockQuery).not.toHaveBeenCalled();
    expect(mockRedisClient.set).not.toHaveBeenCalled();
    expect(JSON.parse(response.payload)).toEqual([
      { id: 2, title: "Cached", summary: "Hit", created_at: "2025-02-01T00:00:00.000Z" }
    ]);
  });

  it("exposes a health endpoint", async () => {
    server = await buildServer();
    const response = await server.inject({ method: "GET", url: "/healthz" });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({ status: "ok", service: "fastify" });
  });
});
