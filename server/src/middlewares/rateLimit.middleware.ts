import rateLimit from "express-rate-limit";
import { error } from "node:console";

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: "Too many attempts. Please try again later" },
    standardHeaders: true,
    legacyHeaders:true
})