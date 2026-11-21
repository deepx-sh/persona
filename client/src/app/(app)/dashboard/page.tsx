import type { Metadata } from "next";
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <DashboardGreeting />
            
            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                Stats and recent activity arrive in the next step.
            </div>
        </div>
    )
}