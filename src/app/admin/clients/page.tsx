import { FolderOpen, Settings, Users, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { logout } from "@/actions/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminClientsPage() {
  const supabase = createClient();
  
  // Fetch companies
  const { data: companiesData } = await supabase.from('companies').select('*').order('name');
  const companies = companiesData || [];

  // Fetch all events for counting
  const { data: eventsData } = await supabase.from('events').select('*');
  const allEvents = eventsData || [];

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
            <NavItem active icon={<Users size={18} />}>Client Directory</NavItem>
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
              <h1 className="font-heading text-4xl tracking-tight mb-2">Client Directory.</h1>
              <p className="font-mono text-xs uppercase tracking-widest opacity-50">
                {companies.length} Partner Organizations
              </p>
            </div>
            
            <button 
              className="bg-foreground text-background font-heading font-semibold px-5 py-2.5 min-h-[44px] flex items-center gap-2 hover:bg-vividOrange hover:text-atomicBlack transition-colors rounded-sm shadow-sm relative z-10"
            >
              <Users size={18} />
              Onboard Partner
            </button>
          </div>

          {/* Client Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map(company => {
                const clientEvents = allEvents.filter(e => e.client_id === company.id);
                const activeEvents = clientEvents.filter(e => new Date(e.expiry_date) > new Date());
                
                return (
                    <div key={company.id} className="bg-foreground/5 dark:bg-foreground/10 border border-black/10 dark:border-white/10 p-6 rounded-sm shadow-sm flex flex-col justify-between group">
                        <div>
                            <div className="w-12 h-12 bg-background border border-black/10 dark:border-white/10 rounded-sm mb-4 flex items-center justify-center font-heading text-xl text-vividOrange">
                                {company.name.charAt(0)}
                            </div>
                            <h3 className="font-heading text-2xl mb-1 group-hover:text-vividOrange transition-colors">{company.name}</h3>
                            <p className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-6 flex items-center gap-2">
                                <Mail size={12} /> Contact Information Pending
                            </p>
                        </div>
                        
                        <div className="pt-6 border-t border-black/10 dark:border-white/10 flex justify-between items-end">
                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-1">Active Vaults</p>
                                <p className="font-mono text-xl">{activeEvents.length} <span className="text-sm opacity-50">/ {clientEvents.length}</span></p>
                            </div>
                            <button className="text-foreground/50 hover:text-vividOrange transition-colors p-2">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )
            })}
          </div>
        </main>
      </div>
    </div>
  );
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
