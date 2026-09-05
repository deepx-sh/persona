import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next:NextFunction
): void => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = (error as any)?.statusCode || (error as any)?.status || 500;
        const message = (error as any)?.message || "Internal Server Error"
        error = new ApiError(statusCode, message, [], (error as any)?.stack)
    }

    const apiError = error as ApiError
    
    if (process.env.NODE_ENV === "development") {
        console.error(apiError);
    }

    res.status(apiError.statusCode).json({
        success: apiError.success,
        message: apiError.message,
        errors: apiError.errors,
        ...(process.env.NODE_ENV==="development"?{stack:apiError.stack}:{})
    })
}