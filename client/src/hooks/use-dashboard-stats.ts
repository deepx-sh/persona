import { apiGet } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { DashboardStats } from "@/types/dashboard";

export const dashboardKeys = {
    stats:["dashboard","stats"] as const
}

export function useDashboardStats() {
    return useQuery({
        queryKey: dashboardKeys.stats,
        queryFn:()=>apiGet<DashboardStats>("/api/dashboard/stats")
    })
}