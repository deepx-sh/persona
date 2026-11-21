"use client";

import { authClient } from "@/lib/auth-client";


export function DashboardGreeting() {
    const { data: session } = authClient.useSession();
    const firstName = session?.user.name?.split(" ")[0];

    return (
        <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">
                {firstName ? `Welcome back, ${firstName}`:"Dashboard"}
            </h1>

            <p className="text-sm text-mauve-50">Here&apos;s an overview of your outreach.</p>
        </div>
    )
}