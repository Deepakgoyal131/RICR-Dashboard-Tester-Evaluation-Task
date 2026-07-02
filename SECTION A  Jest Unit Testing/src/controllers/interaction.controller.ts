import { Request, Response } from "express";
import * as interactionService from "../services/interaction.service";

export const createInteraction = async (
    req: Request,
    res: Response
) => {
    try {
        const { studentId, statusId, remarks } = req.body;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: "Student ID is required",
            });
        }

        if (!statusId) {
            return res.status(400).json({
                success: false,
                message: "Status ID is required",
            });
        }

        if (!remarks) {
            return res.status(400).json({
                success: false,
                message: "Remarks are required",
            });
        }

        const result = await interactionService.createInteraction(
            req.body,
            (req as any).user.id
        );

        return res.status(201).json({
            success: true,
            message: "Interaction logged",
            data: result,
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};