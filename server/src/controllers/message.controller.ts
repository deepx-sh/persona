import type { Request, Response } from "express";
import { Contact } from "../models/contact.model.js";
import { Message } from "../models/message.model.js";
import { generateMessage } from "../services/messageGenerator.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { generateMessageSchema } from "../validations/message.validation.js";
import { Template } from "../models/template.model.js";

export const generateContactMessage = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const result = generateMessageSchema.safeParse(req.body)
    if (!result.success) {
        throw new ApiError(400, "Validation failed", result.error.issues.map((e) => e.message))
    }

    if (!req.params.id) {
        throw new ApiError(400,"Contact ID is missing")
    }
    const contact = await Contact.findOne({ _id: req.params.id, user: userId })

    if (!contact) {
        throw new ApiError(404,"Contact not found")
    }
    
    const { type, tone, templateId } = result.data
    
    let templateGuidance: string | undefined;

    if (templateId) {
        const template = await Template.findOne({ _id: templateId, user: userId })
        if (!template) {
            throw new ApiError(404,"Template not found")
        }
        templateGuidance=template.promptGuidance
    }
    
    const generated = await generateMessage(contact, type, tone)
    
    const message = await Message.create({
        user: userId,
        contact: contact._id,
        type,
        tone,
        ...(!generated.subject!=undefined && {subject:generated.subject}),
        content:generated.content,
    })

    res.status(201).json(new ApiResponse(201,message,"Message generated"))
})

export const getContactMessage = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    if (!req.params.id) {
        throw new ApiError(400,"Contact ID is missing")
    }
    const contact = await Contact.findOne({ _id: req.params.id, user: userId })
    
    if (!contact) {
        throw new ApiError(404,"Contact not found")
    }
    const messages = await Message.find({ contact: contact._id, user: userId }).sort({ createdAt: -1 })
    
    res.status(200).json(new ApiResponse(200,messages))
})


export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    if (!req.params.messageId) {
        throw new ApiError(400,"Message ID is missing")
    }

    const message = await Message.findOneAndReplace({ _id: req.params.messageId, user: userId })
    
    if (!message) {
        throw new ApiError(404,"Message not found")
    }

    res.status(200).json(new ApiResponse(200,null,"Message deleted"))
})