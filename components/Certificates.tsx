"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  X,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { usePortfolio, CertificateItem } from "@/context/PortfolioContext";
import ImageViewer from "@/components/ImageViewer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const getSafeImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.includes("zxptqkcceiwvsiggpozz.supabase.co")) {
    return url.replace("zxptqkcceiwvsiggpozz.supabase.co", "dffphjdyrgztoqjwojtg.supabase.co");
  }
  return url;
};

export default function Certificates() {
  const { data } = usePortfolio();
  const certificates = Array.isArray(data.certificates) ? data.certificates : [];

  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const handleOpenCert = (cert: CertificateItem) => {
    setSelectedCert(cert);
  };

  const handleCloseCert = () => {
    setSelectedCert(null);
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedCert) {
        setSelectedCert(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCert]);

  return (
    <section id="certificates" aria-labelledby="certificates-heading" className="py-20 sm:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-3 max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Kredensial & Validasi</span>
          </div>

          <motion.h2
            id="certificates-heading"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight"
          >
            Sertifikasi & Lisensi Kompetensi
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            Dokumentasi pencapaian, pelatihan teknologi, dan sertifikasi resmi yang telah diselesaikan
            untuk memvalidasi kompetensi di bidang rekayasa perangkat lunak dan sistem digital.
          </motion.p>
        </div>

        {/* Conditional Content: Empty State vs Certificates Grid */}
        {certificates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto rounded-2xl p-8 sm:p-12 glass-panel border border-white/[0.08] text-center space-y-5"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 mx-auto flex items-center justify-center">
              <Award className="w-6 h-6 text-indigo-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">
                Kurasi Dokumen Sertifikasi
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Dokumentasi lisensi kompetensi sedang disiapkan dan diverifikasi untuk penayangan publik.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center">
              <a
                href="#skills"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 border border-white/10 hover:border-white/20 transition-colors"
              >
                <span>Lihat Keahlian Teknis</span>
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
          >
            {certificates.map((cert) => (
              <motion.article
                key={cert.id}
                variants={itemVariants}
                itemScope
                itemType="https://schema.org/EducationalOccupationalCredential"
                className="glass-panel rounded-2xl overflow-hidden glass-panel-hover flex flex-col justify-between group border border-white/[0.08]"
              >
                <div>
                  {/* Thumbnail / Header Graphic */}
                  {cert.image ? (
                    <div
                      onClick={() => handleOpenCert(cert)}
                      className="relative h-48 w-full overflow-hidden bg-slate-950 cursor-pointer group/img"
                    >
                      <img
                        src={getSafeImageUrl(cert.image)}
                        alt={`Sertifikat ${cert.title} dari ${cert.issuer} - Fakhri Arya Dzaki`}
                        itemProp="image"
                        className="w-full h-full object-cover object-center group-hover/img:scale-102 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e18] via-[#0a0e18]/40 to-transparent" />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/img:opacity-100 backdrop-blur-[2px] transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-medium flex items-center gap-1.5 shadow-sm">
                          <FileText className="w-3.5 h-3.5 text-indigo-400" /> Pratinjau Dokumen
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 w-full bg-slate-900/80 p-5 flex items-center justify-between border-b border-white/[0.06]">
                      <div className="space-y-1">
                        <span className="text-[11px] font-mono text-indigo-400 font-medium flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
                        </span>
                        <div className="text-sm font-bold text-white line-clamp-1">{cert.issuer}</div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center">
                        <Award className="w-5 h-5 text-indigo-400" />
                      </div>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-6 space-y-3.5">
                    {/* Issuer & Date Badges */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span
                        itemProp="recognizedBy"
                        itemScope
                        itemType="https://schema.org/Organization"
                        className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/10 text-slate-300 text-[11px] font-medium"
                      >
                        <span itemProp="name">{cert.issuer}</span>
                      </span>
                      {cert.issueDate && (
                        <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                          <Calendar className="w-3 h-3 text-slate-500" /> {cert.issueDate}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      itemProp="name"
                      className="text-base font-bold text-white group-hover:text-slate-100 transition-colors line-clamp-2"
                    >
                      {cert.title}
                    </h3>

                    {/* Description */}
                    {cert.description && (
                      <p itemProp="description" className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {cert.description}
                      </p>
                    )}

                    {/* Credential ID */}
                    {cert.credentialId && (
                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/[0.05] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="text-[11px] font-mono text-slate-400 truncate">
                          ID: <span itemProp="identifier" className="text-slate-200">{cert.credentialId}</span>
                        </span>
                      </div>
                    )}

                    {/* Skills Tags */}
                    {(() => {
                      const skillsList = Array.isArray(cert.skills)
                        ? cert.skills
                        : typeof cert.skills === "string"
                        ? (cert.skills as string).split(",").map((s) => s.trim()).filter(Boolean)
                        : [];
                      if (skillsList.length === 0) return null;
                      return (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {skillsList.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 text-[10px] font-mono border border-white/[0.05]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 pt-0 space-y-2">
                  <div className="flex items-center gap-2">
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        itemProp="url"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <span>Verifikasi Kredensial</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    )}
                    {cert.image && (
                      <button
                        onClick={() => handleOpenCert(cert)}
                        className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
                        title="Lihat & Perbesar Dokumen"
                      >
                        <FileText className="w-4 h-4 text-indigo-400" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox / Full-View Modal with Modern ImageViewer */}
      <AnimatePresence>
        {selectedCert && (
          <div
            onClick={handleCloseCert}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0b101c] border border-white/10 shadow-2xl p-5 sm:p-7 space-y-4 sm:space-y-5 relative"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseCert}
                className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer z-20 active:scale-95"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5 pr-12">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/10 text-slate-300 text-xs font-medium">
                  {selectedCert.issuer}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{selectedCert.title}</h3>
                {selectedCert.issueDate && (
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> Terbit: {selectedCert.issueDate}
                  </p>
                )}
              </div>

              {/* Certificate Image View with Modern Zoom & Pan */}
              {selectedCert.image && (
                <div className="space-y-2">
                  <ImageViewer
                    src={getSafeImageUrl(selectedCert.image)}
                    alt={`Sertifikat ${selectedCert.title} - ${selectedCert.issuer}`}
                    originalUrl={getSafeImageUrl(selectedCert.image)}
                    heightClassName="h-60 sm:h-[420px] md:h-[480px]"
                  />
                </div>
              )}

              {/* Certificate Details */}
              {selectedCert.description && (
                <div className="space-y-1 pt-1">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Deskripsi Kompetensi
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {selectedCert.description}
                  </p>
                </div>
              )}

              {selectedCert.credentialId && (
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400">ID / Nomor Kredensial:</span>
                  <span className="font-mono text-slate-200 font-semibold">{selectedCert.credentialId}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={handleCloseCert}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
                >
                  Tutup
                </button>
                {selectedCert.credentialUrl && (
                  <a
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-white hover:bg-slate-100 transition-all shadow-sm cursor-pointer active:scale-95 text-center"
                  >
                    <span>Verifikasi di Situs Resmi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
