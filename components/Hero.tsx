"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Terminal,
  Server,
  Code2,
  Cpu,
  Layers,
  CheckCircle2,
  Activity,
  HardDrive,
  ShieldCheck,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Hero() {
  const { data } = usePortfolio();
  const { profile } = data;

  const quickBadges = [
    { icon: Code2, label: "Full Stack (Next.js & React)" },
    { icon: Server, label: "Ubuntu VPS & DevOps" },
    { icon: Cpu, label: "Docker & Pterodactyl" },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] pt-28 pb-16 sm:pt-36 sm:pb-24 flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Bio & Text */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-center lg:text-left">
            {/* Status & Academic Identity with Prominent Profile Photo */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-5"
            >
              {/* Square / Rounded Rectangle Profile Frame */}
              <div className="relative group flex-shrink-0">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-indigo-500/50 shadow-2xl bg-slate-900 transition-all duration-300">
                  <img
                    src="/images/profile.jpeg"
                    alt={profile.name}
                    className="w-full h-full object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                </div>
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/[0.08] shadow-sm backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                  <span className="text-xs font-medium text-slate-300">
                    Siswa Kelas {profile.grade} RPL • <span className="text-white font-semibold">{profile.school}</span>
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-400 font-medium">
                  <span className="text-emerald-400">● Tersedia untuk Proyek</span>
                  <span>•</span>
                  <span>Jakarta Timur</span>
                </div>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="space-y-3"
            >
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                {profile.name}
              </h1>
              <p className="text-base sm:text-xl font-medium text-slate-300">
                {profile.role} & <span className="text-white font-semibold">{profile.subRole}</span>
              </p>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed pt-1">
                {profile.bio}
              </p>
            </motion.div>

            {/* Core Capability Pills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="flex flex-wrap justify-center lg:justify-start gap-2 pt-1"
            >
              {quickBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-white/[0.06] text-slate-300 text-xs font-medium"
                >
                  <badge.icon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.24 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2"
            >
              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 shadow-sm transition-all duration-200 active:scale-[0.98] group cursor-pointer"
              >
                <span>Lihat Portofolio Proyek</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-white/20 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span>Hubungi Saya</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Architectural Engineering Telemetry Console */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Telemetry Console Card */}
              <div className="rounded-2xl bg-[#0b101c]/95 border border-white/[0.08] shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Console Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    infrastructure.cluster.telemetry
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] font-mono text-emerald-400 font-medium">LIVE</span>
                  </div>
                </div>

                {/* Console Body */}
                <div className="p-5 space-y-4">
                  {/* System Architecture Metrics */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05]">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                        <Server className="w-3 h-3 text-indigo-400" /> Host Environment
                      </div>
                      <div className="text-xs font-semibold text-white mt-1">Ubuntu 22.04 LTS</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">VPS Dedicated Node</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05]">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                        <Activity className="w-3 h-3 text-emerald-400" /> Server Uptime
                      </div>
                      <div className="text-xs font-semibold text-emerald-400 mt-1">99.9% Operational</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Automated Health Check</div>
                    </div>
                  </div>

                  {/* Active Platforms Status */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Layanan Digital Aktif</span>
                      <span>Status</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-white/[0.04]">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-xs font-semibold text-white">Fechat</span>
                          <span className="text-[10px] text-slate-400">Real-time Messaging</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Next.js / Node</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-white/[0.04]">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-xs font-semibold text-white">ARYANOKOS</span>
                          <span className="text-[10px] text-slate-400">Virtual Number & OTP</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">API Gateway</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-white/[0.04]">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-xs font-semibold text-white">ARYASHOP</span>
                          <span className="text-[10px] text-slate-400">Digital Credit & Top-Up</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">E-Commerce</span>
                      </div>
                    </div>
                  </div>

                  {/* Tech stack badge row */}
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Docker & Pterodactyl Ecosystem
                    </span>
                    <span className="font-mono text-slate-400">Prod v2.4</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
