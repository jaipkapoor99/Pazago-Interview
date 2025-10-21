// This file contains the tests for the Express server.

import type { Request, Response, NextFunction } from "express";
import { handleGetTradeLanes, handleHealth } from "./index.ts";

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

// Create a mock response object.
const createResponse = () => {
  const res = {
    json: jest.fn()
  } as Partial<Response>;
  return res as Response;
};

// Create a mock next function.
const createNext = (): jest.MockedFunction<NextFunction> =>
  jest.fn() as jest.MockedFunction<NextFunction>;

describe("Express handlers", () => {
  // After each test, reset the mock functions.
  afterEach(() => {
    mockQuery.mockReset();
    mockConnectRedis.mockReset();
    mockRedisClient.get.mockReset();
    mockRedisClient.set.mockReset();
    jest.restoreAllMocks();
  });

  // Test that the server responds with trade lanes data.
  it("responds with trade lanes data", async () => {
    // Mock the Redis and database functions.
    mockConnectRedis.mockResolvedValue(true);
    mockRedisClient.get.mockResolvedValue(null);
    mockQuery.mockResolvedValueOnce([
      {
        id: 1,
        name: "Asia to North America West Coast",
        average_duration_days: 25,
        common_risks: ["Port congestion", "Weather delays"]
      }
    ]);

    const res = createResponse();
    const next = createNext();

    // Call the handler function.
    await handleGetTradeLanes({} as Request, res, next);

    // Assert that the functions were called correctly.
    expect(mockConnectRedis).toHaveBeenCalled();
    expect(mockRedisClient.get).toHaveBeenCalledWith("trade_lanes:all");
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT id, name, average_duration_days, common_risks FROM trade_lanes ORDER BY id ASC"
    );
    expect(res.json).toHaveBeenCalledWith([
      {
        id: 1,
        name: "Asia to North America West Coast",
        average_duration_days: 25,
        common_risks: ["Port congestion", "Weather delays"]
      }
    ]);
    expect(mockRedisClient.set).toHaveBeenCalledWith(
      "trade_lanes:all",
      JSON.stringify([
        {
          id: 1,
          name: "Asia to North America West Coast",
          average_duration_days: 25,
          common_risks: ["Port congestion", "Weather delays"]
        }
      ]),
      { EX: 60 }
    );
    expect(next).not.toHaveBeenCalled();
  });

  // Test that the server forwards errors from the database.
  it("forwards errors from the database", async () => {
    const error = new Error("boom");
    mockConnectRedis.mockResolvedValue(true);
    mockRedisClient.get.mockResolvedValue(null);
    mockQuery.mockRejectedValueOnce(error);

    const res = createResponse();
    const next = createNext();

    // Call the handler function.
    await handleGetTradeLanes({} as Request, res, next);

    // Assert that the next function was called with the error.
    expect(mockConnectRedis).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
    expect(res.json).not.toHaveBeenCalled();
  });

  // Test that the server serves cached trade lanes.
  it("serves cached trade lanes", async () => {
    // Mock the Redis and database functions.
    mockConnectRedis.mockResolvedValue(true);
    mockRedisClient.get.mockResolvedValue(
      JSON.stringify([
        {
          id: 2,
          name: "Europe to East Coast South America",
          average_duration_days: 20,
          common_risks: ["Customs clearance"]
        }
      ])
    );

    const res = createResponse();
    const next = createNext();

    // Call the handler function.
    await handleGetTradeLanes({} as Request, res, next);

    // Assert that the functions were called correctly.
    expect(mockConnectRedis).toHaveBeenCalled();
    expect(mockRedisClient.get).toHaveBeenCalledWith("trade_lanes:all");
    expect(mockQuery).not.toHaveBeenCalled();
    expect(mockRedisClient.set).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([
      {
        id: 2,
        name: "Europe to East Coast South America",
        average_duration_days: 20,
        common_risks: ["Customs clearance"]
      }
    ]);
    expect(next).not.toHaveBeenCalled();
  });

  // Test that the server returns a health payload.
  it("returns health payload", () => {
    const res = createResponse();

    // Call the handler function.
    handleHealth({} as Request, res);

    // Assert that the response is correct.
    expect(res.json).toHaveBeenCalledWith({ status: "ok", service: "express" });
  });
});