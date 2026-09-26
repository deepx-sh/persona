import type { Request, Response } from "express";
import { Template } from "../models/template.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createTemplateSchema, updateTemplateSchema } from "../validations/template.validation.js";
import { seedSystemTemplates } from "../utils/seedTemplate.js";
import { ApiError } from "../utils/ApiError.js";

export const getTemplates = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    await seedSystemTemplates(userId)

    const templates = await Template.find({ user: userId }).sort({ isSystemDefault: -1, createdAt: -1 })
    res.status(200).json(new ApiResponse(200,templates))
})

