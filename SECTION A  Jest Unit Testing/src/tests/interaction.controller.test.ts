// import { Request, Response } from "express";
import { createInteraction } from "../controllers/interaction.controller";
import * as interactionService from "../services/interaction.service";

// Mock the service
jest.mock("../services/interaction.service");

describe("Interaction Controller - createInteraction", () => {
    let req: any;
    let res: any;

    beforeEach(() => {

        req = {
            body: {},
            user: {
                id: 1,
                email: "admin@test.com",
                userType: 1,
            } as any,
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();

    });

    test("Missing studentId -> returns 400", async () => {

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

    test("Missing statusId -> returns 400", async () => {

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

    test("Missing remarks -> returns 400", async () => {

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

    test("Valid input -> returns 201", async () => {

        const interaction = {
            id: 101,
            studentId: 10,
            statusId: 2,
            remarks: "Interested",
        };

        req.body = {
            studentId: 10,
            statusId: 2,
            remarks: "Interested",
        };

        (interactionService.createInteraction as jest.Mock)
            .mockResolvedValue(interaction);

        await createInteraction(req, res);

        expect(res.status).toHaveBeenCalledWith(201);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Interaction logged",
            data: interaction,
        });

    });

    test("Service throws -> returns 500", async () => {

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

    test("Service called with req.body and req.user.id", async () => {

        req.body = {
            studentId: 10,
            statusId: 2,
            remarks: "Interested",
        };

        (interactionService.createInteraction as jest.Mock)
            .mockResolvedValue({ id: 101 });

        await createInteraction(req, res);

        expect(interactionService.createInteraction)
            .toHaveBeenCalledWith(req.body, 1);

    });

});