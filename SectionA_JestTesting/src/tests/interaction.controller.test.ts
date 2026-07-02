/**
 * Assumption:
 * The actual implementation of createInteraction controller and
 * interactionService is not provided as part of the assignment.
 *
 * These tests are written based on the given specification and
 * assume that the controller and service already exist in the project.
 */

import { createInteraction } from "../controllers/interaction.controller";
import * as interactionService from "../services/interaction.service";

// Mock the service layer to isolate controller testing.
// This ensures the tests validate only the controller logic.
jest.mock("../services/interaction.service");

describe("createInteraction Controller", () => {

  let req: any;
  let res: any;

  beforeEach(() => {

    // Create a mock request object.
    // req.user simulates the authenticated user added by authentication middleware.
    req = {
      body: {},
      user: {
        id: 1,
        email: "admin@test.com",
        userType: 1,
      },
    };

    // Create a mock response object.
    // mockReturnThis() allows Express-style chaining:
    // res.status(...).json(...)
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Clear mock history before each test to avoid interference.
    jest.clearAllMocks();

  });

  // Verify validation when studentId is not provided.
  // Expected: HTTP 400 with appropriate validation message.
  test("should return 400 if studentId is missing", async () => {

    req.body = {
      statusId: 2,
      remarks: "Interested",
    };

    await createInteraction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Student ID is required",
    });

  });

  // Verify validation when statusId is missing.
  // Expected: HTTP 400 with appropriate validation message.
  test("should return 400 if statusId is missing", async () => {

    req.body = {
      studentId: 10,
      remarks: "Interested",
    };

    await createInteraction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Status ID is required",
    });

  });

  // Verify validation when remarks are missing.
  // Expected: HTTP 400 with appropriate validation message.
  test("should return 400 if remarks are missing", async () => {

    req.body = {
      studentId: 10,
      statusId: 2,
    };

    await createInteraction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Remarks are required",
    });

  });

  // Verify successful interaction creation.
  // The mocked service returns a created interaction,
  // and the controller should respond with HTTP 201.
  test("should return 201 when interaction is created successfully", async () => {

    req.body = {
      studentId: 10,
      statusId: 2,
      remarks: "Interested",
    };

    const createdInteraction = {
      id: 100,
      ...req.body,
    };

    (interactionService.createInteraction as jest.Mock)
      .mockResolvedValue(createdInteraction);

    await createInteraction(req, res);

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Interaction logged",
      data: createdInteraction,
    });

  });

  // Verify controller behavior when the service throws an error.
  // Expected: HTTP 500 with the propagated error message.
  test("should return 500 if service throws an error", async () => {

    req.body = {
      studentId: 10,
      statusId: 2,
      remarks: "Interested",
    };

    (interactionService.createInteraction as jest.Mock)
      .mockRejectedValue(new Error("Database Error"));

    await createInteraction(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Database Error",
    });

  });

  // Verify that the controller delegates business logic
  // to the service with the correct request body and authenticated user ID.
  test("should call service with req.body and req.user.id", async () => {

    req.body = {
      studentId: 10,
      statusId: 2,
      remarks: "Interested",
    };

    (interactionService.createInteraction as jest.Mock)
      .mockResolvedValue({ id: 100 });

    await createInteraction(req, res);

    expect(interactionService.createInteraction)
      .toHaveBeenCalledWith(req.body, 1);

  });

});