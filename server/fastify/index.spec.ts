import type { FastifyInstance } from "fastify";
import { buildServer } from "./index.ts";

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

  it("returns shipments from the database", async () => {
    mockConnectRedis.mockResolvedValue(true);
    mockRedisClient.get.mockResolvedValue(null);
    mockQuery.mockResolvedValueOnce([
      {
        id: 1,
        origin: "Shanghai",
        destination: "Los Angeles",
        status: "In Transit",
        estimated_delivery: "2025-01-15T00:00:00.000Z"
      }
    ]);

    server = await buildServer();
    const response = await server.inject({
      method: "GET",
      url: "/api/shipments"
    });

    expect(response.statusCode).toBe(200);
    expect(mockConnectRedis).toHaveBeenCalled();
    expect(mockRedisClient.get).toHaveBeenCalledWith("shipments:all");
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT id, origin, destination, status, estimated_delivery FROM shipments ORDER BY estimated_delivery DESC"
    );
    expect(mockRedisClient.set).toHaveBeenCalledWith(
      "shipments:all",
      JSON.stringify([
        {
          id: 1,
          origin: "Shanghai",
          destination: "Los Angeles",
          status: "In Transit",
          estimated_delivery: "2025-01-15T00:00:00.000Z"
        }
      ]),
      { EX: 60 }
    );
    expect(JSON.parse(response.payload)).toEqual([
      {
        id: 1,
        origin: "Shanghai",
        destination: "Los Angeles",
        status: "In Transit",
        estimated_delivery: "2025-01-15T00:00:00.000Z"
      }
    ]);
  });

  it("returns cached shipments when present", async () => {
    mockConnectRedis.mockResolvedValue(true);
    mockRedisClient.get.mockResolvedValue(
      JSON.stringify([
        {
          id: 2,
          origin: "Rotterdam",
          destination: "New York",
          status: "Delivered",
          estimated_delivery: "2025-02-01T00:00:00.000Z"
        }
      ])
    );

    server = await buildServer();
    const response = await server.inject({ method: "GET", url: "/api/shipments" });

    expect(response.statusCode).toBe(200);
    expect(mockConnectRedis).toHaveBeenCalled();
    expect(mockRedisClient.get).toHaveBeenCalledWith("shipments:all");
    expect(mockQuery).not.toHaveBeenCalled();
    expect(mockRedisClient.set).not.toHaveBeenCalled();
    expect(JSON.parse(response.payload)).toEqual([
      {
        id: 2,
        origin: "Rotterdam",
        destination: "New York",
        status: "Delivered",
        estimated_delivery: "2025-02-01T00:00:00.000Z"
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
