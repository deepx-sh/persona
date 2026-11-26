import { Skeleton } from "../ui/skeleton";

export function DashboardSkeleton() {
    return (
        <div className="space-y-6" role="status" aria-label="Loading dashboard">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-xl bg-muted"/>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <Skeleton className="h-96 rounded-xl bg-muted lg:col-span-2" />
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-36 rounded-xl bg-muted"/>
                    ))}
                </div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    )
}