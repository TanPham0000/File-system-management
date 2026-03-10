"use client";

import { mockEvents, mockAssets, mockCompanies, MediaAsset } from "@/lib/mockData";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, FileType, CheckCircle2, X } from "lucide-react";
import { useState, useCallback } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import MediaCard from "@/components/MediaCard";

export default function AdminVaultPage({ params }: { params: { eventId: string } }) {
  const event = mockEvents.find((e) => e.id === params.eventId);

  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, category: string, day: string}[]>([]);
  
  const [uploadCategory, setUploadCategory] = useState("Photos");
  const [uploadDay, setUploadDay] = useState("1");
  const [localAssets, setLocalAssets] = useState(mockAssets); // Use local state seeded by mockData to trigger immediate renders
  
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [editCategory, setEditCategory] = useState("");
  const [editDay, setEditDay] = useState("");

  if (!event) {
    notFound();
  }

  const client = mockCompanies.find(c => c.id === event.client_id);
  const existingAssets = localAssets.filter(a => a.event_id === event.id);
  const existingAssetsCount = existingAssets.length;

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
      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/') || f.type === 'application/pdf');
      if (validFiles.length > 0) {
        setUploadedFiles(prev => [...prev, ...validFiles.map(file => ({ file, category: uploadCategory, day: uploadDay }))]);
        simulateUpload();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadCategory, uploadDay]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/') || f.type === 'application/pdf');
      if (validFiles.length > 0) {
        setUploadedFiles(prev => [...prev, ...validFiles.map(file => ({ file, category: uploadCategory, day: uploadDay }))]);
        simulateUpload();
      }
    }
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
            
            // Add successful uploads to the mock data so it reflects immediately
            const newAssets: MediaAsset[] = uploadedFiles.map((upload, index) => {
              const isVideo = upload.file.type.startsWith('video');
              const isPdf = upload.file.type === 'application/pdf';
              const type = isVideo ? "video" : isPdf ? "document" : "image";
              
              const formatMatch = upload.file.name.match(/\.([^.]+)$/);
              const format = formatMatch ? formatMatch[1].toUpperCase() : (isVideo ? "MP4" : isPdf ? "PDF" : "JPG");
              
              return {
                id: `new-asset-${Date.now()}-${index}`,
                event_id: event.id,
                type: type as "image" | "video" | "document",
                category: upload.category,
                url: isVideo ? "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4" : "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2073&auto=format&fit=crop",
                filename: upload.file.name,
                format: format,
                size_mb: Math.round(upload.file.size / 1024 / 1024 * 10) / 10,
                day_number: parseInt(upload.day) || undefined,
                created_at: new Date().toISOString(),
              };
            });
            
            // Update the global mock array so the client Vault page sees it
            mockAssets.push(...newAssets);
            
            // Update local state to force a re-render of Visual Vault
            setLocalAssets([...mockAssets]);
            
            // Clear queue
            setUploadedFiles([]);
            
          }, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);
  };

  const handleDeleteAsset = (assetToDelete: MediaAsset) => {
    if (confirm(`Are you sure you want to permanently delete ${assetToDelete.filename}? This will remove it from the Supabase storage bucket and database.`)) {
      // Simulate API call to delete
      const updatedAssets = localAssets.filter(a => a.id !== assetToDelete.id);
      
      // Update global block as well so it persists in the session mock
      const globalIndex = mockAssets.findIndex(a => a.id === assetToDelete.id);
      if (globalIndex > -1) {
        mockAssets.splice(globalIndex, 1);
      }
      
      setLocalAssets(updatedAssets);
    }
  };

  const handleEditAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAsset) {
      // Simulate API call to update metadata
      const updatedAssets = localAssets.map(a => {
        if (a.id === editingAsset.id) {
          return {
            ...a,
            category: editCategory,
            day_number: parseInt(editDay) || undefined
          };
        }
        return a;
      });
      
      // Update global mock
      const globalAsset = mockAssets.find(a => a.id === editingAsset.id);
      if (globalAsset) {
        globalAsset.category = editCategory;
        globalAsset.day_number = parseInt(editDay) || undefined;
      }
      
      setLocalAssets(updatedAssets);
      setEditingAsset(null);
    }
  };

  const openEditModal = (asset: MediaAsset) => {
    setEditingAsset(asset);
    setEditCategory(asset.category);
    setEditDay(asset.day_number ? asset.day_number.toString() : "");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body selection:bg-vividOrange selection:text-atomicBlack transition-colors duration-300">
      {/* Header */}
      <header className="px-8 py-4 flex justify-between items-center border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-50 pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
          <Link href="/admin" className="p-2 -ml-2 text-foreground/60 hover:text-vividOrange transition-colors relative z-10 min-h-[44px] min-w-[44px] flex items-center justify-center">
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
        
        <div className="flex items-center gap-6 pointer-events-auto relative z-10">
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">
            {existingAssetsCount} Assets Hosted
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow p-8 max-w-5xl mx-auto w-full flex flex-col">
        <div className="mb-8">
          <h2 className="font-heading text-4xl tracking-tight mb-2">Ingest Media Engine.</h2>
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-6">
            Support for High-Res RAW exports and 4K MP4s. Max 5GB per batch.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex flex-col gap-1 w-full sm:w-1/3">
              <label className="font-mono text-[10px] uppercase tracking-widest opacity-60">Assign to Day</label>
              <input 
                type="text"
                list="day-suggestions"
                value={uploadDay} 
                onChange={(e) => setUploadDay(e.target.value)}
                placeholder="e.g. 1"
                className="bg-foreground/5 dark:bg-[#111] border border-black/10 dark:border-white/10 p-3 rounded-sm font-mono text-xs text-foreground focus:outline-none focus:border-vividOrange transition-colors"
              />
              <datalist id="day-suggestions">
                <option value="1">Day 01</option>
                <option value="2">Day 02</option>
                <option value="3">Day 03</option>
                <option value="4">Day 04</option>
                <option value="5">Day 05</option>
              </datalist>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-2/3">
              <label className="font-mono text-[10px] uppercase tracking-widest opacity-60">Assign to Category</label>
              <input 
                type="text"
                list="category-suggestions"
                value={uploadCategory} 
                onChange={(e) => setUploadCategory(e.target.value)}
                placeholder="e.g. Photos"
                className="bg-foreground/5 dark:bg-[#111] border border-black/10 dark:border-white/10 p-3 rounded-sm font-mono text-xs text-foreground focus:outline-none focus:border-vividOrange transition-colors"
              />
              <datalist id="category-suggestions">
                <option value="Photos">Photos</option>
                <option value="Social Clips">Social Clips</option>
                <option value="Speaker Highlights">Speaker Highlights</option>
                <option value="Full Recap">Full Recap</option>
                <option value="Raw Interviews">Raw Interviews</option>
                <option value="Documents">Documents</option>
              </datalist>
            </div>
          </div>
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
              accept="image/*,video/*,application/pdf"
              className="hidden" 
              id="file-upload"
              onChange={handleFileInput}
            />
            <label 
              htmlFor="file-upload"
              className="cursor-pointer bg-foreground text-background hover:bg-vividOrange hover:text-atomicBlack font-heading font-semibold px-8 py-3 min-h-[44px] transition-colors rounded-sm shadow-sm relative z-20 flex items-center justify-center"
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
              {uploadedFiles.map((upload, i) => (
                <li key={i} className="px-6 py-3 border-b border-black/5 dark:border-white/5 last:border-0 flex items-center justify-between hover:bg-foreground/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <FileType size={16} className="opacity-40" />
                    <div>
                      <p className="font-body text-sm truncate max-w-[300px] md:max-w-md">{upload.file.name}</p>
                      <p className="font-mono text-[9px] uppercase tracking-widest opacity-40">
                        {Math.round(upload.file.size / 1024 / 1024 * 10) / 10} MB • {upload.file.type} • Day {upload.day} • {upload.category}
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

        {/* Existing Vault Assets Grid */}
        <div className="mt-16">
          <div className="mb-6 flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-4">
            <h2 className="font-heading text-2xl tracking-tight">Visual Vault.</h2>
            <span className="font-mono text-xs uppercase tracking-widest opacity-60">{existingAssetsCount} Assets Indexed</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {existingAssets.length > 0 ? (
              existingAssets.map((asset) => (
                <MediaCard 
                  key={asset.id} 
                  asset={asset} 
                  onDelete={handleDeleteAsset} 
                  onEdit={openEditModal} 
                />
              ))
            ) : (
              <div className="col-span-full py-12 flex flex-col items-center justify-center opacity-50 border border-dashed border-black/20 dark:border-white/20 rounded-sm">
                <p className="font-mono text-sm uppercase tracking-widest text-foreground">No media found in vault.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Metadata Modal */}
      <AnimatePresence>
        {editingAsset && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111] border border-white/10 p-6 rounded-sm shadow-2xl max-w-md w-full relative"
            >
              <button 
                onClick={() => setEditingAsset(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="font-heading text-2xl mb-1">Edit Metadata</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-6 truncate">{editingAsset.filename}</p>

              <form onSubmit={handleEditAsset} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-switser text-sm font-medium text-white/80">Day Number</label>
                  <input 
                    type="number"
                    value={editDay}
                    onChange={(e) => setEditDay(e.target.value)}
                    placeholder="e.g. 1"
                    className="bg-[#0a0a0a] border border-white/20 p-3 rounded-sm font-body text-white focus:outline-none focus:border-vividOrange transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <label className="font-switser text-sm font-medium text-white/80">Category</label>
                  <input 
                    type="text"
                    list="modal-category-suggestions"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="bg-[#0a0a0a] border border-white/20 p-3 rounded-sm font-body text-white focus:outline-none focus:border-vividOrange transition-colors"
                  />
                  <datalist id="modal-category-suggestions">
                    <option value="Photos">Photos</option>
                    <option value="Social Clips">Social Clips</option>
                    <option value="Speaker Highlights">Speaker Highlights</option>
                    <option value="Documents">Documents</option>
                  </datalist>
                </div>
                
                <button 
                  type="submit"
                  className="bg-white text-[#0a0a0a] hover:bg-vividOrange hover:text-atomicBlack font-heading font-semibold px-4 py-3 transition-colors rounded-sm shadow-sm"
                >
                  Save Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
