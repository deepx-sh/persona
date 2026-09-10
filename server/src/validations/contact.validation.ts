import z from "zod"

export const contactRowSchema = z.object({
    Name: z.string().trim().min(1, "Name is required"),
    Company: z.string().trim().min(1, "Company is required"),
    Role: z.string().trim().min(1, "Role is required"),
    "LinkedIn URL":z.url()
})

export const contactUpdateSchema = z.object({
    name: z.string().trim().min(1, "Name is required").optional(),
    company: z.string().trim().min(1, "Company is required").optional(),
    role: z.string().min(1, "Role is required").optional(),
    linkedinUrl: z.url().optional()
})
