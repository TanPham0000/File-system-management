import { mockEvents, mockCompanies } from "@/lib/mockData";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LogOut, Clock } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cookies } from "next/headers";
import { logout } from "@/actions/auth";

export default function ProjectOverview() {
  const cookieStore = cookies();
  const clientId = cookieStore.get("client_id")?.value || mockCompanies[0].id;
  
  const currentClient = mockCompanies.find(c => c.id === clientId) || mockCompanies[0];
  const clientEvents = mockEvents.filter(e => e.client_id === currentClient.id);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body selection:bg-vividOrange selection:text-atomicBlack transition-colors duration-300">
      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-heading text-2xl tracking-tighter hover:text-vividOrange transition-colors relative z-10 min-h-[44px] flex items-center">
            PHAM. Vault
          </Link>
          <div className="h-4 w-px bg-black/20 dark:bg-white/20"></div>
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 flex items-center gap-4">
            {currentClient.name}
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
      <main className="flex-grow px-8 py-16 max-w-[1600px] mx-auto w-full">
        <div className="mb-16">
          <h1 className="font-heading text-5xl md:text-7xl mb-4 tracking-tight">Your Event Archives.</h1>
          <p className="font-special text-xl opacity-60 italic max-w-2xl">
            Access, review, and utilize your premium media assets. Guaranteed secure hosting for 12 months.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {clientEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </main>
    </div>
  );
}

function EventCard({ event }: { event: typeof mockEvents[0] }) {
  const expiryDate = new Date(event.expiry_date);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  }).format(expiryDate);

  return (
    <Link href={`/vault/${event.id}`} className="group block h-full relative z-10">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-foreground/5 dark:bg-foreground/10 border border-black/10 dark:border-white/10 group-hover:border-vividOrange/50 transition-colors duration-500 flex flex-col rounded-sm">

        {/* Image Container with Hover Scale */}
        <div className="relative w-full h-[65%] overflow-hidden">
          <Image
            src={event.cover_image_url}
            alt={event.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
          />
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
            <span className="font-mono text-[11px] uppercase tracking-widest font-semibold">Access Vault</span>
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
