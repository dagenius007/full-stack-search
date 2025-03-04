import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { vi, describe, expect, test, beforeEach } from "vitest";
import { search } from "../hotel";

vi.mock("mongodb", () => ({
  MongoClient: vi.fn(() => ({
    connect: vi.fn(),
    db: vi.fn(() => ({
      collection: vi.fn(() => ({
        find: vi.fn().mockReturnThis(),
        project: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue([]),
      })),
    })),
    close: vi.fn(),
  })),
}));

describe("search", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockSend: ReturnType<typeof vi.fn>;
  let mockStatus: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    process.env.DATABASE_URL = "mongodb://localhost:27017";
    mockSend = vi.fn();
    mockStatus = vi.fn().mockReturnValue({ send: mockSend });
    mockRes = {
      send: mockSend,
      status: mockStatus,
    };
    mockReq = {
      query: {},
    };
    vi.clearAllMocks();
  });

  test("should return empty results for search term less than 3 characters", async () => {
    mockReq.query = { search: "ab" };
    await search(mockReq as Request, mockRes as Response);

    expect(mockSend).toHaveBeenCalledWith({
      hotels: [],
      cities: [],
      countries: [],
    });
  });

  test("should return empty results for no search term", async () => {
    mockReq.query = {};
    await search(mockReq as Request, mockRes as Response);

    expect(mockSend).toHaveBeenCalledWith({
      hotels: [],
      cities: [],
      countries: [],
    });
  });

  test("should search and return results for valid search term", async () => {
    const mockCollection = {
      find: vi.fn().mockReturnThis(),
      project: vi.fn().mockReturnThis(),
      toArray: vi.fn().mockResolvedValue([{ _id: "1", name: "Test Result" }]),
    };

    const mockDb = {
      collection: vi.fn(() => mockCollection),
    };

    const mockConnect = vi.fn();

    vi.mocked(MongoClient).mockImplementation(
      () =>
        ({
          connect: mockConnect,
          db: vi.fn().mockReturnValue(mockDb),
          close: vi.fn(),
        } as unknown as MongoClient)
    );

    mockReq.query = { search: "test" };
    await search(mockReq as Request, mockRes as Response);

    expect(mockConnect).toHaveBeenCalled();
    expect(mockDb.collection).toHaveBeenCalledTimes(3);
    expect(mockCollection.find).toHaveBeenCalledTimes(3);
    expect(mockCollection.project).toHaveBeenCalledTimes(3);
    expect(mockCollection.toArray).toHaveBeenCalledTimes(3);
  });

  test("should handle database connection error", async () => {
    const mockError = new Error("Connection failed");

    const mockConnect = vi.fn().mockRejectedValue(mockError);

    vi.mocked(MongoClient).mockImplementation(
      () =>
        ({
          connect: mockConnect,
          db: vi.fn(),
          close: vi.fn(),
        } as unknown as MongoClient)
    );

    mockReq.query = { search: "test" };
    await search(mockReq as Request, mockRes as Response);

    expect(mockConnect).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockSend).toHaveBeenCalledWith("An error occurred");
  });

  test("should close database connection in finally block", async () => {
    const mockClose = vi.fn();

    vi.mocked(MongoClient).mockImplementation(
      () =>
        ({
          close: mockClose,
        } as unknown as MongoClient)
    );

    mockReq.query = { search: "test" };
    await search(mockReq as Request, mockRes as Response);

    expect(mockClose).toHaveBeenCalled();
  });
});
