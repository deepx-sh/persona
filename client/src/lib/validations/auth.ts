import { z } from "zod"

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters")
  .regex(/[A-Z]/, "Include an uppercase letter")
  .regex(/[a-z]/, "Include a lowercase letter")
  .regex(/[0-9]/, "Include a number")
  
const emailSchema = z
  .string()
  .min(1,"Email is required").
  check(z.trim(), z.email("Invalid email address"), z.toLowerCase())
  

export const signInSchema = z.object({
  email: emailSchema,
  password:z.string().min(1,"Password is required")
})

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(50, "Name is too long"),
  email: emailSchema,
  password:passwordSchema
})

export type SignInValues = z.infer<typeof signInSchema>;
export type SingUpValues = z.infer<typeof signUpSchema>;