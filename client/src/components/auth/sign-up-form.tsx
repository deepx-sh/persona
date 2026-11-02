"use client";

import { authClient } from "@/lib/auth-client";
import { signUpSchema, type SignUpValues } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "./form-field";
import { FormAlert } from "./form-alert";
import { SubmitButton } from "./submit-button";
import { GoogleButton } from "./google-button";
import { AuthDivider } from "./auth-divider";



export function SignUpForm() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null)
    
    const {register,handleSubmit,setError,formState:{errors,isSubmitting} } = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues:{name:"",email:"",password:""}
    })

    async function onSubmit(values: SignUpValues) {
        setServerError(null)

        const {error } = await authClient.signUp.email({
            name: values.name,
            email: values.email,
            password: values.password,
            callbackURL:`${window.location.origin}/dashboard`
        })

        if (error) {
            if (error.code?.startsWith("USER_ALREADY_EXISTS")) {
                setError("email", { message: "An account with this email already exists." })
                return
            }

            setServerError(
            error?.status === 429
                ? "Too many attempts. Please wait a few minutes and try again."
                :error?.message || "Something went wrong. Please try again"
        )

        return;
        }

        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`)
    }
    return (
        <div className="space-y-6">
            <div className="space-y-1.5">
                <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
                <p className="text-sm text-muted-foreground">Start writing outreach that gets replies.</p>
            </div>

            {serverError && <FormAlert>{serverError}</FormAlert>}
            <GoogleButton label="Sign up with Google" onError={setServerError}/>
            <AuthDivider>or sign up with email</AuthDivider>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <FormField
                    label="Full name"
                    autoCapitalize="none"
                    placeholder="Olivia Rodrigo"
                    error={errors.name?.message}
                    {...register("name")}
                />

                <FormField
                    label="Work email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    error={errors.email?.message}
                    {...register("email")}
                />

                <FormField
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    hint="At least 8 characters, with upper and lower case letters and a number"
                    error={errors.password?.message}
                    {...register("password")}
                />

                <SubmitButton loading={isSubmitting} loadingText="Creating account...">
                    Create account
                </SubmitButton>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/signin" className="font-medium text-primary hover:underline">
                Sign in</Link>
            </p>
        </div>
    )
}