"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.ComponentProps<"input">{
    label: string;
    error?: string;
    hint?: string;
    labelAction?: React.ReactNode;
}


export function FormField({
    label,
    error,
    hint,
    labelAction,
    id,
    type = "text",
    className,
    ...props
}: FormFieldProps) {
    const [visible, setVisible] = useState(false)
    const fieldId = id ?? props.name;
    const isPassword = type === "password";
    const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;


    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor={fieldId}>{label}</Label>
                {labelAction}
            </div>

            <div className="relative">
                <Input
                    id={fieldId}
                    type={isPassword && visible ? "text" : type}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className={cn("h-10", isPassword && "pr-10", className)}
                    {...props}
                />
                
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setVisible((v) => !v)}
                        aria-label={visible ? "Hide password" : "Show password"}
                        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-xl text-muted-foreground hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
                    >
                        {visible ? <EyeOff className="size-4" aria-hidden/> : <Eye className="size-4" aria-hidden/>}
                    </button>
                )}
            </div>

            {error ? (
                <p id={`${fieldId}-error`} className="text-sm text-destructive" role="alert">
                    {error}
                </p>
            ) : hint ? (
                    <p id={`${fieldId}-hint`} className="text-sm text-muted-foreground">
                        {hint}
                    </p>
            ):null}
        </div>
    )
}