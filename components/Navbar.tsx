"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Menu, X, ArrowUpRight, Code } from "lucide-react";

const navLinks = [
  { name: "Beranda", href: "#hero" },
  { name: "Tentang", href: "#about" },
  { name: "Keahlian", href: "#skills" },
  { name: "Proyek", href: "#projects" },
  { name: "Sertifikat", href: "#certificates" },
  { name: "Galeri", href: "#gallery" },
  { name: "Kontak", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navLinks.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-[#080c14]/85 backdrop-blur-xl border-b border-white/[0.06] shadow-md shadow-black/30"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/15 group-hover:border-indigo-500/50 transition-colors shadow-sm relative flex-shrink-0">
              <img
                src="/images/profile.jpeg"
                alt="Fakhri Arya Dzaki"
                className="w-full h-full object-cover object-[center_30%]"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                Fakhri Arya Dzaki
              </span>
              <span className="text-[10px] text-slate-400 tracking-normal flex items-center gap-1">
                <Code className="w-2.5 h-2.5 text-slate-400 inline" /> RPL SMKN 71 Jakarta
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav
            aria-label="Navigasi Utama Portofolio"
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
            className="hidden md:flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/[0.06] shadow-sm"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  itemProp="url"
                  title={`Buka bagian ${link.name}`}
                  className={`relative px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBg"
                      className="absolute inset-0 bg-white/[0.09] border border-white/[0.1] rounded-full -z-10 shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span itemProp="name">{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Actions: Contact CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#contact"
              className="relative group overflow-hidden px-4 py-2 rounded-full font-medium text-xs text-white bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-white/20 transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center gap-1.5"
            >
              <span>Hubungi Saya</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden bg-[#090d18]/98 border-b border-white/[0.08] backdrop-blur-2xl overflow-hidden shadow-2xl"
          >
            <div className="px-4 pt-3 pb-6 space-y-1 max-h-[calc(100vh-80px)] overflow-y-auto">
              <nav
                aria-label="Navigasi Menu Mobile"
                itemScope
                itemType="https://schema.org/SiteNavigationElement"
                className="space-y-1"
              >
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      itemProp="url"
                      title={`Buka bagian ${link.name}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-white/[0.08] text-white font-semibold border border-white/10"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                      }`}
                    >
                      <span itemProp="name">{link.name}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                    </a>
                  );
                })}
              </nav>
              <div className="pt-3">
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 shadow-sm active:scale-[0.98] transition-transform"
                >
                  <span>Hubungi Saya</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
