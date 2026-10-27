"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Server,
  Code,
  Globe,
  Database,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function About() {
  const { data } = usePortfolio();
  const { profile } = data;

  const highlights = [
    {
      icon: GraduationCap,
      title: "Pendidikan & Akademik",
      description: `Siswa aktif Kelas ${profile.grade} di ${profile.school}, menekuni kompetensi Rekayasa Perangkat Lunak (RPL).`,
    },
    {
      icon: Code,
      title: "Full Stack Development",
      description: "Membangun aplikasi web interaktif berskala produksi menggunakan Next.js, React, Node.js, dan RESTful API.",
    },
    {
      icon: Server,
      title: "Administrasi Sistem & VPS",
      description: "Mengonfigurasi server Linux Ubuntu, orkestrasi kontainer Docker, manajemen panel Pterodactyl, dan basis data MySQL.",
    },
  ];

  const stats = [
    { label: "Platform Aktif", value: `${data.projects.length}+`, detail: "Fechat, ARYANOKOS, ARYASHOP" },
    { label: "Keandalan VPS", value: profile.vpsUptime || "99.9%", detail: "Ubuntu & Docker Ecosystem" },
    { label: "Konsentrasi", value: "RPL", detail: `${profile.school} (Kelas ${profile.grade})` },
  ];

  return (
    <section id="about" aria-labelledby="about-heading" className="py-20 sm:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-3 max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Profil & Latar Belakang</span>
          </div>

          <motion.h2
            id="about-heading"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight"
          >
            Fokus Rekayasa Perangkat Lunak & Tata Kelola Sistem
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            {profile.aboutDetail}
          </motion.p>
        </div>

        {/* Highlights Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-14">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="glass-panel glass-panel-hover p-6 sm:p-7 rounded-2xl relative group overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center mb-5 group-hover:border-indigo-500/40 transition-colors">
                <item.icon className="w-5 h-5 text-indigo-400" />
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-slate-100 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Deep Dive Box, Profile Showcase & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-6 sm:p-9 rounded-2xl border border-white/[0.08]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Profile Photo Identity Card */}
            <div className="lg:col-span-4">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/70 p-3.5 shadow-xl group">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
                  <img
                    src="/images/profile.jpeg"
                    alt={profile.name}
                    className="w-full h-full object-cover object-[center_28%] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/15 text-[10px] font-medium text-slate-200 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Aktif & Siap Kolaborasi
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                    <div>
                      <div className="font-bold text-xs sm:text-sm">{profile.name}</div>
                      <div className="text-[10px] text-slate-300 font-mono">Kelas {profile.grade} RPL</div>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-500/30">
                      SMKN 71
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                    Rekayasa Perangkat Lunak
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Jakarta Timur</span>
                </div>
              </div>
            </div>

            {/* Experience Detail */}
            <div className="lg:col-span-5 space-y-3.5">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                Pengalaman Manajerial Platform Digital
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Selain menempuh pendidikan di {profile.school}, saya secara mandiri merancang, membangun, 
                dan mengoperasikan platform digital aktif seperti Fechat, ARYANOKOS, dan ARYASHOP.
              </p>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Ruang lingkup tanggung jawab mencakup siklus pengembangan penuh: antarmuka web modern, 
                integrasi API, basis data MySQL, orkestrasi kontainer Docker, hingga administrasi node Pterodactyl dan server VPS Linux Ubuntu.
              </p>
            </div>

            {/* Key Statistics */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.06] flex flex-col justify-center"
                >
                  <div className="text-2xl font-bold text-white font-mono">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-slate-300 mt-1">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {stat.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Organization Showcase: Cyber Security SMKN 71 Jakarta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-slate-950/90 via-[#061527] to-slate-950/90 relative overflow-hidden group shadow-2xl"
        >
          {/* Ambient lighting glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Logo Badge Container */}
            <div className="md:col-span-3 lg:col-span-3 flex justify-center md:justify-start">
              <div className="relative p-2 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl group-hover:scale-105 group-hover:border-cyan-400 transition-all duration-300">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-[#041527] flex items-center justify-center p-1">
                  <img
                    src="/images/cyber-security-smkn71.jpeg"
                    alt="Cyber Security SMK Negeri 71 Jakarta"
                    className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,180,216,0.35)]"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 font-mono shadow-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  ORGANISASI
                </div>
              </div>
            </div>

            {/* Organization Info */}
            <div className="md:col-span-9 lg:col-span-9 space-y-3 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Organisasi & Ekstrakurikuler Resmi
                </span>
                <span className="text-[11px] text-slate-400 font-mono bg-slate-900/80 px-2.5 py-1 rounded-full border border-white/10">
                  SMKN 71 Jakarta
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
                  <span>Cyber Security SMK Negeri 71 Jakarta</span>
                </h3>
                <p className="text-xs sm:text-sm text-cyan-400 font-medium mt-0.5">
                  Anggota Aktif & Divisi Keamanan Sistem Jaringan
                </p>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                Aktif terlibat dalam komunitas riset dan pengembangan keamanan siber (Cyber Security) di SMKN 71 Jakarta. Mempelajari dan mempraktikkan fundamental pertahanan jaringan, server hardening Linux, analisis potensi celah kerentanan aplikasi web, proteksi firewall, serta etika cyber security.
              </p>

              {/* Badges / Focus Skills */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                {[
                  "Network Defense & Firewall",
                  "Linux VPS Hardening",
                  "Web Application Security",
                  "Vulnerability Assessment",
                  "CTF & Security Research",
                ].map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
