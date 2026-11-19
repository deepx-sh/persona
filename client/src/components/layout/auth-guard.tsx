"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

function AppLoading() {
    return (
        <div
            role="status"
            aria-label="Loading"
            className="min-h-svh lg:grid lg:grid-cols[16rem_minmax(0,1fr)]"
        >
            <aside className="hidden space-y-3 border-r bg-muted/40 p-4 lg:block">
                <Skeleton className="h-8 w-32 bg-muted" />
                <div className="space-y-2 pt-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-full bg-muted"/>
                    ))}
                </div>
            </aside>

            <div className="flex min-w-0 flex-col">
                <div className="h-14 border-b"></div>
                <div className="space-y-4 p-8">
                    <Skeleton className="h-8 w-56 bg-muted" />
                    <Skeleton className="h-32 w-full bg-muted"/>
                </div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    )
}


export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { data: session, isPending } = authClient.useSession()
    
    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/signin");
        }
    }, [isPending, session, router])
    
    if (isPending || !session) {
        return <AppLoading/>
    }

    return <>{children}</>
}