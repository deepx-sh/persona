import type { Metadata } from "next";
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";


export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <DashboardGreeting />
            <DashboardOverview/>
        </div>
    )
}