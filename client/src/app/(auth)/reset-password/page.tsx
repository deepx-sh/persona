import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { ResetLinkInvalid } from "@/components/auth/reset-link-invalid";

export const metadata: Metadata = {
    title: "Reset password",
    referrer:"no-referrer"
}

export default async function ResetPasswordPage({
    searchParams
}: {
        searchParams: Promise<{ token?: string; error?: string }>;
    }) {
    const { token, error } = await searchParams;
    
    if (error || typeof token !== "string" || !token) {
        return <ResetLinkInvalid/>
    }

    return <ResetPasswordForm token={token} />
}