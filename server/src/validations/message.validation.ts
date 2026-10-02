import z from "zod"

export const generateIcebreakerSchema = z.object({
    count:z.number().int().min(1).max(5).default(3)
})

const languageEnum=z.enum(["en","hi","es","de"]).default("en")

export const generateMessageSchema = z.object({
    type: z.enum(["linkedin_note", "cold_email", "follow_up"]),
    tone: z.enum(["professional", "friendly", "casual", "direct"]).default("professional"),
    templateId: z.string().optional(),
    language: languageEnum,
    generateVariants:z.boolean().default(false)
})