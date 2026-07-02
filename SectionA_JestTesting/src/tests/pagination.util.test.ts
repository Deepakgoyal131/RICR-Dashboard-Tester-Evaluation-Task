import { getPaginationMeta } from "../utils/pagination.util";

describe("getPaginationMeta()", () => {

  // Test: Verify pagination metadata for the first page.
  // Expected:
  // - Total pages should be calculated correctly.
  // - Next page should be available.
  // - Previous page should not exist.
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

  // Test: Verify behavior on the last page.
  // Expected:
  // - No next page.
  // - Previous page should exist.
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

  // Test: Verify pagination for a middle page.
  // Expected:
  // - Both previous and next pages should be available.
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

  // Test: Verify pagination when the last page contains fewer records.
  // Expected:
  // - Total pages should be rounded up.
  // - Current page should be the last page.
  // - No next page should exist.
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

  // Test: Verify when all records fit on a single page.
  // Expected:
  // - Only one page exists.
  // - No previous or next pages.
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

  // Test: Verify behavior when there are no records.
  // Expected:
  // - Total pages should be zero.
  // - No previous or next pages.
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