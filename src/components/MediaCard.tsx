"use client";

import { MediaAsset } from "@/lib/mockData";
import Image from "next/image";
import { Download, PlaySquare, Info, FileText, Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";

export default function MediaCard({ asset, onDownload, onDelete, onEdit }: { asset: MediaAsset, onDownload?: (asset: MediaAsset) => void, onDelete?: (asset: MediaAsset) => void, onEdit?: (asset: MediaAsset) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group relative aspect-square bg-foreground/5 dark:bg-[#111] border border-black/10 dark:border-white/10 overflow-hidden cursor-pointer hover:border-black/30 dark:hover:border-white/30 transition-colors rounded-sm"
    >
      {asset.type === 'image' ? (
        <Image
          src={asset.url}
          alt={asset.filename}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={false}
        />
      ) : asset.type === 'video' ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-[#0a0a0a]">
          <video
            src={asset.url}
            className="w-full h-full object-cover opacity-80"
            muted
            loop
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
            <PlaySquare size={32} className="text-white drop-shadow-lg" />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 dark:bg-[#1a1a1a] text-foreground/50 transition-colors group-hover:text-vividOrange">
          <FileText size={48} className="drop-shadow-sm mb-2 opacity-80" />
          <span className="font-mono text-[10px] uppercase tracking-widest">{asset.format || "DOC"}</span>
        </div>
      )}

      {/* Hover Info Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex flex-col justify-end">
        <div className="flex justify-between items-start mb-1">
          <p className="font-mono text-[9px] text-vividOrange truncate uppercase drop-shadow-sm">{asset.category}</p>
          <div className="group/info relative cursor-help">
            <Info size={12} className="text-foreground/50 hover:text-foreground transition-colors relative z-10" />
            <div className="absolute bottom-full right-0 mb-2 w-max bg-background border border-black/10 dark:border-white/10 px-2 py-1.5 rounded-sm opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-30">
              <p className="font-mono text-[8px] text-foreground/80 whitespace-nowrap">
                {asset.size_mb}MB • {asset.width && asset.height ? `${asset.width}x${asset.height} • ` : ""}{asset.format || 'Unknown'}
              </p>
            </div>
          </div>
        </div>
        <p className="font-body text-xs text-foreground font-medium truncate mb-2 drop-shadow-sm">{asset.filename}</p>
        
        {/* Subtle File Info requested by user at 10% opacity */}
        <p className="font-mono text-[8px] text-foreground opacity-10 mb-3 truncate">
          {asset.size_mb}MB | {asset.width && asset.height ? `${asset.width}x${asset.height}px | ` : ""}{asset.format || (asset.type === 'video' ? 'MP4' : asset.type === 'image' ? 'JPG' : 'PDF')}
        </p>

        <div className="flex gap-2 relative z-20">
          {asset.type === 'video' ? (
            <>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDownload?.(asset); }}
                className="flex-1 bg-vividOrange text-atomicBlack flex items-center justify-center py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 gap-1 hover:bg-[#ffaa40] transition-colors shadow-sm rounded-sm relative z-10"
                title="Download 4K Original"
              >
                <Download size={14} className="sm:w-3 sm:h-3" />
                <span className="font-mono text-[10px] sm:text-[9px] uppercase font-bold tracking-widest truncate">Original</span>
              </button>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDownload?.(asset); }}
                className="flex-1 bg-foreground text-background flex items-center justify-center py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 gap-1 hover:bg-foreground/80 transition-colors shadow-sm rounded-sm relative z-10"
                title="Download 1080p for LinkedIn"
              >
                <Download size={14} className="sm:w-3 sm:h-3" />
                <span className="font-mono text-[10px] sm:text-[9px] uppercase font-bold tracking-widest truncate">Social</span>
              </button>
            </>
          ) : (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDownload?.(asset); }}
              className="flex-1 bg-vividOrange text-atomicBlack flex items-center justify-center py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 gap-1 hover:bg-[#ffaa40] transition-colors shadow-sm rounded-sm relative z-10"
            >
              <Download size={14} className="sm:w-3 sm:h-3" />
              <span className="font-mono text-[10px] sm:text-[9px] uppercase font-bold tracking-widest">Get</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Actions Overlay (if provided) */}
      {(onDelete || onEdit) && (
        <div className="absolute top-2 left-2 flex flex-col gap-2 z-20">
          {onEdit && (
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(asset); }}
              className="bg-background/80 backdrop-blur hover:bg-vividOrange hover:text-atomicBlack transition-colors border border-black/10 dark:border-white/10 p-2 shadow-sm rounded-sm text-foreground opacity-0 group-hover:opacity-100"
              title="Edit Metadata"
            >
              <Edit size={14} />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(asset); }}
              className="bg-background/80 backdrop-blur hover:bg-red-500 hover:text-white transition-colors border border-black/10 dark:border-white/10 p-2 shadow-sm rounded-sm text-foreground opacity-0 group-hover:opacity-100"
              title="Delete Asset"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}

      {/* Format Badge */}
      <div className="absolute top-2 right-2 bg-background/80 backdrop-blur border border-black/10 dark:border-white/10 px-1.5 py-0.5 pointer-events-none z-10 shadow-sm rounded-sm">
        <p className="font-mono text-[8px] opacity-70 uppercase text-foreground">{asset.format || (asset.type === 'video' ? 'MP4' : asset.type === 'image' ? 'JPG' : 'PDF')}</p>
      </div>
    </motion.div>
  );
}
