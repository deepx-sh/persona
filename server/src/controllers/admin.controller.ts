import type { Request, Response } from "express"
import mongoose, { Model, Types } from "mongoose"
import { fromNodeHeaders } from "better-auth/node"
import { Contact } from "../models/contact.model.js"
import { Message } from "../models/message.model.js"
import { Icebreaker } from "../models/icebreaker.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { setRoleSchema, banUserSchema } from "../validations/admin.validations.js"
import { from } from "node:stream/iter"


const usersCollection = () => mongoose.connection.db!.collection("user")

const USER_PROJECTION = {
    name: 1,
    email: 1,
    emailVerified: 1,
    role: 1,
    banned: 1,
    banReason: 1,
    banExpires: 1,
    createdAt:1
}

const countByUser = async (model: Model<any>, ids: Types.ObjectId[]) => {
    const rows = await model.aggregate<{ _id: Types.ObjectId; count: number }>([
        { $match: { user: { $in: ids } } },
        {$group:{_id:"$user",count:{$sum:1}}}
    ])

    return new Map(rows.map((r)=>[r._id.toString(),r.count]))
}

const getUsageForUsers = async (ids: Types.ObjectId[]) => {
    const [contacts, messages, icebreakers] = await Promise.all([
        countByUser(Contact, ids),
        countByUser(Message, ids),
        countByUser(Icebreaker,ids)
    ])

    return (id: Types.ObjectId) => ({
        contacts: contacts.get(id.toString()) || 0,
        messages: messages.get(id.toString()) || 0,
        icebreakers:icebreakers.get(id.toString()) || 0
    })
}

const assertValidId = (id: string) => {
    if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(400,"Invalid user id")
    }
}

const assertNotSelf = (req: Request, targetId: string) => {
    if ((req as any).user.id === targetId) {
        throw new ApiError(400,"You cannot perform this action on your own account")
    }
}

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const search = ((req.query.search as string) || "").trim()
    
    const filter: Record<string, unknown> = {};
    if (search) {
        const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "i");
        filter.$or = [{ name: regex }, { email: regex }];
    }

    const [users, total] = await Promise.all([
        usersCollection()
            .find(filter, { projection: USER_PROJECTION })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray(),
        usersCollection().countDocuments(filter)
    ])

    const usageFor = await getUsageForUsers(users.map((u) => u._id as Types.ObjectId));

    const data = users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        emailVerified: u.emailVerified,
        role: u.role || "user",
        banned: Boolean(u.banned),
        banReason: u.banReason,
        banExpires: u.banExpires,
        createdAt: u.createdAt,
        usage:usageFor(u._id as Types.ObjectId)
    }))

    res.status(200).json(
        new ApiResponse(200, {
            users: data,
            pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}
        })
    )
})


export const getUserById = asyncHandler(async(req: Request, res: Response) => {

    if (typeof req.params.id !== "string") {
        throw new ApiError(400,"User id is required")
    }
    assertValidId(req.params.id);
    const objectId = new Types.ObjectId(req.params.id)
    
    const user = await usersCollection().findOne({ _id: objectId }, { projection: USER_PROJECTION })

    if (!user) {
        throw new ApiError(404,"User not found")
    }

    const usageFor = await getUsageForUsers([objectId])
    const lastMessage = await Message.findOne({ user: objectId }).sort({ createdAt: -1 }).select("createdAt")
    

    res.status(200).json(
        new ApiResponse(200, {
            id: user._id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            role: user.role || "user",
            banned: Boolean(user.banned),
            banReason: user.banReason,
            banExpires: user.banExpires,
            createdAt: user.createdAt,
            usage: usageFor(objectId),
            lastActiveAt:lastMessage?.createdAt || null
        })
    )
})

export const setUserRole = asyncHandler(async (req: Request, res: Response) => {
    
    if (typeof req.params.id !== "string") {
        throw new ApiError(400,"User ID is required")
    }

    assertValidId(req.params.id)
    assertNotSelf(req, req.params.id)
    
    const result = setRoleSchema.safeParse(req.body)
    if (!result.success) {
        throw new ApiError(400, "Validation failed", result.error.issues.map((e) => e.message))
    }

    const { auth } = await import("../config/auth.js")
    await auth.api.setRole({
        body: { userId: req.params.id, role: result.data.role },
        headers:fromNodeHeaders(req.headers)
    })

    res.status(200).json(new ApiResponse(200,null,`Role updated to ${result.data.role}`))
})


export const banUser = asyncHandler(async (req: Request, res: Response) => {
    if (typeof req.params.id !== "string") {
        throw new ApiError(400,"User ID is required")
    }

    assertValidId(req.params.id);
    assertNotSelf(req, req.params.id);

    const result = banUserSchema.safeParse(req.body)
    if (!result.success) {
        throw new ApiError(400,"Validation failed",result.error.issues.map((e) => e.message))
    }

    const { reason, expiresInDays } = result.data
    
    const { auth } = await import("../config/auth.js");

    await auth.api.banUser({
        body: {
            userId: req.params.id,
            banReason: reason,
            banExpiresIn:expiresInDays ? expiresInDays *24*60*60:undefined
        },
        headers:fromNodeHeaders(req.headers)
    })

    res.status(200).json(new ApiResponse(200,null,"User banned"))
})

export const unbanUser = asyncHandler(async (req: Request, res: Response) => {
    if (typeof req.params.id !== "string") {
        throw new ApiError(400,"User ID is required")
    }

    assertValidId(req.params.id);

    const { auth } = await import("../config/auth.js")
    
    await auth.api.unbanUser({
        body: { userId: req.params.id },
        headers:fromNodeHeaders(req.headers)
    })

    res.status(200).json(new ApiResponse(200,null,"User unbanned"))
})


export const getPlatformStats = asyncHandler(async (req: Request, res: Response) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    const [
        totalUsers,
        verifiedUsers,
        bannedUsers,
        newUsersLast7Days,
        totalContacts,
        totalMessages,
      totalIcebreakers
    ] = await Promise.all([
        usersCollection().countDocuments({}),
        usersCollection().countDocuments({ emailVerified: true }),
        usersCollection().countDocuments({ banned: true }),
        usersCollection().countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        Contact.countDocuments({}),
        Message.countDocuments({}),
        Icebreaker.countDocuments({})
    ])

    res.status(200).json(
        new ApiResponse(200, {
            users: {
                total: totalUsers,
                verified: verifiedUsers,
                banned: bannedUsers,
                newLast7Days:newUsersLast7Days
            },
            usage: {
                contacts: totalContacts,
                messages: totalMessages,
                icebreakers:totalIcebreakers
            }
        })
    )
})