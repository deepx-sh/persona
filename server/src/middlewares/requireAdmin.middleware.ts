import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (user?.role !== "admin") {
        return next(new ApiError(403,"Forbidden - admin access required"))
    }

    next()
}