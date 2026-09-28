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

export const createTemplates = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const result = createTemplateSchema.safeParse(req.body);
    if (!result.success) {
        throw new ApiError(400,"Validation failed",result.error.issues.map((e) => e.message))
    }

    const data=result.data
    const template = await Template.create({
        name: data.name,
        category: data.category,
        ...(data.description!==undefined ? {description:data.description}:{}),
        promptGuidance: data.promptGuidance,
        user: userId,
        isSystemDefault:false
    })
     
    res.status(201).json(new ApiResponse(201,template,"Template created"))
})

export const updateTemplate = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const result = updateTemplateSchema.safeParse(req.body)
    
    if (!result.success) {
        throw new ApiError(400,"Validation failed",result.error.issues.map((e) => e.message))
    }

    if(typeof req.params.id!== "string"){
        throw new ApiError(400,"Template ID is required")
    }
    const template = await Template.findOneAndUpdate(
        { _id: req.params.id, user: userId } ,
        { $set: result.data },
        {new:true}
    )

    if (!template) {
        throw new ApiError(404,"Template not found")
    }

    res.status(200).json(new ApiResponse(200,template,"Template updated"))
})

export const deleteTemplates = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id
    
    if(typeof req.params.id!== "string"){
        throw new ApiError(400,"Template ID is required")
    }
    const template = await Template.findOneAndDelete({ _id: req.params.id, user: userId })
    
    if (!template) {
        throw new ApiError(404,"Template not found")
    }

    res.status(200).json(new ApiResponse(200,null,"Template deleted"))
})