"use client";

import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema,type ResetPasswordValues } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "./form-field";
import { FormAlert } from "./form-alert";
import { SubmitButton } from "./submit-button";
import { ResetLinkInvalid } from "./reset-link-invalid";


export function ResetPasswordForm({ token }: { token: string }) {
    const router = useRouter();

    const [serverError, setServerError] = useState<string | null>(null);
    const [linkInvalid, setLinkInvalid] = useState(false);

    const { register,handleSubmit,formState:{errors,isSubmitting}} = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues:{password:"",confirmPassword:""}
    })

    async function onSubmit(values: ResetPasswordValues) {
        setServerError(null);

        const { error} = await authClient.resetPassword({
            newPassword: values.password,
            token
        })

        if (error) {
            if (error.code === "INVALID_TOKEN") {
                setLinkInvalid(true);
                return;
            }

            setServerError(
                error.status === 429
                    ? "Too many attempts. Please wait a few minutes and try again."
                    :error.message || "Couldn't reset your password. Please try again"
            )

            return;
        }

        router.push("/signin?reset=success")
    }
    if (linkInvalid) {
        return <ResetLinkInvalid/>
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1.5">
                <h1 className="text-2x; font-semibold tracking-tight">
                    Set a new password
                </h1>

                <p className="text-sm text-muted-foreground">
                    Choose a strong password you haven&apos;t used before.
                </p>
            </div>

            {serverError && <FormAlert>{serverError}</FormAlert>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <FormField
                    label="New password"
                    type="password"
                    autoComplete="new-password"
                    hint="At least 8 characters, with upper and lower case letter and a number"
                    error={errors.password?.message}
                    {...register("password")}
                />

                <FormField
                    label="Confirm new password"
                    type="password"
                    autoComplete="new-password"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                />

                <SubmitButton loading={isSubmitting} loadingText="Updating password...">
                    Update password
                </SubmitButton>
            </form>
        </div>
    )
}
