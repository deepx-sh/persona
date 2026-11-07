import { VerifyEmailPanel } from "@/components/auth/verify-email-panel";
import type { Metadata } from "next";


export const metadata: Metadata = { title: "Verify your email" }

export default async function VerifyEmailPage({
    searchParams
}: {
    searchParams:Promise<{email?:string}>
    }) {
    const { email } = await searchParams;
    return <VerifyEmailPanel email={typeof email==="string" ? email:undefined} />
}