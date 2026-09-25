import z from "zod";

export const createTemplateSchema = z.object({
    name: z.string().min(1, "Name is required").max(60),
    category: z.enum(["recruitment", "saas_sales", "partnership", "investor_outreach", "custom"]),
    description: z.string().max(200).optional(),
    promptGuidance:z.string().min(10,"Guidance must be at least 10 characters")
})

export const updateTemplateSchema=createTemplateSchema.partial()