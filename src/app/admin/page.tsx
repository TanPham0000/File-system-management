import { mockEvents, mockCompanies } from "@/lib/mockData";
import { ShieldCheck, Plus, Settings, Users, FolderOpen } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { logout } from "@/actions/auth";

export default function AdminDashboard() {
  const activeVaultsCount = mockEvents.filter(e => new Date(e.expiry_date) > new Date()).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body selection:bg-vividOrange selection:text-atomicBlack transition-colors duration-300">
      {/* Header */}
      <header className="px-8 py-4 flex justify-between items-center border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-heading text-2xl tracking-tighter hover:text-vividOrange transition-colors">
            PHAM. <span className="text-vividOrange">Admin</span>
          </Link>
          <div className="h-4 w-px bg-black/20 dark:bg-white/20"></div>
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 flex items-center gap-2">
            <ShieldCheck size={14} className="text-vividOrange" />
            Command Center
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <form action={logout}>
            <button type="submit" className="font-mono text-[10px] uppercase tracking-wider opacity-60 hover:text-vividOrange transition-colors cursor-pointer">
              Secure Lock
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-grow">
        {/* Sidebar Nav */}
        <nav className="w-64 border-r border-black/10 dark:border-white/10 p-6 flex flex-col gap-2 hidden md:flex">
          <NavItem active icon={<FolderOpen size={18} />}>Event Vaults</NavItem>
          <NavItem icon={<Users size={18} />}>Client Directory</NavItem>
          <NavItem icon={<Settings size={18} />}>System Settings</NavItem>
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
            
            <button className="bg-vividOrange text-atomicBlack font-heading font-semibold px-5 py-2.5 flex items-center gap-2 hover:bg-[#ffaa40] transition-colors rounded-sm shadow-lg shadow-vividOrange/20">
              <Plus size={18} />
              Provision New Vault
            </button>
          </div>

          {/* Active Vaults Table */}
          <div className="bg-foreground/5 dark:bg-foreground/10 border border-black/10 dark:border-white/10 rounded-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-black/10 dark:border-white/10 font-mono text-[10px] uppercase tracking-widest opacity-50">
              <div className="col-span-4">Event Name</div>
              <div className="col-span-3">Client Organization</div>
              <div className="col-span-3">Expiry Date</div>
              <div className="col-span-2 text-right">Status</div>
            </div>
            
            <div className="flex flex-col">
              {mockEvents.map(event => {
                const client = mockCompanies.find(c => c.id === event.client_id);
                const isExpired = new Date(event.expiry_date) < new Date();
                
                return (
                  <Link href={`/admin/vault/${event.id}`} key={event.id} className="grid grid-cols-12 gap-4 p-4 border-b border-black/5 dark:border-white/5 hover:bg-foreground/5 transition-colors items-center group">
                    <div className="col-span-4 font-heading text-lg group-hover:text-vividOrange transition-colors">
                      {event.name}
                    </div>
                    <div className="col-span-3 text-sm opacity-80">
                      {client?.name}
                    </div>
                    <div className="col-span-3 font-mono text-xs opacity-60">
                      {new Date(event.expiry_date).toISOString().split('T')[0]}
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
      flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-colors w-full text-left
      ${active ? 'bg-foreground/10 text-vividOrange' : 'opacity-70 hover:opacity-100 hover:bg-foreground/5'}
    `}>
      {icon}
      {children}
    </button>
  );
}
