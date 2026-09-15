import type { Request, Response } from "express";
import { Contact } from "../models/contact.model.js";
import { analyzeProfileText } from "../services/profileAnalyzerService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { analyzeProfileSchema } from "../validations/contact.validation.js";


export const analyzeContactProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const result = analyzeProfileSchema.safeParse(req.body);

    if (!result.success) {
        throw new ApiError(400, "Validation failed", result.error.issues.map((e) => e.message))
    }
        
    const contactId = req.params.id;

    if (!contactId) {
        throw new ApiError(400,"Contact ID is missing")
    }
    const contact = await Contact.findOne({ _id: contactId, user: userId })
    if (!contact) {
        throw new ApiError(404,"Contact not found")
    }
    
    const { rawProfileText } = result.data
    
    const analyzed = await analyzeProfileText(
        contact.name,
        contact.company,
        contact.role,
        rawProfileText
    )

    contact.rawProfileText = rawProfileText;
    contact.analyzedProfile = {
        jobTitle: analyzed.jobTitle,
        skills: analyzed.skills,
        about: analyzed.about,
        analyzedAt: new Date(),
    }

    await contact.save();

    res.status(200).json(new ApiResponse(200,contact,"Profile analyzed successfully"))
})