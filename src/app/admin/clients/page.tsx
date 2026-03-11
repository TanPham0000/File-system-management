import { ArrowRight, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { OnboardClientModal } from "@/components/admin/OnboardClientModal";

export default async function AdminClientsPage() {
  const supabase = createClient();
  
  // Fetch companies
  const { data: companiesData } = await supabase.from('companies').select('*').order('name');
  const companies = companiesData || [];

  // Fetch all events for counting
  const { data: eventsData } = await supabase.from('events').select('*');
  const allEvents = eventsData || [];

  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Top Actions & Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-12">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl tracking-tight mb-2">Client Directory.</h1>
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-50">
            {companies.length} Partner Organizations
          </p>
        </div>
        
        <OnboardClientModal />
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                        <p className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-6 flex items-center gap-2 mt-2">
                            <Mail size={12} /> Contact Information Pending
                        </p>
                    </div>
                    
                    <div className="pt-6 border-t border-black/10 dark:border-white/10 flex justify-between items-end mt-4">
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-1">Active Vaults</p>
                            <p className="font-mono text-xl">{activeEvents.length} <span className="text-sm opacity-50">/ {clientEvents.length}</span></p>
                        </div>
                        <button className="text-foreground/50 hover:text-vividOrange transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-sm">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            )
        })}
      </div>
    </main>
  );
}
