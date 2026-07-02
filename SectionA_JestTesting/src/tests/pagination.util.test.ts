import { getPaginationMeta } from "../utils/pagination.util";

describe("getPaginationMeta()", () => {

  test("Standard case: 100 total, page 1, limit 10", () => {
    const result = getPaginationMeta(100, 1, 10);

    expect(result).toEqual({
      total: 100,
      totalPages: 10,
      currentPage: 1,
      limit: 10,
      hasNextPage: true,
      hasPrevPage: false,
    });
  });

  test("Last page: 100 total, page 10, limit 10", () => {
    const result = getPaginationMeta(100, 10, 10);

    expect(result).toEqual({
      total: 100,
      totalPages: 10,
      currentPage: 10,
      limit: 10,
      hasNextPage: false,
      hasPrevPage: true,
    });
  });

  test("Middle page: 50 total, page 3, limit 5", () => {
    const result = getPaginationMeta(50, 3, 5);

    expect(result).toEqual({
      total: 50,
      totalPages: 10,
      currentPage: 3,
      limit: 5,
      hasNextPage: true,
      hasPrevPage: true,
    });
  });

  test("Partial last page: 23 total, page 3, limit 10", () => {
    const result = getPaginationMeta(23, 3, 10);

    expect(result).toEqual({
      total: 23,
      totalPages: 3,
      currentPage: 3,
      limit: 10,
      hasNextPage: false,
      hasPrevPage: true,
    });
  });

  test("Single page: 5 total, page 1, limit 10", () => {
    const result = getPaginationMeta(5, 1, 10);

    expect(result).toEqual({
      total: 5,
      totalPages: 1,
      currentPage: 1,
      limit: 10,
      hasNextPage: false,
      hasPrevPage: false,
    });
  });

  test("Zero total records", () => {
    const result = getPaginationMeta(0, 1, 10);

    expect(result).toEqual({
      total: 0,
      totalPages: 0,
      currentPage: 1,
      limit: 10,
      hasNextPage: false,
      hasPrevPage: false,
    });
  });

});