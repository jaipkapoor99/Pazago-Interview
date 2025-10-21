// This file contains the tests for the Fastify server.

import type { FastifyInstance } from "fastify";
import { buildServer } from "./index.ts";

// Mock the database and Redis modules.
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

// Create mock functions for the database and Redis modules.
const mockQuery = query as jest.MockedFunction<typeof query>;
const mockConnectRedis = connectRedis as jest.MockedFunction<typeof connectRedis>;
const mockRedisClient = redisClient as unknown as {
  get: jest.MockedFunction<typeof redisClient.get>;
  set: jest.MockedFunction<typeof redisClient.set>;
};

describe("Fastify server", () => {
  let server: FastifyInstance | undefined;

  // After each test, close the server and reset the mock functions.
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

  // Test that the server returns shipments from the database.
  it("returns shipments from the database", async () => {
    // Mock the Redis and database functions.
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

    // Build the server and make a request to the /api/shipments endpoint.
    server = await buildServer();
    const response = await server.inject({
      method: "GET",
      url: "/api/shipments"
    });

    // Assert that the response is correct.
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

  // Test that the server returns cached shipments when present.
  it("returns cached shipments when present", async () => {
    // Mock the Redis and database functions.
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

    // Build the server and make a request to the /api/shipments endpoint.
    server = await buildServer();
    const response = await server.inject({ method: "GET", url: "/api/shipments" });

    // Assert that the response is correct.
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

  // Test that the server exposes a health endpoint.
  it("exposes a health endpoint", async () => {
    // Build the server and make a request to the /healthz endpoint.
    server = await buildServer();
    const response = await server.inject({ method: "GET", url: "/healthz" });

    // Assert that the response is correct.
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({ status: "ok", service: "fastify" });
  });
});