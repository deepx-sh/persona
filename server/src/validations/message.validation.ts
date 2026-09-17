import z from "zod"
export const generateMessageSchema = z.object({
    type: z.enum(["linkedin_note", "cold_email", "follow_up"]),
    tone:z.enum(["professional","friendly","casual","direct"]).default("professional")
})