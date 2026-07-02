import { getCallerById } from "../services/caller.service";
import prisma from "../config/prisma";

// Mock Prisma module
jest.mock("../config/prisma", () => ({
  __esModule: true,
  default: {
    caller: {
      findUnique: jest.fn(),
    },
  },
}));

describe("callerService.getCallerById()", () => {

  const mockCaller = {
    id: 1,
    name: "Deepak Goyal",
    email: "deepak@example.com",
    phone: "9876543210",
    roleId: 2,
    isActive: true,
    createdAt: new Date("2025-01-01"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Happy path: should return caller when found", async () => {

    (prisma.caller.findUnique as jest.Mock)
      .mockResolvedValue(mockCaller);

    const result = await getCallerById(1);

    expect(result).toEqual(mockCaller);
  });

  test("Should throw 'Caller not found' when record does not exist", async () => {

    (prisma.caller.findUnique as jest.Mock)
      .mockResolvedValue(null);

    await expect(getCallerById(999))
      .rejects
      .toThrow("Caller not found");

  });

  test("Should call findUnique with correct arguments", async () => {

    (prisma.caller.findUnique as jest.Mock)
      .mockResolvedValue(mockCaller);

    await getCallerById(1);

    expect(prisma.caller.findUnique)
      .toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });

  });

  test("Should propagate database errors", async () => {

    (prisma.caller.findUnique as jest.Mock)
      .mockRejectedValue(
        new Error("DB connection lost")
      );

    await expect(getCallerById(1))
      .rejects
      .toThrow("DB connection lost");

  });

});