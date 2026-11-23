import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { QueryProvider } from "@/components/providers/query-provider";


export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <QueryProvider>
            <AuthGuard>
            <AppShell>{children}</AppShell>
        </AuthGuard>
        </QueryProvider>
    )
}