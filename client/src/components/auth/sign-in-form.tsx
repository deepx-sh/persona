"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { signInSchema, type SignInValues } from "@/lib/validations/auth";
import { FormField } from "./form-field";
import { FormAlert } from "./form-alert";
import { SubmitButton } from "./submit-button";
import { GoogleButton } from "./google-button";
import { AuthDivider } from "./auth-divider";

interface SignInFormProps{
    oauthError?: boolean;
}

export function SignInForm({oauthError=false}:SignInFormProps) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(
        oauthError?"We couldn't sign you in with Google. Please try again.":null
    )

    const {
        register,
        handleSubmit,
        formState:{errors,isSubmitting}
    } = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues:{email:"",password:""}
    })

    async function onSubmit(values:SignInValues) {
        setServerError(null);

        const { error} = await authClient.signIn.email({
            email: values.email,
            password:values.password
        })

        if (error) {
            if (error.code === "EMAIL_NOT_VERIFIED") {
                router.push(`/verify-email?email=${encodeURIComponent(values.email)}`)
                return;
            }

            setServerError(
                error.status === 429 ? "Too many attempts. Please wait a few minutes and try again."
                    :error.message || "Invalid email or password."
            )

            return;
        }

        router.push("/dashboard")
        router.refresh()
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1.5">
                <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                <p className="text-sm text-muted-foreground">Sign in to your Persona account</p>
            </div>

            {serverError && <FormAlert>{serverError}</FormAlert>}

            <GoogleButton onError={setServerError} />
            
            <AuthDivider>or continue with email</AuthDivider>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                <FormField
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    error={errors.email?.message}
                    {...register("email")}
                />

                <FormField
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    error={errors.password?.message}
                    labelAction={
                        <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                            Forgot password?
                        </Link>
                    }
                    {...register("password")}
                />

                <SubmitButton loading={isSubmitting} loadingText="Signing in...">
                    Sign in
                </SubmitButton>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                New to Persona?{" "}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                    Create an account
                </Link>
            </p>
        </div>
    )
}