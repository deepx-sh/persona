import { z } from "zod"

export const signUpSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(50,"Name cannot exceed 50 characters"),
    email: z.
        string()
        .check(z.trim(), z.email("Invalid email address"), z.toLowerCase()),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain uppercase, lowercase, number and special characters"
        )
})

export const signInSchema = z.object({
    email: z.string().check(z.trim(), z.email("Invalid email address"), z.toLowerCase()),
    password:z.string().min(1,"Password is required")
})

export const forgotPasswordSchema = z.object({
    email:z.string().check(z.trim(), z.email("Invalid email address"), z.toLowerCase())
})

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    newPassword:z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain uppercase, lowercase, number and special characters"
        )
})