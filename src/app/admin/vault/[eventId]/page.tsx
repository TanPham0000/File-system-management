"use client";

import { mockEvents, mockAssets, mockCompanies, MediaAsset } from "@/lib/mockData";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, FileType, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminVaultPage({ params }: { params: { eventId: string } }) {
  const router = useRouter();
  const event = mockEvents.find((e) => e.id === params.eventId);

  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  if (!event) {
    notFound();
  }

  const client = mockCompanies.find(c => c.id === event.client_id);
  const existingAssetsCount = mockAssets.filter(a => a.event_id === event.id).length;

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    // Basic validation
    const validFiles = files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
    if (validFiles.length === 0) return;

    setUploadedFiles(prev => [...prev, ...validFiles]);
    simulateUpload();
  };

  const simulateUpload = () => {
    setUploading(true);
    setProgress(0);
    
    // Simulate a fake progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploading(false);
            // We could push to mockData here if we wanted it to persist across navigation
          }, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body selection:bg-vividOrange selection:text-atomicBlack transition-colors duration-300">
      {/* Header */}
      <header className="px-8 py-4 flex justify-between items-center border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="p-2 -ml-2 text-foreground/60 hover:text-vividOrange transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="h-4 w-px bg-black/20 dark:bg-white/20"></div>
          <div>
            <h1 className="font-heading text-lg tracking-tight">Vault Management</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">
              {event.name} / {client?.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">
            {existingAssetsCount} Assets Hosted
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow p-8 max-w-5xl mx-auto w-full flex flex-col">
        <div className="mb-8">
          <h2 className="font-heading text-4xl tracking-tight mb-2">Ingest Media Engine.</h2>
          <p className="font-mono text-xs uppercase tracking-widest opacity-60">
            Support for High-Res RAW exports and 4K MP4s. Max 5GB per batch.
          </p>
        </div>

        {/* Upload Area */}
        <div 
          onDragEnter={handleDragEnter}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex-grow border-2 border-dashed rounded-sm transition-all duration-300 flex flex-col items-center justify-center p-12 min-h-[400px] relative overflow-hidden group
            ${isDragActive 
              ? 'border-vividOrange bg-vividOrange/5 scale-[1.02]' 
              : 'border-black/20 dark:border-white/20 hover:border-vividOrange/50 bg-foreground/5 dark:bg-[#111]'}`}
        >
          {/* Subtle background pulse when active */}
          {isDragActive && (
            <motion.div 
              layoutId="drag-ring"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-gradient-radial from-vividOrange/10 to-transparent pointer-events-none"
            />
          )}

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className={`p-4 rounded-full mb-6 transition-colors duration-500 shadow-sm
              ${isDragActive ? 'bg-vividOrange text-atomicBlack shadow-vividOrange/20' : 'bg-background text-foreground/50 border border-black/10 dark:border-white/10 group-hover:text-vividOrange'}`}>
              <UploadCloud size={48} strokeWidth={1.5} />
            </div>
            
            <h3 className="font-heading text-2xl mb-2">Drag & Drop Batch Upload</h3>
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-8 max-w-md">
              Securely transfer files directly to the {client?.name} storage bucket. Files are encrypted at rest.
            </p>

            <input 
              type="file" 
              multiple 
              accept="image/*,video/*"
              className="hidden" 
              id="file-upload"
              onChange={handleFileInput}
            />
            <label 
              htmlFor="file-upload"
              className="cursor-pointer bg-foreground text-background hover:bg-vividOrange hover:text-atomicBlack font-heading font-semibold px-8 py-3 transition-colors rounded-sm shadow-sm"
            >
              Browse Local Drives
            </label>
          </div>

          {/* Upload Progress Overlay */}
          <AnimatePresence>
            {uploading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-x-8 bottom-8 bg-background border border-black/10 dark:border-white/10 p-6 rounded-sm shadow-xl z-20"
              >
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h4 className="font-heading text-lg">Encrypting & Transferring</h4>
                    <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">
                      Processing {uploadedFiles.length} high-res assets...
                    </p>
                  </div>
                  <span className="font-mono text-xl text-vividOrange">{progress}%</span>
                </div>
                
                <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-vividOrange"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Uploaded Files Queue */}
        {uploadedFiles.length > 0 && !uploading && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-8 border border-black/10 dark:border-white/10 rounded-sm overflow-hidden bg-background shadow-sm"
          >
            <div className="bg-foreground/5 dark:bg-[#111] px-6 py-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
              <h3 className="font-mono text-xs uppercase tracking-widest">Recent Ingests</h3>
              <span className="flex items-center gap-2 text-green-500 font-mono text-[10px] uppercase tracking-widest">
                <CheckCircle2 size={14} /> All Systems Green
              </span>
            </div>
            <ul className="max-h-60 overflow-y-auto">
              {uploadedFiles.map((f, i) => (
                <li key={i} className="px-6 py-3 border-b border-black/5 dark:border-white/5 last:border-0 flex items-center justify-between hover:bg-foreground/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <FileType size={16} className="opacity-40" />
                    <div>
                      <p className="font-body text-sm truncate max-w-[300px] md:max-w-md">{f.name}</p>
                      <p className="font-mono text-[9px] uppercase tracking-widest opacity-40">
                        {Math.round(f.size / 1024 / 1024 * 10) / 10} MB • {f.type}
                      </p>
                    </div>
                  </div>
                  <button className="text-[10px] font-mono uppercase tracking-widest text-vividOrange opacity-0 group-hover:opacity-100 hover:underline">
                    Manage
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </main>
    </div>
  );
}
