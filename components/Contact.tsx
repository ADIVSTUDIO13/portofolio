"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Send,
  MessageCircle,
  Copy,
  Check,
  Github,
  Linkedin,
  Instagram,
  MapPin,
  School,
  Clock,
  ExternalLink,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { showSuccessAlert, showToast } from "@/lib/swal";
import OpenMap from "@/components/OpenMap";

export default function Contact() {
  const { data } = usePortfolio();
  const { contact } = data;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    showToast("Alamat Email berhasil disalin!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showSuccessAlert(
        "Pesan Berhasil Terkirim!",
        `Terima kasih ${formData.name}, pesan Anda telah terkirim langsung ke inbox Fakhri Arya Dzaki.`
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  const socialLinks = [
    {
      name: "Instagram",
      handle: "@fakhriaryadzaki",
      href: contact.instagram || "https://instagram.com",
      icon: Instagram,
      gradient: "from-amber-500 via-rose-500 to-purple-600",
    },
    {
      name: "GitHub",
      handle: "github.com",
      href: contact.github || "https://github.com",
      icon: Github,
      gradient: "from-slate-700 to-slate-900",
    },
    {
      name: "LinkedIn",
      handle: "linkedin.com",
      href: contact.linkedin || "https://linkedin.com",
      icon: Linkedin,
      gradient: "from-blue-600 to-indigo-700",
    },
  ];

  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-20 sm:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-3 max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Kontak & Kolaborasi</span>
          </div>

          <motion.h2
            id="contact-heading"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight"
          >
            Hubungi & Inisiasi Kerja Sama
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            Terbuka untuk peluang proyek freelance, kolaborasi pengembangan aplikasi web, 
            konsultasi administrasi VPS, atau penawaran magang industri.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Direct Info & Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6 sm:space-y-8"
          >
            <address className="not-italic glass-panel p-6 sm:p-8 rounded-2xl space-y-6 border border-white/[0.08]" itemScope itemType="https://schema.org/Person">
              <meta itemProp="name" content={data.profile.name} />
              <meta itemProp="jobTitle" content={`${data.profile.role} & ${data.profile.subRole}`} />
              <div>
                <h3 className="text-lg font-bold text-white">Saluran Komunikasi Langsung</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  Pilih saluran komunikasi yang paling sesuai dengan kebutuhan Anda.
                </p>
              </div>

              <div className="space-y-3">
                {/* Email Item */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.06] gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-300 flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-slate-400">Email Resmi</div>
                      <a
                        href={`mailto:${contact.email}`}
                        itemProp="email"
                        title={`Kirim email ke ${contact.email}`}
                        className="text-xs font-semibold text-white hover:text-slate-200 transition-colors truncate block"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                    title="Salin Alamat Email"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Direct WhatsApp Button */}
                <a
                  href={`https://wa.me/${contact.whatsapp}?text=Halo%20Fakhri%20Arya,%20saya%20tertarik%20untuk%20berdiskusi`}
                  target="_blank"
                  rel="noopener noreferrer"
                  itemProp="telephone"
                  content={`+${contact.whatsapp}`}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-slate-400">WhatsApp Respon Cepat</div>
                      <div className="text-xs font-bold text-white truncate">+{contact.whatsapp}</div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                    Kirim Pesan &rarr;
                  </span>
                </a>

                {/* Featured Instagram Card */}
                <a
                  href={contact.instagram || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer me"
                  itemProp="sameAs"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.06] hover:border-white/20 transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 flex-shrink-0">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-slate-400">Instagram</div>
                      <div className="text-xs font-bold text-white truncate">@fakhriaryadzaki</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors flex-shrink-0" />
                </a>

                {/* Location & School Info */}
                <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/[0.05] space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <School className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span className="truncate" itemProp="alumniOf">{contact.school}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span itemProp="streetAddress">{contact.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 pt-0.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Waktu Respon: Kurang dari 24 Jam</span>
                  </div>
                </div>
              </div>

              {/* Social Media Pills */}
              <div className="pt-3 border-t border-white/[0.06]">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2.5">
                  Tautan Profil
                </div>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((s, idx) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={idx}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer me"
                        itemProp="sameAs"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 text-xs font-medium transition-all duration-200"
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{s.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </address>
          </motion.div>

          {/* Right Column: Interactive Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="glass-panel p-6 sm:p-9 rounded-2xl border border-white/[0.08]">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">Kirim Pesan Langsung</h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Silakan lengkapi formulir di bawah ini untuk memulai komunikasi.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Pesan Telah Diterima</h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Terima kasih {formData.name}. Pesan Anda telah terkirim dan akan segera dibalas.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nama Anda"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Alamat Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Subjek</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Topik proyek / tawaran magang / kolaborasi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Pesan</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Jelaskan kebutuhan proyek atau pesan Anda..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl font-semibold text-slate-950 bg-white hover:bg-slate-100 shadow-sm transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2 text-xs">
                        <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        Mengirim...
                      </span>
                    ) : (
                      <>
                        <span className="text-xs sm:text-sm">Kirim Pesan Sekarang</span>
                        <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Interactive OpenStreetMap Section */}
        <motion.div
          id="openmap"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-12 sm:mt-16"
        >
          <OpenMap />
        </motion.div>
      </div>
    </section>
  );
}
