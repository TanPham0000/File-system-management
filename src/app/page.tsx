import { createClient } from "@/lib/supabase/server";
import { Company, EventType, MediaAsset } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LogOut, Clock } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cookies } from "next/headers";
import { logout } from "@/actions/auth";

export default async function ProjectOverview() {
  const cookieStore = cookies();
  const clientIdFromCookie = cookieStore.get("client_id")?.value;
  const supabase = createClient();
  
  let currentClient: Company | null = null;
  let clientEvents: EventType[] = [];
  let allAssets: MediaAsset[] = [];

  // Attempt to load current client from cookie
  if (clientIdFromCookie) {
    const { data } = await supabase.from('companies').select('*').eq('id', clientIdFromCookie).single();
    if (data) currentClient = data;
  }

  // Fallback to the first available company if no cookie or invalid cookie
  if (!currentClient) {
    const { data } = await supabase.from('companies').select('*').limit(1);
    if (data && data.length > 0) {
      currentClient = data[0];
    }
  }

  // If we have a client, fetch their events
  if (currentClient) {
    const { data: eventsData } = await supabase.from('events').select('*').eq('client_id', currentClient.id).order('created_at', { ascending: false });
    clientEvents = eventsData || [];
    
    // Fetch assets for all those events to calculate sizes
    if (clientEvents.length > 0) {
      const eventIds = clientEvents.map(e => e.id);
      const { data: assetsData } = await supabase.from('media_assets').select('*').in('event_id', eventIds);
      allAssets = assetsData || [];
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body selection:bg-vividOrange selection:text-atomicBlack transition-colors duration-300">
      {/* Header */}
      <header className="px-4 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-left">
          <Link href="/" className="font-heading text-xl md:text-2xl tracking-tighter hover:text-vividOrange transition-colors relative z-10 min-h-[44px] flex items-center justify-center">
            PHAM. Vault
          </Link>
          <div className="hidden md:block h-4 w-px bg-black/20 dark:bg-white/20"></div>
          <p className="font-mono text-[9px] md:text-xs uppercase tracking-widest opacity-60 flex items-center justify-center gap-4 w-full">
            {currentClient?.name || "Initializing..."}
          </p>
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <ThemeToggle />
          <form action={logout}>
            <button type="submit" className="flex items-center gap-2 text-sm opacity-60 hover:text-vividOrange transition-colors cursor-pointer min-h-[44px] px-2 relative z-10">
              <LogOut size={16} />
              <span className="font-mono uppercase tracking-wider text-[10px]">Secure Exit</span>
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 md:px-8 py-10 md:py-16 max-w-[1600px] mx-auto w-full">
        <div className="mb-10 md:mb-16">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl mb-4 tracking-tight">Your Event Archives.</h1>
          <p className="font-special text-lg md:text-xl opacity-60 italic max-w-2xl">
            Access, review, and utilize your premium media assets. Guaranteed secure hosting for 12 months.
          </p>
        </div>

        {clientEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 border border-dashed border-black/20 dark:border-white/20 rounded-lg">
            <h3 className="font-heading text-2xl mb-2">No Vaults Available</h3>
            <p className="font-mono text-sm opacity-50 uppercase tracking-widest text-center">
              There are currently no secure environments provisioned for {currentClient?.name || "this organization"}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {clientEvents.map((event) => (
              <EventCard key={event.id} event={event} assets={allAssets} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EventCard({ event, assets = [] }: { event: EventType, assets: MediaAsset[] }) {
  const expiryDate = new Date(event.expiry_date);
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }).format(expiryDate);

  // Derive stats if assets are provided
  const eventAssets = assets.filter(a => a.event_id === event.id);
  const totalItems = eventAssets.length;
  // Calculate total GB (mock size is currently in MB)
  const totalMB = eventAssets.reduce((sum, asset) => sum + (Number(asset.size_mb) || 0), 0);
  const sizeGB = (totalMB / 1024).toFixed(2);

  return (
    <Link href={`/vault/${event.id}`} className="group block h-full relative z-10">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-foreground/5 dark:bg-foreground/10 border border-black/10 dark:border-white/10 group-hover:border-vividOrange/50 transition-colors duration-500 flex flex-col rounded-sm">

        {/* Image Container with Hover Scale */}
        <div className="relative w-full h-[65%] overflow-hidden bg-black/5 dark:bg-white/5">
          {event.cover_image_url && (
            <Image
              src={event.cover_image_url}
              alt={event.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="bg-background/90 backdrop-blur-md px-3 py-1.5 border border-black/10 dark:border-white/10 flex items-center gap-2 text-vividOrange shadow-sm rounded-sm">
              <Clock size={12} />
              <span className="font-mono text-[9px] uppercase tracking-widest text-foreground opacity-80">
                Expires {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 flex-grow flex flex-col justify-between bg-background relative z-10 transition-transform duration-500">
          <div>
            <h2 className="font-heading text-2xl tracking-tight mb-2 group-hover:text-vividOrange transition-colors text-foreground">
              {event.name}
            </h2>
            <p className="font-mono text-[10px] uppercase opacity-50 tracking-wider text-foreground">
              {event.id}
            </p>
          </div>

          <div className="flex items-center justify-between opacity-70 group-hover:text-vividOrange transition-colors mt-6 text-foreground">
            <div className="flex gap-4">
              <span className="font-mono text-[10px] uppercase tracking-widest">{totalItems} Items</span>
              <span className="font-mono text-[10px] uppercase tracking-widest">{sizeGB} GB</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest font-semibold hidden sm:inline-block">Access Vault</span>
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
