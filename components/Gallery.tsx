"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Image as ImageIcon,
  ZoomIn,
} from "lucide-react";
import GalleryModal, { GalleryItem } from "./GalleryModal";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Gallery() {
  const { data } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filterOptions = ["Semua", "Fechat", "ARYANOKOS", "ARYASHOP", "DevOps & Server"];

  const filteredItems =
    activeFilter === "Semua"
      ? data.gallery
      : data.gallery.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="py-20 sm:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-3 max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Dokumentasi Visual</span>
          </div>

          <motion.h2
            id="gallery-heading"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight"
          >
            Antarmuka & Tangkapan Layar Proyek
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            Tangkapan layar nyata dari setiap platform digital dan infrastruktur server 
            yang dikembangkan oleh Fakhri Arya Dzaki. Klik pada gambar untuk melihat detail penuh.
          </motion.p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-10 sm:mb-12">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                activeFilter === filter
                  ? "bg-white text-slate-950 font-semibold shadow-sm"
                  : "bg-slate-900/80 border border-white/[0.06] text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                onClick={() => setSelectedItem(item)}
                className="glass-panel rounded-2xl overflow-hidden glass-panel-hover group cursor-pointer border border-white/[0.08] relative"
              >
                {/* Image Showcase */}
                <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-slate-950">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-top group-hover:scale-102 transition-transform duration-500"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                    <div className="p-2.5 rounded-full bg-white text-slate-950 shadow-md">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-white">
                      Buka Pratinjau
                    </span>
                  </div>
                </div>

                {/* Caption Bar */}
                <div className="p-4 sm:p-5 bg-slate-950/80 flex items-center justify-between border-t border-white/[0.06]">
                  <div>
                    <span className="text-[11px] font-mono text-indigo-400 font-medium">
                      {item.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-slate-100 transition-colors mt-0.5">
                      {item.title}
                    </h3>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 group-hover:text-white transition-colors">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Modal Viewer */}
        <GalleryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      </div>
    </section>
  );
}
