import type { Request, Response, NextFunction } from "express";
import { handleGetPlaybooks, handleHealth } from "./index";

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

const createResponse = () => {
  const res = {
    json: jest.fn()
  } as Partial<Response>;
  return res as Response;
};

const createNext = (): jest.MockedFunction<NextFunction> =>
  jest.fn() as jest.MockedFunction<NextFunction>;

describe("Express handlers", () => {
  afterEach(() => {
    mockQuery.mockReset();
    mockConnectRedis.mockReset();
    mockRedisClient.get.mockReset();
    mockRedisClient.set.mockReset();
    jest.restoreAllMocks();
  });

  it("responds with playbooks data", async () => {
    mockConnectRedis.mockResolvedValue(true);
    mockRedisClient.get.mockResolvedValue(null);
    mockQuery.mockResolvedValueOnce([
      { id: 1, name: "Alpha", description: "Desc", tags: ["one"] }
    ]);

    const res = createResponse();
    const next = createNext();

    await handleGetPlaybooks({} as Request, res, next);

    expect(mockConnectRedis).toHaveBeenCalled();
    expect(mockRedisClient.get).toHaveBeenCalledWith("playbooks:all");
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT id, name, description, tags FROM playbooks ORDER BY id ASC"
    );
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, name: "Alpha", description: "Desc", tags: ["one"] }
    ]);
    expect(mockRedisClient.set).toHaveBeenCalledWith(
      "playbooks:all",
      JSON.stringify([{ id: 1, name: "Alpha", description: "Desc", tags: ["one"] }]),
      { EX: 60 }
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards errors from the database", async () => {
    const error = new Error("boom");
    mockConnectRedis.mockResolvedValue(true);
    mockRedisClient.get.mockResolvedValue(null);
    mockQuery.mockRejectedValueOnce(error);

    const res = createResponse();
    const next = createNext();

    await handleGetPlaybooks({} as Request, res, next);

    expect(mockConnectRedis).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
    expect(res.json).not.toHaveBeenCalled();
  });

  it("serves cached playbooks", async () => {
    mockConnectRedis.mockResolvedValue(true);
    mockRedisClient.get.mockResolvedValue(
      JSON.stringify([{ id: 2, name: "Cached", description: "Hit", tags: ["two"] }])
    );

    const res = createResponse();
    const next = createNext();

    await handleGetPlaybooks({} as Request, res, next);

    expect(mockConnectRedis).toHaveBeenCalled();
    expect(mockRedisClient.get).toHaveBeenCalledWith("playbooks:all");
    expect(mockQuery).not.toHaveBeenCalled();
    expect(mockRedisClient.set).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([
      { id: 2, name: "Cached", description: "Hit", tags: ["two"] }
    ]);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns health payload", () => {
    const res = createResponse();

    handleHealth({} as Request, res);

    expect(res.json).toHaveBeenCalledWith({ status: "ok", service: "express" });
  });
});
