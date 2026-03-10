"use client";

import { mockEvents, mockAssets, mockCompanies } from "@/lib/mockData";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Download, Image as ImageIcon, Film, Mic, PlaySquare, Map } from "lucide-react";
import MediaCard from "@/components/MediaCard";
import { useState, useMemo } from "react";

export default function VaultPage({ params }: { params: { eventId: string } }) {
  const event = mockEvents.find((e) => e.id === params.eventId);

  if (!event) {
    notFound();
  }

  const client = mockCompanies.find(c => c.id === event.client_id);
  const assets = mockAssets.filter(a => a.event_id === event.id);

  // Stats for the "Content Engine" summary
  const photosCount = assets.filter(a => a.type === "image").length;
  const videosCount = assets.filter(a => a.type === "video").length;
  const categoriesCount = new Set(assets.map(a => a.category)).size;
  const totalAssets = assets.length;

  const expiryDate = new Date(event.expiry_date);
  const daysRemaining = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  const [activeTab, setActiveTab] = useState("All Media");
  const [activeDay, setActiveDay] = useState<number | null>(null);

  // Derive unique days from assets
  const availableDays = useMemo(() => {
    const days = new Set(assets.map(a => a.day_number).filter(d => d !== undefined) as number[]);
    return Array.from(days).sort((a, b) => a - b);
  }, [assets]);

  const filteredAssets = assets.filter((asset) => {
    // Day filter
    if (activeDay !== null && asset.day_number !== activeDay) return false;

    // Category filter
    if (activeTab === "All Media") return true;
    if (activeTab === "Photos") return asset.type === "image";
    if (activeTab === "Social Clips") return asset.category === "Social Clips";
    if (activeTab === "Speaker Highlights") return asset.category === "Speaker Highlights";
    if (activeTab === "Documents") return asset.type === "document";
    if (activeTab === "Real-Time (Live)") {
      return true; 
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-body overflow-x-hidden selection:bg-vividOrange selection:text-atomicBlack transition-colors duration-300">
      {/* Minimal Header */}
      <header className="px-6 py-4 flex items-center gap-4 bg-background/90 backdrop-blur-lg sticky top-0 z-50 border-b border-black/10 dark:border-white/10">
        <Link href="/" className="text-foreground/60 hover:text-vividOrange transition-colors p-2 -ml-2 relative z-10 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-grow flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 border-l border-black/20 dark:border-white/20 pl-4">
          <div className="flex items-baseline gap-4">
            <h1 className="font-heading text-xl">{event.name}</h1>
            <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest hidden sm:inline-block">
              Client: {client?.name}
            </span>
          </div>
          
          {(event.location || event.start_date) && (
            <div className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest md:ml-auto flex flex-wrap gap-2 md:gap-4">
              {event.location && <span>{event.location}</span>}
              {event.start_date && (
                <span>
                 {new Date(event.start_date).toLocaleDateString()} {event.end_date ? `- ${new Date(event.end_date).toLocaleDateString()}` : ''}
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="px-6 py-12 max-w-[1800px] mx-auto w-full">
        {/* Philosophy & Stats Summary */}
        <section className="mb-12 bg-foreground/5 dark:bg-foreground/10 border border-black/10 dark:border-white/10 p-6 lg:p-8 flex flex-col md:flex-row justify-between gap-8 items-start md:items-center relative overflow-hidden rounded-sm">
          {/* Subtle background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-vividOrange/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 w-full md:w-auto">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-vividOrange mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-vividOrange animate-pulse"></span>
              System Live
            </h2>
            <p className="font-mono text-sm md:text-base text-foreground/80 tracking-wide uppercase leading-relaxed max-w-2xl">
              Event Content Engine Active. <br className="hidden md:block" />
              Generated <span className="text-foreground">{totalAssets}</span> assets across <span className="text-foreground">{categoriesCount}</span> categories.
            </p>
            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-2 bg-foreground/5 dark:bg-background px-3 py-1.5 border border-black/20 dark:border-white/20 rounded-sm">
                <ImageIcon size={14} className="text-foreground/50" />
                <span className="font-mono text-[10px] text-foreground/70">{photosCount} Photos</span>
              </div>
              <div className="flex items-center gap-2 bg-foreground/5 dark:bg-background px-3 py-1.5 border border-black/20 dark:border-white/20 rounded-sm">
                <Film size={14} className="text-foreground/50" />
                <span className="font-mono text-[10px] text-foreground/70">{videosCount} Videos</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 bg-background px-6 py-5 border border-black/20 dark:border-white/20 flex flex-col items-center min-w-[200px] select-none group w-full md:w-auto rounded-sm shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-vividOrange origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"></div>
            <p className="font-mono text-[10px] text-foreground/50 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Clock size={12} />
              One-Year Guarantee Tracker
            </p>
            <p className="font-heading text-4xl text-foreground">
              {daysRemaining} <span className="text-lg text-foreground/50 font-body">Days Left</span>
            </p>
            <p className="font-mono text-[9px] text-foreground/30 uppercase tracking-widest mt-2">
              Until {expiryDate.toISOString().split('T')[0]}
            </p>
          </div>
        </section>

        {/* Map & Tab Navigation Container */}
        <div className="mb-8 border-b border-black/10 dark:border-white/10 pb-4">
          
          {/* Day-by-Day Map */}
          {availableDays.length > 0 && (
            <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
              <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest mr-2 flex items-center gap-1">
                <Map size={12} /> Event Map
              </span>
              <button
                onClick={() => setActiveDay(null)}
                className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 min-h-[44px] sm:px-3 sm:py-1.5 sm:min-h-0 rounded-sm border transition-colors whitespace-nowrap relative z-10 ${
                  activeDay === null
                    ? "bg-vividOrange/10 border-vividOrange text-vividOrange"
                    : "bg-background border-black/10 dark:border-white/10 text-foreground/60 hover:text-foreground"
                }`}
              >
                All Days
              </button>
              {availableDays.map(day => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 min-h-[44px] sm:px-3 sm:py-1.5 sm:min-h-0 rounded-sm border transition-colors whitespace-nowrap relative z-10 ${
                    activeDay === day
                      ? "bg-vividOrange/10 border-vividOrange text-vividOrange"
                      : "bg-background border-black/10 dark:border-white/10 text-foreground/60 hover:text-foreground"
                  }`}
                >
                  Day {day.toString().padStart(2, '0')}
                </button>
              ))}
            </div>
          )}

          {/* Category Navigation */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <TabButton active={activeTab === "All Media"} onClick={() => setActiveTab("All Media")}>All Media</TabButton>
            <TabButton active={activeTab === "Photos"} onClick={() => setActiveTab("Photos")} icon={<ImageIcon size={14} />}>Photos</TabButton>
            <TabButton active={activeTab === "Real-Time (Live)"} onClick={() => setActiveTab("Real-Time (Live)")} icon={<PlaySquare size={14} />} highlight>Real-Time (Live)</TabButton>
            <TabButton active={activeTab === "Social Clips"} onClick={() => setActiveTab("Social Clips")} icon={<Film size={14} />}>Social Clips</TabButton>
            <TabButton active={activeTab === "Speaker Highlights"} onClick={() => setActiveTab("Speaker Highlights")} icon={<Mic size={14} />}>Speaker Highlights</TabButton>
            <TabButton active={activeTab === "Documents"} onClick={() => setActiveTab("Documents")}>Documents</TabButton>
          </nav>
        </div>

        {/* Media Grid */}
        <div className="mb-8 flex justify-between items-center relative z-10">
          <h3 className="font-heading text-2xl text-foreground">{activeTab} ({filteredAssets.length})</h3>
          <button className="flex items-center gap-2 bg-foreground text-background hover:bg-vividOrange hover:text-atomicBlack px-5 py-2.5 min-h-[44px] transition-colors font-semibold text-sm rounded-sm shadow-sm group relative z-10">
            <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
            Download Batch
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <MediaCard key={asset.id} asset={asset} />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-50 border border-dashed border-black/20 dark:border-white/20 rounded-sm">
              <ImageIcon size={48} className="mb-4 opacity-50" />
              <p className="font-mono text-sm uppercase tracking-widest text-foreground">No media found for this category.</p>
            </div>
          )}
        </div>
      </main>

      {/* Audit Log Footer */}
      <footer className="mt-20 py-6 px-6 border-t border-black/10 dark:border-white/10 bg-foreground/5 dark:bg-background">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[10px] text-foreground/30 uppercase tracking-widest">
            PHAM. Content Storage Architecture // End-to-End Secure
          </p>
          <div className="flex items-center gap-3 font-mono text-[10px] text-foreground/40">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Last accessed by sarah@techsummit.com on 2026-03-07
          </div>
        </div>
      </footer>
    </div>
  );
}

function TabButton({ children, active = false, icon, highlight = false, onClick }: { children: React.ReactNode, active?: boolean, icon?: React.ReactNode, highlight?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`
      flex items-center gap-2 px-6 py-4 min-h-[44px] font-mono text-xs uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors relative z-10
      ${active
        ? 'border-vividOrange text-vividOrange bg-vividOrange/5'
        : highlight
          ? 'border-transparent text-vividOrange/80 hover:text-vividOrange hover:bg-foreground/5'
          : 'border-transparent text-foreground opacity-60 hover:opacity-100 hover:bg-foreground/5'
      }
    `}>
      {icon}
      {children}
    </button>
  );
}


