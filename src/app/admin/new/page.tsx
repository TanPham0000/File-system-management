"use client";

import { mockCompanies } from "@/lib/mockData";
import { ArrowLeft, Save, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function NewProjectPage() {
  const router = useRouter();
  const [clientId, setClientId] = useState(mockCompanies[0].id);
  const [eventTitle, setEventTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [brandingColor, setBrandingColor] = useState("#FF4500"); // Default Vivid Orange
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Automatically calculate total days
  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Inclusive of start day
  }, [startDate, endDate]);

  // Automatically calculate vault expiry (365 days from end date)
  const vaultExpiry = useMemo(() => {
    if (!endDate) return "Pending Configuration";
    const end = new Date(endDate);
    end.setDate(end.getDate() + 365);
    return end.toISOString().split('T')[0];
  }, [endDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to create project
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#FAFAFA] flex flex-col font-body selection:bg-vividOrange selection:text-atomicBlack transition-colors duration-300">
      {/* Header */}
      <header className="px-8 py-4 flex justify-between items-center border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50 pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
          <Link href="/admin" className="p-2 -ml-2 text-white/60 hover:text-vividOrange transition-colors relative z-10 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </Link>
          <div className="h-4 w-px bg-white/20"></div>
          <div>
            <h1 className="font-heading text-lg tracking-tight">Provisioning System</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">
              New Content Vault
            </p>
          </div>
        </div>
      </header>

      <main className="flex-grow p-8 max-w-4xl mx-auto w-full flex flex-col">
        <div className="mb-10">
          <h2 className="font-heading text-4xl tracking-tight mb-2">Create Project.</h2>
          <p className="font-mono text-xs uppercase tracking-widest opacity-60">
            Initialize a new secure media environment for a client.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-[#111] border border-white/10 p-8 rounded-sm shadow-2xl relative overflow-hidden">
          {/* Success Overlay */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="absolute inset-0 bg-green-500/10 backdrop-blur-sm z-50 flex flex-col items-center justify-center border border-green-500/30"
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex flex-col items-center"
                >
                  <CheckCircle2 size={64} className="text-green-500 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                  <h3 className="font-heading text-2xl text-white">Vault Provisioned</h3>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-green-400 mt-2">Redirecting to Command Center...</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Client Selection */}
            <div className="flex flex-col gap-2">
              <label className="font-switser text-sm font-medium text-white/80">Client Organization</label>
              <select 
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="bg-[#0a0a0a] border border-white/20 p-3 rounded-sm font-body text-white focus:outline-none focus:border-vividOrange transition-colors appearance-none cursor-pointer"
                required
              >
                <option value="" disabled>Select Client...</option>
                {mockCompanies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            </div>

            {/* Event Title */}
            <div className="flex flex-col gap-2">
              <label className="font-switser text-sm font-medium text-white/80">Event Title</label>
              <input 
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g. B2B Tech Expo 2026"
                className="bg-[#0a0a0a] border border-white/20 p-3 rounded-sm font-body text-white placeholder:text-white/30 focus:outline-none focus:border-vividOrange transition-colors"
                required
              />
            </div>

            {/* Date Range */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-switser text-sm font-medium text-white/80">Event Duration</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/20 p-3 pl-10 rounded-sm text-sm font-mono text-white focus:outline-none focus:border-vividOrange transition-colors [color-scheme:dark]"
                    required
                  />
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                </div>
                <div className="relative">
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full bg-[#0a0a0a] border border-white/20 p-3 pl-10 rounded-sm text-sm font-mono text-white focus:outline-none focus:border-vividOrange transition-colors [color-scheme:dark]"
                    required
                  />
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Automatic Calculations Area */}
            <div className="md:col-span-2 bg-[#0a0a0a] border border-white/10 p-4 rounded-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">Total Event Days</span>
                  <span className="font-mono text-lg text-white">{totalDays > 0 ? totalDays : '-'}</span>
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">Vault Expiry (1 Year)</span>
                  <span className="font-mono text-sm text-vividOrange">{vaultExpiry}</span>
                </div>
              </div>
            </div>

            {/* Branding Toggle */}
            <div className="flex flex-col gap-2 md:col-span-2 border-t border-white/10 pt-6">
              <label className="font-switser text-sm font-medium text-white/80">Primary Branding Color</label>
              <div className="flex items-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => { setIsCustomColor(false); setBrandingColor('#FF4500'); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm border transition-colors ${!isCustomColor ? 'border-vividOrange bg-vividOrange/10 text-white' : 'border-white/20 text-white/60 hover:text-white'}`}
                >
                  <span className="w-3 h-3 rounded-full bg-vividOrange shadow-[0_0_8px_rgba(255,69,0,0.8)]"></span>
                  <span className="font-mono text-[10px] uppercase tracking-widest">Vivid Orange</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomColor(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm border transition-colors ${isCustomColor ? 'border-[#888] bg-white/5 text-white' : 'border-white/20 text-white/60 hover:text-white'}`}
                >
                  <span className="w-3 h-3 rounded-full border border-white/40" style={{ backgroundColor: isCustomColor ? brandingColor : 'transparent' }}></span>
                  <span className="font-mono text-[10px] uppercase tracking-widest">Custom Hex</span>
                </button>
                
                {isCustomColor && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 ml-4">
                    <input 
                      type="color" 
                      value={brandingColor}
                      onChange={(e) => setBrandingColor(e.target.value)}
                      className="w-8 h-8 rounded-sm cursor-pointer bg-transparent border-0 p-0"
                    />
                    <input 
                      type="text" 
                      value={brandingColor.toUpperCase()}
                      onChange={(e) => setBrandingColor(e.target.value)}
                      className="bg-[#0a0a0a] border border-white/20 px-2 py-1.5 rounded-sm font-mono text-xs w-24 focus:outline-none focus:border-white/50 uppercase"
                      maxLength={7}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 mt-4 border-t border-white/10">
            <button 
              type="submit"
              disabled={isSubmitting || !eventTitle || !startDate || !endDate}
              className="bg-white text-[#0a0a0a] hover:bg-vividOrange hover:text-atomicBlack disabled:opacity-50 disabled:cursor-not-allowed font-heading font-semibold px-8 py-3 transition-colors rounded-sm shadow-sm flex items-center gap-2 group min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin"></div>
                  Provisioning...
                </>
              ) : (
                <>
                  <Save size={18} className="group-hover:scale-110 transition-transform" />
                  Initialize Vault Storage
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
