import type { Request, Response } from "express";
import { Contact } from "../models/contact.model.js";
import { Message } from "../models/message.model.js";
import { exportContactsCSV, exportMessagesCSV, exportContactsExcel, exportMessageExcel } from "../services/export.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


export const exportContacts = asyncHandler(async (req: Request, res: Response) => {
    const userId= (req as any).user.id;
    const format = (req.query.format as string) || "csv";

    const contacts = await Contact.find({ user: userId }).sort({ createdAt: -1 });

    if (contacts.length === 0) {
        throw new ApiError(404,"No contacts to export")
    }

    if (format === "xlxs") {
        const buffer = await exportContactsExcel(contacts);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

        res.setHeader("Content-Disposition", "attachment; filename=persora-contacts.xlsx")
        return res.send(buffer)
    }

    const csv = exportContactsCSV(contacts);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=persora-contacts.csv")
    res.send(csv);
})

export const exportMessages = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const format = (req.query.format as string) || "csv"
    
    const messages = await Message.find({ user: userId })
        .populate("contact")
        .sort({ createdAt: -1 })
    
    if (messages.length === 0) {
        throw new ApiError(404,"No messages to export")
    }

    const typedMessages = messages as any;

    if (format === "xlsx") {
        const buffer = await exportMessageExcel(typedMessages);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        res.setHeader("Content-Disposition", "attachment; filename=persora-messages.xlsx")
        return res.send(buffer)
    }

    const csv = exportMessagesCSV(typedMessages);
    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=persora-messages.csv")
    res.send(csv)
})