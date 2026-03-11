"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FolderOpen, Users, Settings, Plus, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { logout } from "@/actions/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Pages that should have the standard admin header/sidebar
  const isStandardAdminPage = ["/admin", "/admin/clients", "/admin/system"].includes(pathname);

  if (!isStandardAdminPage) {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/admin", icon: <FolderOpen size={18} />, label: "Event Vaults", pattern: /^\/admin$/ },
    { href: "/admin/clients", icon: <Users size={18} />, label: "Client Directory", pattern: /^\/admin\/clients/ },
    { href: "/admin/system", icon: <Settings size={18} />, label: "System Settings", pattern: /^\/admin\/system/ },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body selection:bg-vividOrange selection:text-atomicBlack transition-colors duration-300 pb-20 md:pb-0">
      {/* Header */}
      <header className="px-4 md:px-8 py-4 flex justify-between items-center border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/admin" className="font-heading text-xl md:text-2xl tracking-tighter hover:text-vividOrange transition-colors relative z-10 min-h-[44px] flex items-center">
            PHAM. <span className="text-vividOrange ml-1">Admin</span>
          </Link>
          <div className="hidden md:block h-4 w-px bg-black/20 dark:bg-white/20"></div>
          <p className="hidden md:flex font-mono text-xs uppercase tracking-widest opacity-60 flex-center gap-2">
            <ShieldCheck size={14} className="text-vividOrange" />
            Command Center
          </p>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <ThemeToggle />
          <form action={logout}>
            <button type="submit" className="font-mono text-[10px] uppercase tracking-wider opacity-60 hover:text-vividOrange transition-colors cursor-pointer min-h-[44px] px-2">
              Secure Lock
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-grow relative">
        {/* Desktop Sidebar Nav */}
        <nav className="w-64 border-r border-black/10 dark:border-white/10 p-6 flex-col gap-2 hidden md:flex min-h-[calc(100vh-76px)] sticky top-[76px]">
          {navItems.map((item) => {
            const active = item.pattern.test(pathname);
            return (
              <Link href={item.href} key={item.href}>
                <div className={`
                  flex items-center gap-3 px-4 py-3 min-h-[44px] text-sm font-medium rounded-sm transition-colors w-full text-left cursor-pointer
                  ${active ? 'bg-foreground/10 text-vividOrange' : 'opacity-70 hover:opacity-100 hover:bg-foreground/5'}
                `}>
                  {item.icon}
                  {item.label}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Main Content Area */}
        <div className="flex-grow w-full max-w-[100vw] overflow-x-hidden">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-lg border-t border-black/10 dark:border-white/10 z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const active = item.pattern.test(pathname);
            return (
              <Link href={item.href} key={item.href} className="flex-1 flex justify-center">
                <div className={`
                  flex flex-col items-center justify-center p-2 min-h-[44px] min-w-[44px] rounded-sm transition-colors
                  ${active ? 'text-vividOrange' : 'opacity-60 hover:opacity-100'}
                `}>
                  {item.icon}
                  <span className="text-[9px] font-mono mt-1 uppercase tracking-wider">{item.label.split(' ')[0]}</span>
                </div>
              </Link>
            );
          })}
          {/* Quick Action (Mobile only) */}
          <Link href="/admin/new" className="flex-1 flex justify-center">
             <div className="flex flex-col items-center justify-center p-2 min-h-[44px] min-w-[44px] rounded-sm transition-colors opacity-60 hover:opacity-100">
                <Plus size={18} />
                <span className="text-[9px] font-mono mt-1 uppercase tracking-wider">New</span>
             </div>
          </Link>
        </div>
      </nav>
    </div>
  );
}
