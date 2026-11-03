"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { FormAlert } from "./form-alert";

const RESEND_COOLDOWN_SECONDS = 60;

interface Feedback{
    type: "success" | "error";
    message: string;
}

export function VerifyEmailPanel({ email }: { email?: string }) {
    const [cooldown, setCooldown] = useState(0);
    const [sending, setSending] = useState(false);
    const [feedback, setFeedback] = useState<Feedback | null>(null);


    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    async function handleResend() {
        if (!email) return;

        setSending(true);
        setFeedback(null);

        const { error } = await authClient.sendVerificationEmail({
            email,
            callbackURL:`${window.location.origin}/dashboard`
        })

        setSending(false);

        if (error) {
            setFeedback({
                type: "error",
                message: error.status === 429
                    ? "Too many requests. Please wait a few minutes and try again."
                    :error.message || "Couldn't send the email. Please try again"
            })

            return;
        }

        setFeedback({ type: "success", message: "Verification email sent. Check your inbox" })
        setCooldown(RESEND_COOLDOWN_SECONDS);

    }

    return (
        <div className="space-y-6">
            <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Mail className="size-6" aria-hidden/>
            </div>

            <div className="space-y-1.5">
                <h1 className="text-2xl font-semibold tracking-tight">Check your inbox</h1>
                <p className="text-sm text-muted-foreground">
                    {email ? (
                        <>
                            We sent a verification link to{" "}
                            <span className="font-medium text-foreground">{email}</span>. Click it to activate
                            your account.
                        </>
                    ) : (
                            "We sent you a verification link. Click it to activate your account."
                    )}
                </p>
            </div>

            {feedback && <FormAlert variant={feedback.type}>{feedback.message}</FormAlert>}

            <div className="space-y-3">
                {email && (
                    <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-full"
                        onClick={handleResend}
                        disabled={sending || cooldown>0}
                    >
                        {cooldown>0? `Resend in ${cooldown}s`:sending ? "Sending...":"Resend email"}
                    </Button>
                )}

                <p className="text-center text-sm text-muted-foreground">
                    Didn&amp;t get it? Check your span folder.{" "}
                    <Link href="/signin" className="font-medium text-primary hover:underline">
                    Back to sign in</Link>
                </p>
            </div>
        </div>
    )
}