"use client";

import { Terminal, ArrowUp, ShieldCheck, Instagram, Github, Linkedin } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Footer() {
  const { data } = usePortfolio();
  const { contact } = data;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { name: "Instagram", href: contact.instagram || "https://instagram.com", icon: Instagram },
    { name: "GitHub", href: contact.github || "https://github.com", icon: Github },
    { name: "LinkedIn", href: contact.linkedin || "https://linkedin.com", icon: Linkedin },
  ];

  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-[#070a12] pt-14 pb-10 sm:pt-20 sm:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 pb-10 sm:pb-14 border-b border-white/[0.06]">
          {/* Brand Column & Social Icons */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-sm">
                <Terminal className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Fakhri Arya Dzaki
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Full Stack Developer & Digital Infrastructure Admin. Siswa Rekayasa Perangkat Lunak 
              di SMKN 71 Jakarta yang mengembangkan dan mengoperasikan platform digital mandiri.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Node Cluster Operational</span>
              </div>
              <div className="flex items-center gap-2">
                {socialLinks.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={idx}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                      aria-label={s.name}
                      title={`Visit ${s.name}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Navigasi Halaman
            </h4>
            <nav aria-label="Navigasi Cepat Footer" itemScope itemType="https://schema.org/SiteNavigationElement">
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                <li>
                  <a href="#hero" itemProp="url" title="Beranda" className="hover:text-white transition-colors">
                    <span itemProp="name">Beranda</span>
                  </a>
                </li>
                <li>
                  <a href="#about" itemProp="url" title="Profil & Akademik" className="hover:text-white transition-colors">
                    <span itemProp="name">Profil & Akademik</span>
                  </a>
                </li>
                <li>
                  <a href="#skills" itemProp="url" title="Keahlian & Teknologi" className="hover:text-white transition-colors">
                    <span itemProp="name">Keahlian & Teknologi</span>
                  </a>
                </li>
                <li>
                  <a href="#projects" itemProp="url" title="Portofolio Proyek" className="hover:text-white transition-colors">
                    <span itemProp="name">Portofolio Proyek</span>
                  </a>
                </li>
                <li>
                  <a href="#certificates" itemProp="url" title="Sertifikasi & Kredensial" className="hover:text-white transition-colors">
                    <span itemProp="name">Sertifikasi & Kredensial</span>
                  </a>
                </li>
                <li>
                  <a href="#gallery" itemProp="url" title="Dokumentasi Visual" className="hover:text-white transition-colors">
                    <span itemProp="name">Dokumentasi Visual</span>
                  </a>
                </li>
                <li>
                  <a href="#contact" itemProp="url" title="Kontak & Diskusi" className="hover:text-white transition-colors">
                    <span itemProp="name">Kontak & Diskusi</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Featured Platforms Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Platform yang Dikelola
            </h4>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05] flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Fechat</span>
                <span className="text-slate-400">Real-time Messaging Platform</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05] flex items-center justify-between text-xs">
                <span className="font-semibold text-white">ARYANOKOS</span>
                <span className="text-slate-400">Virtual Number & OTP Gateway</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05] flex items-center justify-between text-xs">
                <span className="font-semibold text-white">ARYASHOP</span>
                <span className="text-slate-400">Digital Credit & Game Top-Up</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & back to top */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
          <div>
            &copy; {new Date().getFullYear()} Fakhri Arya Dzaki. Seluruh hak cipta dilindungi.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
