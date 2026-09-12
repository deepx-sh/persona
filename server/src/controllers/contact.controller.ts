import type { Request, Response } from "express";
import { parse } from "csv-parse/sync"
import { Contact } from "../models/contact.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { contactRowSchema,contactUpdateSchema } from "../validations/contact.validation.js";
import z from "zod";

export const uploadContactsCSV=asyncHandler(async(req:Request,res:Response)=>{
    const userId = (req as any).user.id
    
    if (!req.file) {
        throw new ApiError(400,"No CSV file uploaded")
    }

    let records: Record<string, string>[];

    try {
        records = parse(req.file.buffer, {
            columns: true,
            skip_empty_lines: true,
            trim:true
        })
    } catch (err) {
        throw new ApiError(400,"Failed to parse CSV file")
    }

    const validRows: any[] = []
    const errors: { row: number; issues: string[] }[] = [];

    records.forEach((row, index) => {
        const result = contactRowSchema.safeParse(row)
        if (result.success) {
            validRows.push({
                user: userId,
                name: result.data.Name,
                company: result.data.Company,
                role: result.data.Role,
                linkedinUrl:result.data["LinkedIn URL"]
            })
        } else {
            errors.push({
                row: index + 2,
                issues: result.error.issues.map((e)=>e.message)
            })
        }
    })

    if (validRows.length === 0) {
        throw new ApiError(400,"No valid rows found in CSV",errors)
    }

    const inserted = await Contact.insertMany(validRows, { ordered: false })
    
    res.status(201).json(new ApiResponse(201,{insertedCount:inserted.length,skippedCount:errors.length,errors},"CSV processed"))
})

export const getContacts = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string) || "";

    const filter: any = { user: userId };
    if (search) {
        filter.$text={$search:search}
    }

    const [contacts, total] = await Promise.all(
        [Contact.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),Contact.countDocuments(filter)]
    )

    res.status(200).json(new ApiResponse(200, { contacts, pagination: { page,limit,total,totalPags:Math.ceil(total/limit)}}))
})

export const getContactById = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const contact = await Contact.findOne({_id:req.params.id as string,user:userId})
    
    if (!contact) {
        throw new ApiError(404,"Contact not found")
    }

    res.status(200).json(new ApiResponse(200,contact))
})


export const updateContact = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = contactUpdateSchema.safeParse(req.body)
    
    
    if (!result.success) {
        throw new ApiError(400,"Validation failed",z.flattenError(result.error).fieldErrors as any)
    }

    const contact = await Contact.findOneAndUpdate(
        { _id: req.params.id as string, user: userId },
        { $set: result.data },
        {new:true}
    )

    if (!contact) {
        throw new ApiError(404,"Contact not found")
    }

    res.status(200).json(new ApiResponse(200,contact,"Contact updated"))
})

export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const contact = await Contact.findOneAndDelete({ _id: req.params.id as string, user: userId })
    
    if (!contact) {
        throw new ApiError(404,"Contact not found")
    }

    res.status(200).json(new ApiResponse(200,null,"Contact deleted"))
})