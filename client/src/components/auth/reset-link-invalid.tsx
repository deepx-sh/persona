import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";


export function ResetLinkInvalid() {
    return (
        <div className="space-y-6">
            <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <CircleAlert className="size-6" aria-hidden/>
            </div>

            <div className="space-y-1.5">
                <h1 className="text-2xl font-semibold tracking-tight">This link is no longer valid</h1>
                <p className="text-sm text-muted-foreground">
                    Reset links expire after an hour and can only be used once. Request a new one to continue.
                </p>
            </div>

            <Link href="/forgot-password" className={cn(buttonVariants(), "h-10 w-full")}>
                Request a new link</Link>
            
            <p className="text-center text-sm text-muted-foreground">
                <Link href="signin" className="font-medium text-primary hover:underline">
                Back to sign in</Link>
            </p>
        </div>
    )
}