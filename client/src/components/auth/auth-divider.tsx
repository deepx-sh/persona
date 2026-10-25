import { ReactNode } from "react";

export function AuthDivider({ children = "or" }: { children?: ReactNode }) {
    return (
        <div className="relative" role="separator">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"/>
            </div>

            <div className="relative flex justify-center">
                <span className="bg-background px-3 text-xs uppercase tracking-wide text-muted-foreground">
                    {children}
                </span>
            </div>
        </div>
    )
}