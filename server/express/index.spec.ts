import type { Request, Response, NextFunction } from "express";
import { handleGetPlaybooks, handleHealth } from "./index";

jest.mock("../db", () => ({
  query: jest.fn()
}));

import { query } from "../db";

const mockQuery = query as jest.MockedFunction<typeof query>;

function createResponse() {
  const res = {
    json: jest.fn()
  } as Partial<Response>;
  return res as Response;
}

function createNext(): jest.MockedFunction<NextFunction> {
  return jest.fn() as jest.MockedFunction<NextFunction>;
}

describe("Express handlers", () => {
  afterEach(() => {
    mockQuery.mockReset();
    jest.restoreAllMocks();
  });

  it("responds with playbooks data", async () => {
    mockQuery.mockResolvedValueOnce([
      { id: 1, name: "Alpha", description: "Desc", tags: ["one"] }
    ]);

    const res = createResponse();
    const next = createNext();

    await handleGetPlaybooks({} as Request, res, next);

    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT id, name, description, tags FROM playbooks ORDER BY id ASC"
    );
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, name: "Alpha", description: "Desc", tags: ["one"] }
    ]);
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards errors from the database", async () => {
    const error = new Error("boom");
    mockQuery.mockRejectedValueOnce(error);

    const res = createResponse();
    const next = createNext();

    await handleGetPlaybooks({} as Request, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.json).not.toHaveBeenCalled();
  });

  it("returns health payload", () => {
    const res = createResponse();

    handleHealth({} as Request, res);

    expect(res.json).toHaveBeenCalledWith({ status: "ok", service: "express" });
  });
});
