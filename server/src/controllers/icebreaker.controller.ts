import type { Request, Response } from "express";
import { Contact } from "../models/contact.model.js";
import { Icebreaker } from "../models/icebreaker.model.js";
import { generateIcebreakers } from "../services/icebreaker.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { generateIcebreakerSchema } from "../validations/message.validation.js";

export const generateContactIcebreakers = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const result = generateIcebreakerSchema.safeParse(req.body)
    
    if (!result.success) {
        throw new ApiError(400, "Validation failed", result.error.issues.map((e) => e.message))
    }

    if (typeof req.params.id !== "string") {
        throw new ApiError(400,"ID is missing")
    }
    const contact = await Contact.findOne({ _id: req.params.id, user: userId })
    
    if (!contact) {
        throw new ApiError(404,"Contact not found")
    }

    const texts = await generateIcebreakers(contact, result.data.count)
    
    const saved = await Icebreaker.insertMany(
        texts.map((text)=>({user:userId,contact:contact._id,text}))
    )

    res.status(201).json(new ApiResponse(201,saved,"Icebreakers generated"))
})

export const getContactIcebreakers = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    if (typeof req.params.id !== "string") {
        throw new ApiError(400,"Contact ID is missing")
    }
    const icebreakers = await Icebreaker.find({ contact: req.params.id, user: userId }).sort({createdAt:-1})


    res.status(200).json(new ApiResponse(200,icebreakers))
})