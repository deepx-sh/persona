"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import { Logo } from "../brand/logo"
import { SidebarNav } from "./sidebar-nav"

export function MobileNav() {
    const [open, setOpen] = useState(false)
    
    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
            >
                <Menu className="size-5" aria-hidden/>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="w-72 gap-0 p-0">
                    <SheetHeader className="boder-b px-4 py-3.5">
                        <SheetTitle className="sr-only">Navigation</SheetTitle>
                        <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
                        <Logo href="/dashboard" />
                    </SheetHeader>

                    <div className="px-3 py-3">
                        <SidebarNav onNavigate={()=>setOpen(false)}/>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}