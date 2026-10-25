import { LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends React.ComponentProps<typeof Button>{
    loading?: boolean;
    loadingText?: string;
}

export function SubmitButton({
    loading = false,
    loadingText,
    children,
    disabled,
    className,
    ...props
}: SubmitButtonProps) {
    return (
        <Button
            type="submit"
            className={cn("h-10 w-full", className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <LoaderCircle className="animate-spin" aria-hidden />}
            {loading ? (loadingText??children): children}
        </Button>
    )
}