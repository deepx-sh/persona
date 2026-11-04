import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps{
    className?: string;
    href?: string;
}
export function Logo({className,href="/"}:LogoProps) {
    return (
        <Link href={href}
        className={cn("inline-flex items-center gap-2 font-semibold tracking-tight",className)}
        >

            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MessageSquareText className="size-4" aria-hidden/>
            </span>

            <span className="text-lg">Persona</span>
        </Link>
    )
}