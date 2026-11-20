import { Logo } from "@/components/brand/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserMenu } from "./user-menu";


export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b bg-background px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <MobileNav />
        <Logo href="/dashboard" className="lg:hidden" />
      </div>
    <UserMenu/>
    </header>
  );
}