"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Server,
  Cpu,
  Database,
  CheckCircle2,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Skills() {
  const { data } = usePortfolio();
  const [activeTab, setActiveTab] = useState("all");

  const categories = [
    {
      id: "Frontend",
      title: "Frontend Development",
      icon: Code2,
      description: "Membangun antarmuka interaktif, responsif, dan kaya animasi.",
    },
    {
      id: "Backend",
      title: "Backend & Database",
      icon: Database,
      description: "Merancang logika bisnis server, API RESTful, dan manajemen basis data.",
    },
    {
      id: "DevOps & Server",
      title: "Server & Infrastructure",
      icon: Server,
      description: "Administrasi VPS, kontainerisasi Docker, dan manajemen panel server.",
    },
  ];

  const filteredSkills =
    activeTab === "all"
      ? data.skills
      : data.skills.filter((s) => s.category === activeTab);

  return (
    <section id="skills" aria-labelledby="skills-heading" className="py-20 sm:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-3 max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Keahlian & Teknologi</span>
          </div>

          <motion.h2
            id="skills-heading"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight"
          >
            Keahlian Teknis & Alat Pengembangan
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            Teknologi dan kerangka kerja yang saya gunakan secara aktif untuk membangun aplikasi web 
            serta memelihara keandalan infrastruktur server produksi.
          </motion.p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 sm:mb-12">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-slate-950 font-semibold shadow-sm"
                : "bg-slate-900/80 border border-white/[0.06] text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            Semua ({data.skills.length})
          </button>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            const count = data.skills.filter((s) => s.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white text-slate-950 font-semibold shadow-sm"
                    : "bg-slate-900/80 border border-white/[0.06] text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.title} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredSkills.map((skill, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
              className="glass-panel p-5 sm:p-6 rounded-2xl glass-panel-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>{skill.name}</span>
                  </h3>
                  <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-white/10 text-slate-300">
                    {skill.level}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{skill.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{skill.category}</span>
                {skill.highlight && <span className="text-amber-400 font-medium">★ Core Skill</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
