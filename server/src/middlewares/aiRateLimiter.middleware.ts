import type { Request } from "express";
import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";

const perMinute = parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE || "10", 10);
const perDay = parseInt(process.env.AI_RATE_LIMIT_PER_DAY || "150", 10)

const keyByUser = (req: Request): string => (req as any).user.id;

export const aiBurstLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: perMinute,
    keyGenerator: keyByUser,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new ApiError(429,"You're generating too fast. Please wait a minute and try again."))
    }
})

export const aiDailyLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    limit: perDay,
    keyGenerator: keyByUser,
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true,
    handler: (req, res, next) => {
        next(new ApiError(429,"Daily AI generationg limit reached. Please try again tomorrow."))
    }
})