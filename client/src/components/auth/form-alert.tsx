import { CircleAlert, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormAlertProps{
    variant?: "error" | "success";
    children: React.ReactNode;
    className?: string;
}

export function FormAlert({variant="error",children,className }: FormAlertProps) { 
    const Icon = variant === "error" ? CircleAlert : CircleCheck;

    return (
        <div
            role={variant === "error" ? "alert" : "status"}
            className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm",
                variant === "error"
                    ? "border-destructive/20 bg-destructive/5 text-destructive"
                    : "border-primary/20 bg-accent text-accent-foreground",
                className
            )}
        >
            <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>{children}</p>
        </div>
    )
}