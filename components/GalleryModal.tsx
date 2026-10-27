"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import ImageViewer from "@/components/ImageViewer";

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  details: string[];
}

interface GalleryModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export default function GalleryModal({ item, onClose }: GalleryModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && item) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-10 bg-black/85 backdrop-blur-xl"
      >
        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[92vh] bg-[#0b101c] border border-white/10 rounded-2xl shadow-2xl z-10 flex flex-col overflow-y-auto"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-slate-900/90 border-b border-white/[0.06] sticky top-0 z-20 backdrop-blur-md">
            <div>
              <span className="text-[11px] font-mono text-indigo-400 font-medium">
                {item.category}
              </span>
              <h3 className="text-base sm:text-xl font-bold text-white tracking-tight mt-0.5">{item.title}</h3>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer active:scale-95"
              aria-label="Close modal"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 space-y-5">
            {/* Modern Image Viewer with Zoom & Pan */}
            <div className="space-y-2">
              <ImageViewer
                src={item.image}
                alt={item.title}
                originalUrl={item.image}
                heightClassName="h-60 sm:h-[420px] md:h-[480px]"
              />
            </div>

            {/* Description & Specifications */}
            <div className="space-y-4">
              <h4 className="text-sm sm:text-base font-semibold text-white">Spesifikasi & Detail Teknis</h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 text-xs font-mono border border-white/[0.06]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Key Details List */}
              {Array.isArray(item.details) && item.details.length > 0 && (
                <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Arsitektur & Fitur Utama</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/[0.05] text-xs text-slate-300"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
