import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { ApiError } from "../utils/ApiError.js";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { auth } = await import("../config/auth.js")
        
        const session = await auth.api.getSession({
            headers:fromNodeHeaders(req.headers)
        })

        if (!session) {
            throw new ApiError(401,"Unauthorized - please sign it")
        }
        
        (req as any).user = session.user
        next();
    } catch (error) {
        next(error)
    }
}