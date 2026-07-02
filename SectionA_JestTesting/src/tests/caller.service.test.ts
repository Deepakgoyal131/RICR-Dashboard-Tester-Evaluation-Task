/**
 * Unit Tests: callerService.getCallerById()
 *
 * Assumption:
 * As mentioned in the assignment, the actual implementation of
 * callerService and Prisma configuration is not provided.
 * These tests are written based on the given specification and
 * assume that the required implementation already exists.
 */

import { getCallerById } from "../services/caller.service";
import prisma from "../config/prisma";

// Mock the Prisma client so that no real database connection is used.
// This allows us to unit test only the service logic.
jest.mock("../config/prisma", () => ({
  __esModule: true,
  default: {
    caller: {
      findUnique: jest.fn(),
    },
  },
}));

describe("callerService.getCallerById()", () => {

  // Mock caller object used across multiple test cases.
  const mockCaller = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    roleId: 2,
    isActive: true,
    createdAt: new Date("2025-01-01"),
  };

  beforeEach(() => {
    // Reset all mock function calls and implementations
    // before each test to ensure test isolation.
    jest.clearAllMocks();
  });

  // Verify the service returns the caller when
  // Prisma successfully finds the requested record.
  test("should return caller when caller exists", async () => {

    (prisma.caller.findUnique as jest.Mock)
      .mockResolvedValue(mockCaller);

    const result = await getCallerById(1);

    expect(result).toEqual(mockCaller);

  });

  // Verify the service throws the expected error
  // when no caller record exists in the database.
  test("should throw 'Caller not found' when caller does not exist", async () => {

    (prisma.caller.findUnique as jest.Mock)
      .mockResolvedValue(null);

    await expect(getCallerById(999))
      .rejects
      .toThrow("Caller not found");

  });

  // Verify that the service queries Prisma
  // with the correct search condition.
  test("should call prisma.findUnique with correct where condition", async () => {

    (prisma.caller.findUnique as jest.Mock)
      .mockResolvedValue(mockCaller);

    await getCallerById(1);

    expect(prisma.caller.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });

  });

  // Verify that unexpected database errors
  // are propagated to the caller without modification.
  test("should propagate database errors", async () => {

    (prisma.caller.findUnique as jest.Mock)
      .mockRejectedValue(new Error("DB connection lost"));

    await expect(getCallerById(1))
      .rejects
      .toThrow("DB connection lost");

  });

});