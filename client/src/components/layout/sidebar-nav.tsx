"use client";

import { appNav } from "@/config/nav";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";


interface SidebarNavProps{
    onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
    const pathname = usePathname();
    const { data: session } = authClient.useSession();


    const role = (session?.user as { role?: string } | undefined)?.role;
    const items = appNav.filter((item) => !item.adminOnly || role === "admin");

    const itemClasses = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium";

    return (
        <nav aria-label="Main" className="space-y-1">
            {items.map((item) => {
                const Icon = item.icon;

                if(!item.ready){
                    return (
                        <div
                            key={item.href}
                            aria-disabled="true"
                            className={cn(itemClasses,"cursor-not-allowed text-muted-foreground/60")}
                        >
                            <Icon className="size-4" aria-hidden />
                            <span className="flex-1">{item.label}</span>
                            <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                Soon
                            </span>
                        </div>
                    )
                }

                const active = pathname === item.href || pathname.startsWith(`${item.href}`)

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={
                            cn(
                                itemClasses,
                                active
                                    ? "bg-accent text-accent-foreground"
                                    :"text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )
                        }
                    >

                        <Icon className="size-4" aria-hidden />
                        {item.label}
                    </Link>
                )
            })}
        </nav>
    )
}