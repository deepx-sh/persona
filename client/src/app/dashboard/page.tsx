"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function DashboardPlaceholderPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/signin")
        }
    }, [isPending, session, router])
    
    if (isPending || !session) {
        return (
            <main className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
                Loading...
            </main>
        )
    }

    async function handleSignOut() {
        await authClient.signOut({
            fetchOptions:{onSuccess:()=>router.push("/signin")}
        })
    }

    return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Temporary placeholder
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Signed in as {session.user.name}</h1>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>

            <Button variant="outline" onClick={handleSignOut}>
                Sign out
            </Button>
        </main>
    )
}