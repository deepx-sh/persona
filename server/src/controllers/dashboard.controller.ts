import type { Request, Response } from "express"
import { Types } from "mongoose"
import { Contact } from "../models/contact.model.js"
import { Message } from "../models/message.model.js"
import { Icebreaker } from "../models/icebreaker.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"

interface CountBucket{
    _id: string;
    count: number;
}

const toRecord = (buckets: CountBucket[]): Record<string, number> =>
    buckets.reduce((acc, b) => {
        acc[b._id] = b.count;
        return acc;
    }, {} as Record<string, number>)
    

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id
    
    const userObjectId = new Types.ObjectId(userId)
    
    const [
        totalContacts,
        analyzedContacts,
        totalMessages,
        totalIcebreakers,
        byType,
        byLanguage,
        byTone,
        recentMessages
    ] = await Promise.all([
        Contact.countDocuments({ user: userId }),
        Contact.countDocuments({ user: userId, "analyzedProfile.analyzedAt": { $exists: true } }),
        Message.countDocuments({ user: userId }),
        Icebreaker.countDocuments({ user: userId }),
        Message.aggregate<CountBucket>([
            { $match: { user: userObjectId } },
            {$group:{_id:"$type",count:{$sum:1}}}
        ]),
        Message.aggregate<CountBucket>([
            { $match: { user: userObjectId } },
            {$group:{_id:"$language",count:{$sum:1}}}
        ]),
        Message.aggregate<CountBucket>([
            { $match: { user: userObjectId } },
            {$group:{_id:"$language",count:{$sum:1}}}
        ]),
        Message.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("contact","name company")
    ])

    res.status(200).json(
        new ApiResponse(200, {
            totals: {
                contacts: totalContacts,
                analyzedContacts,
                messages: totalMessages,
                icebreakers:totalIcebreakers,
            },
            messageBreakdown: {
                byType: toRecord(byType),
                byLanguage: toRecord(byLanguage),
                byTone:toRecord(byTone)
            },
            recentMessages
        })
    )
})