import { HardDrive, Cpu, Activity, Server } from "lucide-react";
import { SystemSettingsToggles } from "@/components/admin/SystemSettingsToggles";

export default function AdminSystemPage() {
  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Top Actions & Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-12">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl tracking-tight mb-2">System Infrastructure.</h1>
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-50 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            All Systems Operational - EU Edge Network
          </p>
        </div>
        
        <button 
          className="bg-foreground text-background font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 min-h-[44px] flex items-center justify-center gap-2 hover:bg-vividOrange hover:text-atomicBlack transition-colors rounded-sm shadow-sm relative z-10 w-full md:w-auto"
        >
          <Activity size={14} />
          Run Diagnostics
        </button>
      </div>

      {/* Infrastructure Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        <MetricCard title="Storage Node Activity" value="2.4 TB/s" icon={<HardDrive size={18} />} trend="+12% Usage Volumetric" />
        <MetricCard title="Processing Cores" value="64 active" icon={<Cpu size={18} />} trend="High Capacity Available" />
        <MetricCard title="Edge Cache Hit Rate" value="98.7%" icon={<Server size={18} />} trend="Optimal Performance" />
        <MetricCard title="Authentication Gates" value="0.04ms" icon={<Activity size={18} />} trend="Normal Latency" />
      </div>

      <SystemSettingsToggles />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 mt-6 md:mt-8">
        {/* Environment Config */}
        <div className="bg-foreground/5 dark:bg-foreground/10 border border-black/10 dark:border-white/10 rounded-sm p-4 md:p-6">
            <h3 className="font-heading text-lg md:text-xl mb-6">Environment Values</h3>

            <div className="space-y-4 font-mono text-[10px] md:text-xs overflow-x-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-4 border-b border-black/10 dark:border-white/10">
                    <span className="opacity-60">NEXT_PUBLIC_SITE_URL</span>
                    <span className="bg-background px-2 py-1 rounded-sm border border-black/10 dark:border-white/10 opacity-80 self-start sm:self-auto">Configured (Vercel)</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-4 border-b border-black/10 dark:border-white/10">
                    <span className="opacity-60">NEXT_PUBLIC_SUPABASE_URL</span>
                    <span className="bg-background px-2 py-1 rounded-sm border border-black/10 dark:border-white/10 opacity-80 flex gap-2 items-center self-start sm:self-auto">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                    </span>
                </div>
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-4 border-b border-black/10 dark:border-white/10">
                    <span className="opacity-60">NEXT_PUBLIC_ANON_KEY</span>
                     <span className="bg-background px-2 py-1 rounded-sm border border-black/10 dark:border-white/10 opacity-80 flex gap-2 items-center self-start sm:self-auto">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active Key Confirmed
                    </span>
                </div>
            </div>
        </div>

         {/* Recent Deployments Log (Mock) */}
         <div className="bg-foreground/5 dark:bg-foreground/10 border border-black/10 dark:border-white/10 rounded-sm p-4 md:p-6">
            <h3 className="font-heading text-lg md:text-xl mb-6">Deployment Log</h3>

            <div className="space-y-4 font-mono text-[9px] md:text-[10px] uppercase tracking-widest">
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
  );
}

function MetricCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
    return (
        <div className="bg-background border border-black/10 dark:border-white/10 p-4 md:p-5 rounded-sm shadow-sm group">
            <div className="flex items-center gap-2 mb-4 text-vividOrange">
                {icon}
                <span className="font-mono text-[9px] uppercase tracking-widest text-foreground opacity-60">{title}</span>
            </div>
            <p className="font-heading text-2xl md:text-3xl mb-1">{value}</p>
            <p className="font-mono text-[9px] uppercase tracking-widest opacity-40">{trend}</p>
        </div>
    )
}
