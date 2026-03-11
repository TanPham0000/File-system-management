"use client";

import { useState } from "react";
import { Company } from "@/lib/types";
import { createCompanyAction } from "@/actions/storage";
import { Users, X, CheckCircle2, Building } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface OnboardClientModalProps {
  onSuccess?: (newCompany: Company) => void;
}

export function OnboardClientModal({ onSuccess }: OnboardClientModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newCompany = await createCompanyAction(companyName);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
        setCompanyName("");
        if (onSuccess) onSuccess(newCompany);
        router.refresh(); // Refresh the server page to load the new client into the directory array
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("Failed to onboard partner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-foreground text-background font-heading font-semibold px-5 py-2.5 min-h-[44px] flex items-center justify-center gap-2 hover:bg-vividOrange hover:text-atomicBlack transition-colors rounded-sm shadow-sm relative z-10 w-full md:w-auto"
      >
        <Users size={18} />
        Onboard Partner
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !isSubmitting && !isSuccess && setIsOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="bg-background border border-black/10 dark:border-white/10 p-8 rounded-sm shadow-2xl relative w-full max-w-md overflow-hidden z-10 text-foreground"
            >
              {/* Success Overlay */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="absolute inset-0 bg-green-500/10 backdrop-blur-md z-50 flex flex-col items-center justify-center border border-green-500/30"
                  >
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring" }}
                      className="flex flex-col items-center"
                    >
                      <CheckCircle2 size={64} className="text-green-500 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                      <h3 className="font-heading text-2xl">Partner Added</h3>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-green-500 mt-2">Directory Updated</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-foreground/50 hover:text-vividOrange transition-colors p-2"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>

              <div className="mb-8 pr-8">
                <h2 className="font-heading text-3xl tracking-tight mb-2">New Partner.</h2>
                <p className="font-mono text-[10px] sm:text-xs uppercase tracking-widest opacity-60">
                  Register a new client organization in the directory.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-switser text-sm font-medium opacity-80">Organization Name</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Studio"
                      className="w-full bg-foreground/5 border border-black/10 dark:border-white/20 p-3 pl-10 rounded-sm font-body focus:outline-none focus:border-vividOrange transition-colors"
                      required
                      autoFocus
                      disabled={isSubmitting}
                    />
                    <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                  </div>
                </div>

                <div className="flex justify-end pt-4 mt-2 border-t border-black/10 dark:border-white/10">
                  <button 
                    type="submit"
                    disabled={isSubmitting || !companyName.trim()}
                    className="bg-foreground text-background hover:bg-vividOrange hover:text-atomicBlack disabled:opacity-50 disabled:cursor-not-allowed font-heading font-semibold px-6 py-2.5 transition-colors rounded-sm shadow-sm flex items-center gap-2 min-h-[44px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                        Registering...
                      </>
                    ) : (
                      "Register Partner"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
