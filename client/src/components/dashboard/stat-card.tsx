import type { LucideIcon } from "lucide-react";

interface StatCardProps{
    label: string;
    value: number;
    icon: LucideIcon;
    caption?: string;
}

export function StatCard({ label, value, icon: Icon, caption }: StatCardProps) {
    return (
        <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <Icon className="size-4 text-muted-foreground" aria-hidden/>
            </div>

            <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
                {value.toLocaleString()}
            </p>

            {caption && <p className="mt-1 text-xs text-muted-foreground">{caption}</p>}
        </div>
    )
}