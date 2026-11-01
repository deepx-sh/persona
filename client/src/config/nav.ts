import { LayoutDashboard, Users, FileText, Settings, ShieldCheck, type LucideIcon } from "lucide-react"
import { admin } from 'better-auth/plugins';

export interface NavItem{
    label: string;
    href: string;
    icon: LucideIcon;
    ready: boolean;
    adminOnly?:boolean
}

export const appNav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, ready: true },
    { label: "Contacts", href: "/contacts", icon: Users, ready: false },
    { label: "Templates", href: "/templates", icon: FileText, ready: false },
    { label: "Settings", href: "/settings", icon: Settings, ready: false },
    {label:"Admin",href:"/admin",icon:ShieldCheck,ready:false,adminOnly:true}
]