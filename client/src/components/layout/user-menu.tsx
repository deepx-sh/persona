"use client";

import { authClient } from "@/lib/auth-client";
import { ChevronDown,LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar,AvatarFallback,AvatarImage} from "../ui/avatar";
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuSeparator,DropdownMenuTrigger } from "../ui/dropdown-menu";

function getInitials(name: string): string{
    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("")
    
    return initials || "?"
}

export function UserMenu() {
    const router = useRouter();
    const { data: session } = authClient.useSession()
    
    if (!session) return null;

    const {name,email,image } = session.user;

    async function handleSignOut() {
        await authClient.signOut({
            fetchOptions:{onSuccess:()=>router.replace("/signin")}
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label="Open user menu"
                className="flex items-center gap-2 rounded-lg p-1 pr-2 text-sm outline-none hover:bg-secondary focus-within:ring-[3px] focus-visible:ring-ring/50"
            >
                <Avatar className="size-8">
                    {image && <AvatarImage src={image} alt="" referrerPolicy="no-referrer" />}
                    <AvatarFallback className="bg-accent text-xs font-medium text-accent-foreground">
                        {getInitials(name)}
                    </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-32 truncate font-medium sm:block">{name}</span>
                <ChevronDown className="size-4 text-muted-foreground" aria-hidden/>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60">
                <div className="px-2 py-2">
                    <p className="truncate text-sm font-medium">{name}</p>
                    <p className="truncate text-xs text-muted-foreground">{email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="size-4" aria-hidden />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}