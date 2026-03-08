"use client";

import { MediaAsset } from "@/lib/mockData";
import Image from "next/image";
import { Download, PlaySquare } from "lucide-react";
import { motion } from "framer-motion";

export default function MediaCard({ asset, onDownload }: { asset: MediaAsset, onDownload?: (asset: MediaAsset) => void }) {
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
      ) : (
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
      )}

      {/* Hover Info Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex flex-col justify-end">
        <p className="font-mono text-[9px] text-vividOrange truncate mb-1 uppercase drop-shadow-sm">{asset.category}</p>
        <p className="font-body text-xs text-foreground font-medium truncate mb-3 drop-shadow-sm">{asset.filename}</p>

        <div className="flex gap-2 relative z-20">
          {asset.type === 'video' ? (
            <>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDownload?.(asset); }}
                className="flex-1 bg-vividOrange text-atomicBlack flex items-center justify-center py-1.5 gap-1 hover:bg-[#ffaa40] transition-colors shadow-sm rounded-sm"
                title="Download 4K Original"
              >
                <Download size={12} />
                <span className="font-mono text-[8px] sm:text-[9px] uppercase font-bold tracking-widest truncate">Original</span>
              </button>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDownload?.(asset); }}
                className="flex-1 bg-foreground text-background flex items-center justify-center py-1.5 gap-1 hover:bg-foreground/80 transition-colors shadow-sm rounded-sm"
                title="Download 1080p for LinkedIn"
              >
                <Download size={12} />
                <span className="font-mono text-[8px] sm:text-[9px] uppercase font-bold tracking-widest truncate">Social</span>
              </button>
            </>
          ) : (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDownload?.(asset); }}
              className="flex-1 bg-vividOrange text-atomicBlack flex items-center justify-center py-1.5 gap-1 hover:bg-[#ffaa40] transition-colors shadow-sm rounded-sm"
            >
              <Download size={12} />
              <span className="font-mono text-[9px] uppercase font-bold tracking-widest">Get</span>
            </button>
          )}
        </div>
      </div>

      {/* Format Badge */}
      <div className="absolute top-2 right-2 bg-background/80 backdrop-blur border border-black/10 dark:border-white/10 px-1.5 py-0.5 pointer-events-none z-10 shadow-sm rounded-sm">
        <p className="font-mono text-[8px] opacity-70 uppercase text-foreground">{asset.type === 'video' ? 'MP4' : 'JPG'}</p>
      </div>
    </motion.div>
  );
}
