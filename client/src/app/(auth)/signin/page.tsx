import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({
    searchParams,
}: {
        searchParams: Promise<{ error?: string; reset?:string}>;
    }) {
    const { error,reset } = await searchParams;
    return <SignInForm oauthError={Boolean(error)} passwordReset={reset==="success"} />
}