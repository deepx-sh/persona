import z from "zod";

export const setRoleSchema = z.object({
    role:z.enum(["user","admin"])
})

export const banUserSchema = z.object({
    reason: z.string().max(200).optional(),
    expiresInDays:z.number().int().positive().optional()
})