"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validations/auth";
import { Button } from "../ui/button";
import { FormField } from "./form-field";
import { FormAlert } from "./form-alert";
import { SubmitButton } from "./submit-button";

export function ForgotPasswordForm() {
    const [serverError, setServerError] = useState<string | null>(null)
    const [sentTo, setSentTo] = useState<string | null>(null);

    const { register, handleSubmit,formState:{errors,isSubmitting}} = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues:{email:""}
    })

    async function onSubmit(values: ForgotPasswordValues) {
        setServerError(null);

        const {error } = await authClient.requestPasswordReset({
            email: values.email,
            redirectTo:`${window.location.origin}/reset-password`
        })

        if (error) {
            setServerError(
                error.status === 429
                    ? "Too many attempts. Please wait a few minutes and try again."
                    : error.message || "Something went wrong. Please try again."
            )
            return;
        }

        setSentTo(values.email);
    }

    if (sentTo) {
        return (
            <div className="space-y-6">
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Mail className="size-6" aria-hidden/>
                </div>

                <div className="space-y-1.5">
                    <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
                    <p className="text-sm text-muted-foreground">
                        If an account exists for{" "}
                    </p>
                    <span className="font-medium text-foreground">{sentTo}</span>, we&apos;ve sent a link to
                    reset your password.
                </div>

                <div className="space-y-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-full"
                        onClick={()=>setSentTo(null)}
                    >
                        Use a different email
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        <Link href="/signin" className="font-medium text-primary hover:underline">
                        Back to sign in</Link>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1.5">
                <h1 className="text-2xl font-semibold tracking-tight">Forgot your password</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email and we&apos;ll send you a link to reset it.
                </p>
            </div>

            {serverError && <FormAlert>{serverError}</FormAlert>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <FormField
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    error={errors.email?.message}
                    {...register("email")}
                />

                <SubmitButton loading={isSubmitting} loadingText="Sending link...">
                    Send reset link
                </SubmitButton>
            </form>

            <Link
                href="signin"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="size-4" aria-hidden />
                Back to sign in
            </Link>
        </div>
    )
}