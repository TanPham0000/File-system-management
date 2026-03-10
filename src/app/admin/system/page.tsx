import { FolderOpen, Settings, Users, ShieldCheck, HardDrive, Cpu, Activity, Server } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { logout } from "@/actions/auth";

export default function AdminSystemPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body selection:bg-vividOrange selection:text-atomicBlack transition-colors duration-300">
      {/* Header */}
      <header className="px-8 py-4 flex justify-between items-center border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-50 pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
          <Link href="/admin" className="font-heading text-2xl tracking-tighter hover:text-vividOrange transition-colors relative z-10 min-h-[44px] flex items-center">
            PHAM. <span className="text-vividOrange ml-1">Admin</span>
          </Link>
          <div className="h-4 w-px bg-black/20 dark:bg-white/20"></div>
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 flex items-center gap-2">
            <ShieldCheck size={14} className="text-vividOrange" />
            Command Center
          </p>
        </div>
        
        <div className="flex items-center gap-6 pointer-events-auto relative z-10">
          <ThemeToggle />
          <form action={logout}>
            <button type="submit" className="font-mono text-[10px] uppercase tracking-wider opacity-60 hover:text-vividOrange transition-colors cursor-pointer min-h-[44px] px-2 relative z-10">
              Secure Lock
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-grow">
        {/* Sidebar Nav */}
        <nav className="w-64 border-r border-black/10 dark:border-white/10 p-6 flex flex-col gap-2 hidden md:flex min-h-[calc(100vh-76px)]">
          <Link href="/admin">
            <NavItem icon={<FolderOpen size={18} />}>Event Vaults</NavItem>
          </Link>
          <Link href="/admin/clients">
            <NavItem icon={<Users size={18} />}>Client Directory</NavItem>
          </Link>
          <Link href="/admin/system">
            <NavItem active icon={<Settings size={18} />}>System Settings</NavItem>
          </Link>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
          {/* Top Actions & Summary */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <h1 className="font-heading text-4xl tracking-tight mb-2">System Infrastructure.</h1>
              <p className="font-mono text-xs uppercase tracking-widest opacity-50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                All Systems Operational - EU Edge Network
              </p>
            </div>
            
            <button 
              className="bg-foreground text-background font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 min-h-[44px] flex items-center gap-2 hover:bg-vividOrange hover:text-atomicBlack transition-colors rounded-sm shadow-sm relative z-10"
            >
              <Activity size={14} />
              Run Diagnostics
            </button>
          </div>

          {/* Infrastructure Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <MetricCard title="Storage Node Activity" value="2.4 TB/s" icon={<HardDrive size={18} />} trend="+12% Usage Volumetric" />
            <MetricCard title="Processing Cores" value="64 active" icon={<Cpu size={18} />} trend="High Capacity Available" />
            <MetricCard title="Edge Cache Hit Rate" value="98.7%" icon={<Server size={18} />} trend="Optimal Performance" />
            <MetricCard title="Authentication Gates" value="0.04ms" icon={<ShieldCheck size={18} />} trend="Normal Latency" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Environment Config */}
            <div className="bg-foreground/5 dark:bg-foreground/10 border border-black/10 dark:border-white/10 rounded-sm p-6">
                <h3 className="font-heading text-xl mb-6">Environment Values</h3>

                <div className="space-y-4 font-mono text-xs">
                    <div className="flex justify-between items-center pb-4 border-b border-black/10 dark:border-white/10">
                        <span className="opacity-60">NEXT_PUBLIC_SITE_URL</span>
                        <span className="bg-background px-2 py-1 rounded-sm border border-black/10 dark:border-white/10 opacity-80">Configured (Vercel)</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-black/10 dark:border-white/10">
                        <span className="opacity-60">NEXT_PUBLIC_SUPABASE_URL</span>
                        <span className="bg-background px-2 py-1 rounded-sm border border-black/10 dark:border-white/10 opacity-80 flex gap-2 items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                        </span>
                    </div>
                     <div className="flex justify-between items-center pb-4 border-b border-black/10 dark:border-white/10">
                        <span className="opacity-60">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                         <span className="bg-background px-2 py-1 rounded-sm border border-black/10 dark:border-white/10 opacity-80 flex gap-2 items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active Key Confirmed
                        </span>
                    </div>
                </div>
            </div>

             {/* Recent Deployments Log (Mock) */}
             <div className="bg-foreground/5 dark:bg-foreground/10 border border-black/10 dark:border-white/10 rounded-sm p-6">
                <h3 className="font-heading text-xl mb-6">Deployment Log</h3>

                <div className="space-y-4 font-mono text-[10px] uppercase tracking-widest">
                     <div className="flex flex-col gap-2 pb-4 border-b border-black/10 dark:border-white/10 group">
                        <div className="flex justify-between items-center opacity-60">
                            <span>0x8c39fa • Vercel Edge</span>
                            <span>Just Now</span>
                        </div>
                        <p className="text-foreground group-hover:text-vividOrange transition-colors">Added Client & System logic with routing configs.</p>
                    </div>
                    
                    <div className="flex flex-col gap-2 pb-4 border-b border-black/10 dark:border-white/10 group">
                        <div className="flex justify-between items-center opacity-60">
                            <span>0xfa28eb • Vercel Edge</span>
                            <span>2h ago</span>
                        </div>
                        <p className="text-foreground group-hover:text-vividOrange transition-colors">Middleware Environment Fixes (Supabase Anon Key)</p>
                    </div>

                     <div className="flex flex-col gap-2 pb-4 border-b border-black/10 dark:border-white/10 group">
                        <div className="flex justify-between items-center opacity-60">
                            <span>0xa14c99 • Vercel Edge</span>
                            <span>8h ago</span>
                        </div>
                        <p className="text-foreground group-hover:text-vividOrange transition-colors">UI Design Overhaul & Hitbox Fixes</p>
                    </div>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
    return (
        <div className="bg-background border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm group">
            <div className="flex items-center gap-2 mb-4 text-vividOrange">
                {icon}
                <span className="font-mono text-[9px] uppercase tracking-widest text-foreground opacity-60">{title}</span>
            </div>
            <p className="font-heading text-3xl mb-1">{value}</p>
            <p className="font-mono text-[9px] uppercase tracking-widest opacity-40">{trend}</p>
        </div>
    )
}

function NavItem({ children, icon, active = false }: { children: React.ReactNode, icon: React.ReactNode, active?: boolean }) {
  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 min-h-[44px] text-sm font-medium rounded-sm transition-colors w-full text-left relative z-10 cursor-pointer
      ${active ? 'bg-foreground/10 text-vividOrange' : 'opacity-70 hover:opacity-100 hover:bg-foreground/5'}
    `}>
      {icon}
      {children}
    </div>
  );
}
