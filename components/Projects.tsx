"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  MessageSquare,
  Smartphone,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Zap,
  FolderCode,
  ExternalLink,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function Projects() {
  const { data } = usePortfolio();
  const { projects } = data;

  const getIconForCategory = (cat: string) => {
    if (cat.toLowerCase().includes("chat") || cat.toLowerCase().includes("messaging")) return MessageSquare;
    if (cat.toLowerCase().includes("number") || cat.toLowerCase().includes("otp") || cat.toLowerCase().includes("virtual")) return Smartphone;
    if (cat.toLowerCase().includes("shop") || cat.toLowerCase().includes("top-up") || cat.toLowerCase().includes("game")) return ShoppingBag;
    return FolderCode;
  };

  return (
    <section id="projects" aria-labelledby="projects-heading" className="py-20 sm:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-3 max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Portofolio Proyek</span>
          </div>

          <motion.h2
            id="projects-heading"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight"
          >
            Platform Rekayasa & Produk Digital
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            Layanan digital nyata yang dirancang dari arsitektur awal, dibangun hingga tahap produksi, 
            dan dioperasikan secara mandiri dengan tingkat ketersediaan tinggi.
          </motion.p>
        </div>

        {/* Projects Grid Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7"
        >
          {projects.map((project) => {
            const IconComponent = getIconForCategory(project.category);
            return (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="glass-panel rounded-2xl overflow-hidden glass-panel-hover flex flex-col justify-between group border border-white/[0.08]"
              >
                <div>
                  {/* Image Preview Container */}
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block h-48 sm:h-52 w-full overflow-hidden bg-slate-950 group/img cursor-pointer"
                      title={`Kunjungi ${project.title}`}
                    >
                      <Image
                        src={project.image || "/images/fechat.png"}
                        alt={project.title}
                        fill
                        className="object-cover object-top group-hover/img:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e18] via-[#0a0e18]/40 to-transparent" />

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md text-[11px] font-medium text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{project.status}</span>
                      </div>

                      {/* Live Link Badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white border border-indigo-400/30 shadow-md text-xs font-semibold backdrop-blur-sm transition-colors">
                        <span className="text-[11px]">Live Web</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </a>
                  ) : (
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
                      <Image
                        src={project.image || "/images/fechat.png"}
                        alt={project.title}
                        fill
                        className="object-cover object-top group-hover:scale-102 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e18] via-[#0a0e18]/40 to-transparent" />

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md text-[11px] font-medium text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{project.status}</span>
                      </div>

                      {/* Category Icon Badge */}
                      <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 shadow-sm">
                        <IconComponent className="w-4 h-4 text-indigo-400" />
                      </div>
                    </div>
                  )}

                  {/* Content Container */}
                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-3.5">
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-mono text-indigo-400 font-medium tracking-normal">
                        {project.category}
                      </span>
                      {project.link ? (
                        <div className="mt-0.5 sm:mt-1">
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 group/link text-white hover:text-cyan-300 transition-colors"
                          >
                            <h3 className="text-lg sm:text-xl font-bold break-words">
                              {project.title}
                            </h3>
                            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover/link:text-cyan-300 transition-colors flex-shrink-0" />
                          </a>
                        </div>
                      ) : (
                        <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5 sm:mt-1 group-hover:text-slate-100 transition-colors break-words">
                          {project.title}
                        </h3>
                      )}
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {project.subtitle}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Features list */}
                    <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                      {project.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                          <Zap className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tech Stack Tags & Actions */}
                <div className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-3.5 sm:space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 text-[10px] sm:text-[11px] font-mono border border-white/[0.06]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer active:scale-[0.98] min-h-[42px]"
                      >
                        <span>Kunjungi Web</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <a
                      href="#gallery"
                      className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all group/btn cursor-pointer active:scale-[0.98] min-h-[42px] ${
                        project.link ? "sm:flex-1" : "w-full"
                      }`}
                    >
                      <span>{project.link ? "Dokumentasi" : "Tangkapan Layar & Dokumentasi"}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
