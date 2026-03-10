import { createClient } from "@/lib/supabase/server";
import { ShieldCheck, Plus, Settings, Users, FolderOpen, Activity } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { logout } from "@/actions/auth";
import { getClientMediaStorageUsage } from "@/actions/storage";

export default async function AdminDashboard() {
  const supabase = createClient();
  
  const { data: eventsData } = await supabase.from('events').select('*').order('created_at', { ascending: false });
  const events = eventsData || [];
  
  const { data: companiesData } = await supabase.from('companies').select('*');
  const companies = companiesData || [];
  
  const { data: logsData } = await supabase.from('activity_logs').select('*');
  const logs = logsData || [];

  const activeVaultsCount = events.filter(e => new Date(e.expiry_date) > new Date()).length;
  const storageContext = await getClientMediaStorageUsage();
  const tbPercentage = Math.min((storageContext.totalGB / 1024) * 100, 100);

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
            <NavItem active icon={<FolderOpen size={18} />}>Event Vaults</NavItem>
          </Link>
          <Link href="/admin/clients">
            <NavItem icon={<Users size={18} />}>Client Directory</NavItem>
          </Link>
          <Link href="/admin/system">
            <NavItem icon={<Settings size={18} />}>System Settings</NavItem>
          </Link>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
          {/* Top Actions & Summary */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <h1 className="font-heading text-4xl tracking-tight mb-2">Vault Management.</h1>
              <p className="font-mono text-xs uppercase tracking-widest opacity-50">
                {activeVaultsCount} Active Content Engines Running
              </p>
            </div>
            
            <Link 
              href="/admin/new"
              className="bg-foreground text-background font-heading font-semibold px-5 py-2.5 min-h-[44px] flex items-center gap-2 hover:bg-vividOrange hover:text-atomicBlack transition-colors rounded-sm shadow-sm relative z-10"
            >
              <Plus size={18} />
              Provision New Vault
            </Link>
          </div>

          {/* Usage Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* 1 TB Gauge Card */}
            <div className="lg:col-span-2 bg-foreground/5 dark:bg-foreground/10 border border-black/10 dark:border-white/10 p-6 rounded-sm shadow-sm flex flex-col justify-between group">
              <div>
                <h3 className="font-heading text-xl mb-1 flex items-center gap-2">
                  <Activity size={18} className="text-vividOrange" />
                  Storage Pipeline
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-6">Aggregate Client Bucket Usage</p>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-heading text-4xl">{storageContext.totalGB} <span className="text-lg opacity-50 font-body">GB Used</span></span>
                  <span className="font-mono text-xs opacity-50">Limit: 1024 GB (1 TB)</span>
                </div>
                <div className="w-full h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${tbPercentage > 90 ? 'bg-red-500' : 'bg-vividOrange'}`}
                    style={{ width: `${tbPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Cost Calculator Card */}
            <div className="bg-foreground/5 dark:bg-foreground/10 border border-black/10 dark:border-white/10 p-6 rounded-sm shadow-sm relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 text-black/5 dark:text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Activity size={160} />
              </div>
              <h3 className="font-heading text-xl mb-1">Billing Estimate</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-6">Current Cycle Projection</p>
              
              <div className="mt-auto pointer-events-none select-none">
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-1">Standard Storage ($0.023/GB) + Egress</p>
                <div className="font-space-mono text-5xl opacity-10 tracking-tighter">
                  ${storageContext.estimatedCost.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Active Vaults Table */}
          <div className="bg-foreground/5 dark:bg-foreground/10 border border-black/10 dark:border-white/10 rounded-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-black/10 dark:border-white/10 font-mono text-[10px] uppercase tracking-widest opacity-50">
              <div className="col-span-3">Event Name</div>
              <div className="col-span-3">Client Organization</div>
              <div className="col-span-2">Expiry Date</div>
              <div className="col-span-2 text-center">Activity</div>
              <div className="col-span-2 text-right">Status</div>
            </div>
            
            <div className="flex flex-col">
              {events.map(event => {
                const client = companies.find(c => c.id === event.client_id);
                const isExpired = new Date(event.expiry_date) < new Date();
                const eventLogs = logs.filter(l => l.event_id === event.id);
                const downloads = eventLogs.filter(l => l.action.toLowerCase().includes("download")).length;
                
                return (
                  <Link href={`/admin/vault/${event.id}`} key={event.id} className="grid grid-cols-12 gap-4 p-4 border-b border-black/5 dark:border-white/5 hover:bg-foreground/5 transition-colors items-center group relative z-10 min-h-[44px]">
                    <div className="col-span-3 font-heading text-lg group-hover:text-vividOrange transition-colors">
                      {event.name}
                    </div>
                    <div className="col-span-3 text-sm opacity-80">
                      {client?.name}
                    </div>
                    <div className="col-span-2 font-mono text-xs opacity-60">
                      {new Date(event.expiry_date).toISOString().split('T')[0]}
                    </div>
                    <div className="col-span-2 text-center flex justify-center">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] opacity-70 bg-foreground/5 px-2 py-1 rounded-sm">
                        <Activity size={10} className="text-vividOrange" />
                        {downloads} DLs
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      {isExpired ? (
                        <span className="inline-flex px-2 py-1 bg-red-500/10 text-red-500 font-mono text-[10px] uppercase rounded-sm border border-red-500/20">Expired</span>
                      ) : (
                        <span className="inline-flex px-2 py-1 bg-green-500/10 text-green-500 font-mono text-[10px] uppercase rounded-sm border border-green-500/20 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          Active
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ children, icon, active = false }: { children: React.ReactNode, icon: React.ReactNode, active?: boolean }) {
  return (
    <button className={`
      flex items-center gap-3 px-4 py-3 min-h-[44px] text-sm font-medium rounded-sm transition-colors w-full text-left relative z-10
      ${active ? 'bg-foreground/10 text-vividOrange' : 'opacity-70 hover:opacity-100 hover:bg-foreground/5'}
    `}>
      {icon}
      {children}
    </button>
  );
}
