import type { Request, Response, NextFunction } from "express";

import z from 'zod'

type ValidateTarget="body"|"params"|"query"

export const validate = (schema: z.ZodType, target: ValidateTarget = "body") => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({
            error: "Validation failed",
            details:z.flattenError(result.error).fieldErrors
        })
    }

    req.body = result.data;
    next()
}