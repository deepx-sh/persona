import { Logo } from "../brand/logo";
import { SidebarNav } from "./sidebar-nav";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-svh lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
            <aside className="sticky top-0 hidden h-svh flex-col border-r bg-muted/40 lg:flex">
                <div className="flex h-14 items-center px-4">
                    <Logo href="/dashboard"/>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-2">
                    <SidebarNav/>
                </div>
            </aside>

            <div className="flex min-w-0 flex-col">
                <Topbar />
                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto w-full max-w-6xl">{children}</div>
                </main>
            </div>
        </div>
    )
}