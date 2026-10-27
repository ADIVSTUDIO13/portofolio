"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export interface ProfileData {
  name: string;
  role: string;
  subRole: string;
  school: string;
  grade: string;
  major: string;
  bio: string;
  aboutDetail: string;
  status: string;
  vpsUptime: string;
  activeProjectsCount: string;
}

export interface SkillItem {
  name: string;
  category: "Frontend" | "Backend" | "DevOps & Server";
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  desc: string;
  highlight?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  image: string;
  tags: string[];
  features: string[];
  status: string;
  accentColor: string;
  link?: string;
}

// Generate a clean slug for project ID from title (e.g. "Fechat" -> "fechat", "ARYANOKOS" -> "aryanokos")
export function generateProjectSlug(title: string): string {
  if (!title) return "";
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  details: string[];
}

export interface ContactData {
  email: string;
  whatsapp: string;
  location: string;
  school: string;
  github: string;
  linkedin: string;
  instagram: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  skills?: string[];
  description?: string;
}

export interface MapConfig {
  latitude: number;
  longitude: number;
  zoom: number;
  title: string;
  subtitle: string;
  address: string;
  enabled: boolean;
  theme: "dark" | "osm";
  cartoApiKey?: string;
}

export interface PortfolioData {
  profile: ProfileData;
  skills: SkillItem[];
  projects: ProjectItem[];
  certificates: CertificateItem[];
  gallery: GalleryItem[];
  contact: ContactData;
  map?: MapConfig;
}

const defaultPortfolioData: PortfolioData = {
  profile: {
    name: "Fakhri Arya Dzaki",
    role: "Full Stack Developer",
    subRole: "Digital Service Administrator",
    school: "SMKN 71 Jakarta",
    grade: "11",
    major: "RPL (Rekayasa Perangkat Lunak)",
    bio: "Berfokus pada pengembangan aplikasi web performa tinggi, platform real-time, serta pengolahan server & infrastruktur cloud (VPS, Docker, MySQL, Pterodactyl Panels).",
    aboutDetail:
      "Saya adalah siswa kelas 11 jurusan Rekayasa Perangkat Lunak (RPL) di SMKN 71 Jakarta. Kombinasi passion di dunia pemrograman full stack dan administrasi server membuat saya mampu membangun platform dari nol hingga siap tayang di lingkungan produksi.",
    status: "Ready for Collaboration 🚀",
    vpsUptime: "99.9%",
    activeProjectsCount: "3+",
  },
  skills: [
    { name: "JavaScript (ES6+)", category: "Frontend", level: "Advanced", desc: "Syntax modern, Async/Await, ES Modules", highlight: true },
    { name: "React.js", category: "Frontend", level: "Advanced", desc: "Hooks, State Management, Custom Components", highlight: true },
    { name: "Next.js (App Router)", category: "Frontend", level: "Advanced", desc: "SSR, ISR, Metadata API, Server Components", highlight: true },
    { name: "Tailwind CSS", category: "Frontend", level: "Advanced", desc: "Utility-first design, Glassmorphism, Dark mode", highlight: true },
    { name: "HTML5 / CSS3", category: "Frontend", level: "Expert", desc: "Semantic Markup, Flexbox, CSS Grid, Animations" },
    { name: "Framer Motion", category: "Frontend", level: "Intermediate", desc: "Scroll Animations, Page Transitions, Stagger" },
    { name: "Node.js", category: "Backend", level: "Advanced", desc: "Express.js, Event Loop, Asynchronous IO", highlight: true },
    { name: "PHP", category: "Backend", level: "Advanced", desc: "Object Oriented Programming, MVC, Backend Logic", highlight: true },
    { name: "MySQL", category: "Backend", level: "Advanced", desc: "Database Schema, Complex Queries, Indexing", highlight: true },
    { name: "RESTful APIs", category: "Backend", level: "Advanced", desc: "API Architecture, Authentication, JSON Data" },
    { name: "Docker", category: "DevOps & Server", level: "Advanced", desc: "Containerization, Docker Compose, Port Mapping", highlight: true },
    { name: "Ubuntu Linux", category: "DevOps & Server", level: "Advanced", desc: "CLI, Systemd, Firewall Rules", highlight: true },
    { name: "Manajemen VPS", category: "DevOps & Server", level: "Advanced", desc: "Server Config, Firewall, DNS Domain, SSL", highlight: true },
    { name: "Pterodactyl Panels", category: "DevOps & Server", level: "Advanced", desc: "Game Server Management, Node allocation", highlight: true },
  ],
  projects: [
    {
      id: "fechat",
      title: "Fechat",
      category: "Real-time Messaging Platform",
      subtitle: "Aplikasi Chatting Real-Time Berkinerja Tinggi",
      description:
        "Fechat adalah platform aplikasi chatting real-time interaktif dengan antarmuka dark mode glassmorphism modern. Mendukung pengiriman pesan instan tanpa delay, indikator status online, serta pengelolaan kontak terintegrasi.",
      image: "/images/fechat.png",
      tags: ["Next.js", "React.js", "Node.js", "WebSockets", "Tailwind CSS", "Docker"],
      features: [
        "Real-time Instant Messaging via WebSockets",
        "Antarmuka Dark Glassmorphism Sleek & Clean",
        "Indikator Status Kehadiran Online/Offline",
        "Kontainerisasi Server dengan Docker",
      ],
      status: "Live & Active",
      accentColor: "from-indigo-500 to-cyan-500",
    },
    {
      id: "aryanokos",
      title: "ARYANOKOS",
      category: "Virtual Number & OTP Verification",
      subtitle: "Platform Nomor Virtual & Verifikasi OTP Otomatis",
      description:
        "ARYANOKOS menyediakan layanan nomor HP virtual temporer untuk penerimaan kode SMS OTP secara otomatis. Terhubung langsung dengan Provider API global dengan saldo akun & verifikasi instan.",
      image: "/images/aryanokos.png",
      tags: ["React.js", "PHP", "Node.js", "MySQL", "REST API", "VPS Ubuntu"],
      features: [
        "Penerimaan Kode SMS OTP Real-time",
        "Dukungan Ratusan Nomor dari Berbagai Negara",
        "Sistem Saldo & Log Transaksi Otomatis",
        "Infrastruktur Mandiri di VPS Ubuntu",
      ],
      status: "Production Ready",
      accentColor: "from-cyan-500 to-emerald-500",
    },
    {
      id: "aryashop",
      title: "ARYASHOP",
      category: "Game Top-Up & Digital Credit Platform",
      subtitle: "Platform Online Top-Up Game & Pulsa Digital",
      description:
        "ARYASHOP adalah platform ecommerce digital yang memudahkan pengguna melakukan top-up voucher game favorit (Mobile Legends, Free Fire, Valorant) dan pulsa/kredit digital dengan kalkulasi otomatis dan proses kilat.",
      image: "/images/aryashop.png",
      tags: ["Next.js", "PHP", "MySQL", "Tailwind CSS", "Payment API"],
      features: [
        "Katalog Produk Game & Pulsa Lengkap",
        "Integrasi Payment Gateway Otomatis",
        "Kecepatan Proses Checkout Hitungan Detik",
        "Desain Responsif Mobile-First",
      ],
      status: "Live & Active",
      accentColor: "from-violet-500 to-purple-500",
    },
  ],
  gallery: [
    {
      id: "fechat-ui",
      title: "Fechat - Antarmuka Chatting Real-Time",
      category: "Fechat",
      description:
        "Tampilan dashboard utama Fechat dengan arsitektur UI dark mode glassmorphism. Fitur daftar pesan aktif, status kehadiran pengguna real-time, dan pengiriman pesan cepat tanpa reload halaman.",
      image: "/images/fechat.png",
      tags: ["Next.js", "WebSockets", "Glassmorphism", "React"],
      details: [
        "Real-time WebSocket event connection",
        "Responsif di layar HP & Desktop",
        "Mode gelap elegan dengan aksen cyan & indigo",
        "Status aktif indikator presensi pengguna",
      ],
    },
    {
      id: "aryanokos-ui",
      title: "ARYANOKOS - Dashboard Nomor Virtual & OTP",
      category: "ARYANOKOS",
      description:
        "Dashboard utama ARYANOKOS untuk memantau sisa nomor virtual aktif, status verifikasi SMS OTP yang masuk secara otomatis, serta pemilihan negara & platform layanan.",
      image: "/images/aryanokos.png",
      tags: ["React.js", "PHP API", "Virtual OTP", "VPS Ubuntu"],
      details: [
        "Integrasi API SMS Provider otomatis",
        "Filter negara & platform fleksibel",
        "Log verifikasi OTP real-time",
        "Desain kontrol panel intuitif",
      ],
    },
    {
      id: "aryashop-ui",
      title: "ARYASHOP - Etalase Store Top-Up Game",
      category: "ARYASHOP",
      description:
        "Antarmuka katalog produk ARYASHOP yang menyajikan berbagai paket voucher game (MLBB, Free Fire, Valorant) dan layanan pulsa dengan perhitungan otomatis.",
      image: "/images/aryashop.png",
      tags: ["Next.js", "Payment Gateway", "Tailwind CSS", "Ecommerce"],
      details: [
        "Metode pembayaran instant QRIS & Transfer",
        "Notifikasi status pesanan otomatis",
        "Optimasi gambar & efisiensi render Next.js",
        "Layout card terstruktur rapi",
      ],
    },
    {
      id: "infrastructure-ui",
      title: "Server & DevOps Infrastructure Control Panel",
      category: "DevOps & Server",
      description:
        "Dokumentasi visual pengelolaan node server VPS Ubuntu, kontainerisasi Docker, basis data MySQL, dan panel Pterodactyl untuk memastikan layanan berjalan 24/7.",
      image: "/images/infrastructure.png",
      tags: ["Docker", "Ubuntu Linux", "Pterodactyl", "VPS Admin"],
      details: [
        "Monitoring penggunaan CPU & RAM server",
        "Alokasi resource kontainer Docker",
        "Pengelolaan node Pterodactyl Panels",
        "Sistem backup & pemulihan otomatis",
      ],
    },
    {
      id: "cyber-security-smkn71-org",
      title: "Cyber Security SMK Negeri 71 Jakarta",
      category: "Organisasi",
      description:
        "Identitas resmi organisasi dan ekstrakurikuler Cyber Security SMK Negeri 71 Jakarta. Komunitas yang berfokus pada pertahanan infrastruktur jaringan, server hardening Linux, mitigasi celah keamanan web, dan edukasi cybersecurity.",
      image: "/images/cyber-security-smkn71.jpeg",
      tags: ["Cyber Security", "SMKN 71", "Network Defense", "Linux Hardening", "Web Security"],
      details: [
        "Organisasi resmi Cyber Security SMKN 71 Jakarta",
        "Eksplorasi keamanan jaringan komputer dan sistem operasi Linux",
        "Penerapan firewall VPS & mitigasi celah keamanan web (OWASP)",
        "Kolaborasi tim dan simulasi kompetensi keamanan siber",
      ],
    },
  ],
  certificates: [
    {
      id: "cert_dicoding_webdev_0lz0jgojqx65",
      title: "Belajar Dasar Pemrograman Web",
      issuer: "Dicoding Indonesia",
      issueDate: "05 September 2026",
      credentialId: "0LZ0JGOJQX65",
      credentialUrl: "https://dicoding.com/certificates/0LZ0JGOJQX65",
      image: "https://dffphjdyrgztoqjwojtg.supabase.co/storage/v1/object/public/portfolio-assets/certificates/cert_1788596419962_ivq10.jpg",
      skills: ["HTML5", "CSS3", "JavaScript", "Web Development", "Responsive Web Design"],
      description: "Sertifikat kompetensi kelulusan kelas Belajar Dasar Pemrograman Web dari Dicoding Indonesia atas nama Fakhri Arya Dzaki.",
    },
  ],
  contact: {
    email: "fakhriaryadzaki@gmail.com",
    whatsapp: "6281234567890",
    location: "Jakarta Timur, DKI Jakarta, Indonesia",
    school: "SMKN 71 Jakarta • Kelas 11 RPL",
    github: "https://github.com/fakhriaryadzaki",
    linkedin: "https://linkedin.com/in/fakhriaryadzaki",
    instagram: "https://instagram.com/fakhriaryadzaki",
  },
  map: {
    latitude: -6.1866,
    longitude: 106.8708,
    zoom: 15,
    title: "SMKN 71 Jakarta",
    subtitle: "Rekayasa Perangkat Lunak (RPL) & Lab Server",
    address: "Jl. Rawasari Timur IX No.1, Cempaka Putih, Jakarta Pusat, DKI Jakarta 10570",
    enabled: true,
    theme: "dark",
  },
};

interface PortfolioContextType {
  data: PortfolioData;
  isSupabaseActive: boolean;
  updateProfile: (profile: Partial<ProfileData>) => Promise<void>;
  addProject: (project: ProjectItem) => Promise<void>;
  updateProject: (id: string, project: Partial<ProjectItem>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addSkill: (skill: SkillItem) => Promise<void>;
  deleteSkill: (name: string) => Promise<void>;
  addCertificate: (cert: CertificateItem) => Promise<void>;
  updateCertificate: (id: string, cert: Partial<CertificateItem>) => Promise<void>;
  deleteCertificate: (id: string) => Promise<void>;
  updateContact: (contact: Partial<ContactData>) => Promise<void>;
  updateMapConfig: (mapConfig: Partial<MapConfig>) => Promise<void>;
  resetToDefault: () => Promise<void>;
  syncWithSupabase: () => Promise<void>;
  reloadFromSupabase: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "myporto_dynamic_data_v2";

export function PortfolioProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: PortfolioData;
}) {
  const [data, setData] = useState<PortfolioData>(initialData || defaultPortfolioData);
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(isSupabaseConfigured);

  // Initial load from Supabase or localStorage on client side
  useEffect(() => {
    async function loadData() {
      let loadedData = initialData ? { ...initialData } : { ...defaultPortfolioData };
      let localCerts: CertificateItem[] = [];

      // 1. Try local storage first
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          let migrated = false;
          if (Array.isArray(parsed.certificates)) {
            parsed.certificates = parsed.certificates.map((c: CertificateItem) => {
              if (c.image && c.image.includes("zxptqkcceiwvsiggpozz.supabase.co")) {
                migrated = true;
                return {
                  ...c,
                  image: c.image.replace("zxptqkcceiwvsiggpozz.supabase.co", "dffphjdyrgztoqjwojtg.supabase.co"),
                };
              }
              return c;
            });
            if (migrated) {
              try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
              } catch (e) {}
            }
          }
          if (Array.isArray(parsed.certificates) && parsed.certificates.length > 0) {
            localCerts = parsed.certificates;
          }
          loadedData = {
            ...loadedData,
            ...parsed,
            certificates: localCerts.length > 0 ? localCerts : (Array.isArray(loadedData.certificates) && loadedData.certificates.length > 0 ? loadedData.certificates : defaultPortfolioData.certificates),
          };
        }
      } catch (e) {
        console.error("Failed loading from localStorage", e);
      }

      // 2. Fetch from Supabase if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const [profRes, skillsRes, projRes, contactRes, certRes] = await Promise.all([
            supabase.from("profiles").select("*").single(),
            supabase.from("skills").select("*"),
            supabase.from("projects").select("*"),
            supabase.from("contacts").select("*").single(),
            supabase.from("certificates").select("*"),
          ]);

          if (profRes.data) {
            loadedData.profile = {
              name: profRes.data.name || loadedData.profile.name,
              role: profRes.data.role || loadedData.profile.role,
              subRole: profRes.data.sub_role || loadedData.profile.subRole,
              school: profRes.data.school || loadedData.profile.school,
              grade: profRes.data.grade || loadedData.profile.grade,
              major: profRes.data.major || loadedData.profile.major,
              bio: profRes.data.bio || loadedData.profile.bio,
              aboutDetail: profRes.data.about_detail || loadedData.profile.aboutDetail,
              status: profRes.data.status || loadedData.profile.status,
              vpsUptime: profRes.data.vps_uptime || loadedData.profile.vpsUptime,
              activeProjectsCount: profRes.data.active_projects_count || loadedData.profile.activeProjectsCount,
            };
          }

          if (skillsRes.data && skillsRes.data.length > 0) {
            loadedData.skills = skillsRes.data.map((s: any) => ({
              name: s.name,
              category: s.category,
              level: s.level,
              desc: s.desc_text || "",
              highlight: Boolean(s.highlight),
            }));
          }

          if (projRes.data && projRes.data.length > 0) {
            loadedData.projects = projRes.data.map((p: any) => ({
              id: p.id,
              title: p.title,
              category: p.category,
              subtitle: p.subtitle || "",
              description: p.description || "",
              image: p.image || "/images/fechat.png",
              tags: Array.isArray(p.tags) ? p.tags : [],
              features: Array.isArray(p.features) ? p.features : [],
              status: p.status || "Live & Active",
              accentColor: p.accent_color || "from-indigo-500 to-cyan-500",
            }));

            // Dynamic gallery derived from dynamic projects
            const dynamicGallery: GalleryItem[] = projRes.data.map((p: any) => ({
              id: `gal_${p.id}`,
              title: `${p.title} - ${p.category}`,
              category: p.title,
              description: p.description || "",
              image: p.image || "/images/fechat.png",
              tags: Array.isArray(p.tags) ? p.tags : [],
              details: Array.isArray(p.features) ? p.features : [],
            }));

            loadedData.gallery = [...dynamicGallery, ...defaultPortfolioData.gallery.slice(3)];
          }

          if (contactRes.data) {
            loadedData.contact = {
              email: contactRes.data.email || loadedData.contact.email,
              whatsapp: contactRes.data.whatsapp || loadedData.contact.whatsapp,
              location: contactRes.data.location || loadedData.contact.location,
              school: contactRes.data.school || loadedData.contact.school,
              github: contactRes.data.github || loadedData.contact.github,
              linkedin: contactRes.data.linkedin || loadedData.contact.linkedin,
              instagram: contactRes.data.instagram || loadedData.contact.instagram,
            };

            if (contactRes.data.map_config) {
              try {
                const mc = typeof contactRes.data.map_config === "string"
                  ? JSON.parse(contactRes.data.map_config)
                  : contactRes.data.map_config;
                if (mc && typeof mc.latitude === "number") {
                  loadedData.map = { ...(defaultPortfolioData.map || {}), ...mc };
                }
              } catch (e) {}
            }
          }

          // Automatic cloud fallback: If map_config was not in contacts, fetch from admin_settings
          if (!loadedData.map) {
            try {
              const { data: adminMapData } = await supabase
                .from("admin_settings")
                .select("*")
                .eq("id", "map_config")
                .single();
              if (adminMapData && adminMapData.pin_hash) {
                const parsed = JSON.parse(adminMapData.pin_hash);
                if (parsed && typeof parsed.latitude === "number") {
                  loadedData.map = { ...(defaultPortfolioData.map || {}), ...parsed };
                }
              }
            } catch (e) {}
          }

          if (certRes && !certRes.error && Array.isArray(certRes.data)) {
            const mapped = certRes.data.map((c: any) => {
              let parsedSkills: string[] = [];
              if (Array.isArray(c.skills)) {
                parsedSkills = c.skills;
              } else if (typeof c.skills === "string") {
                try {
                  const parsed = JSON.parse(c.skills);
                  parsedSkills = Array.isArray(parsed) ? parsed : c.skills.split(",").map((s: string) => s.trim());
                } catch {
                  parsedSkills = c.skills.split(",").map((s: string) => s.trim());
                }
              }
              let img = c.image || "";
              if (img.includes("zxptqkcceiwvsiggpozz.supabase.co")) {
                img = img.replace("zxptqkcceiwvsiggpozz.supabase.co", "dffphjdyrgztoqjwojtg.supabase.co");
              }
              return {
                id: c.id,
                title: c.title,
                issuer: c.issuer,
                issueDate: c.issue_date || "",
                credentialId: c.credential_id || "",
                credentialUrl: c.credential_url || "",
                image: img,
                skills: parsedSkills,
                description: c.description || "",
              };
            });

            // Strict deduplication by ID to prevent inflated certificate counts
            const uniqueMap = new Map<string, CertificateItem>();
            mapped.forEach((item: CertificateItem) => uniqueMap.set(item.id, item));
            loadedData.certificates = Array.from(uniqueMap.values());
          } else if (localCerts.length > 0) {
            // Keep locally saved certificates deduplicated if Supabase returned error
            const uniqueMap = new Map<string, CertificateItem>();
            localCerts.forEach((item: CertificateItem) => uniqueMap.set(item.id, item));
            loadedData.certificates = Array.from(uniqueMap.values());
          } else {
            loadedData.certificates = defaultPortfolioData.certificates;
          }

          setIsSupabaseActive(true);
        } catch (err) {
          console.warn("Supabase load error, falling back to local data", err);
        }
      }

      // Ensure certificates array exists
      if (!Array.isArray(loadedData.certificates)) {
        loadedData.certificates = defaultPortfolioData.certificates;
      }

      setData(loadedData);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loadedData));
      } catch (e) {}
    }

    loadData();
  }, [initialData]);

  // Sync across tabs and events
  useEffect(() => {
    const handleStorageSync = () => {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.certificates)) {
            parsed.certificates = parsed.certificates.map((c: CertificateItem) => {
              if (c.image && c.image.includes("zxptqkcceiwvsiggpozz.supabase.co")) {
                return {
                  ...c,
                  image: c.image.replace("zxptqkcceiwvsiggpozz.supabase.co", "dffphjdyrgztoqjwojtg.supabase.co"),
                };
              }
              return c;
            });
          }
          setData((prev) => ({
            ...prev,
            ...parsed,
            certificates: Array.isArray(parsed.certificates) && parsed.certificates.length > 0 ? parsed.certificates : prev.certificates,
          }));
        }
      } catch (e) {}
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageSync);
      window.addEventListener("portfolio_data_updated", handleStorageSync);
      return () => {
        window.removeEventListener("storage", handleStorageSync);
        window.removeEventListener("portfolio_data_updated", handleStorageSync);
      };
    }
  }, []);

  const saveData = async (newData: PortfolioData) => {
    setData(newData);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("portfolio_data_updated"));
      }
    } catch (e) {
      console.error("Failed to save data to localStorage", e);
      try {
        // Fallback in case of quota overflow: strip huge data URLs if necessary
        const leanData = {
          ...newData,
          certificates: (newData.certificates || []).map((c) => ({
            ...c,
            image: c.image && c.image.length > 1000000 ? c.image.slice(0, 1000000) : c.image,
          })),
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leanData));
      } catch (innerErr) {
        console.error("Secondary fallback save to localStorage failed", innerErr);
      }
    }
  };

  const updateProfile = async (updatedProfile: Partial<ProfileData>) => {
    const updated = { ...data.profile, ...updatedProfile };
    const newData = { ...data, profile: updated };
    await saveData(newData);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("profiles").upsert({
          id: 1,
          name: updated.name,
          role: updated.role,
          sub_role: updated.subRole,
          school: updated.school,
          grade: updated.grade,
          major: updated.major,
          bio: updated.bio,
          about_detail: updated.aboutDetail,
          status: updated.status,
          vps_uptime: updated.vpsUptime,
          active_projects_count: updated.activeProjectsCount,
        });
      } catch (err) {
        console.error("Supabase profile update failed", err);
      }
    }
  };

  const addProject = async (project: ProjectItem) => {
    const finalId =
      project.id && !project.id.startsWith("proj_")
        ? generateProjectSlug(project.id) || project.id
        : (generateProjectSlug(project.title) || project.id || `project-${Date.now()}`);
    const normalizedProject: ProjectItem = { ...project, id: finalId };
    const newData = { ...data, projects: [normalizedProject, ...data.projects] };
    await saveData(newData);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("projects").upsert({
          id: normalizedProject.id,
          title: normalizedProject.title,
          category: normalizedProject.category,
          subtitle: normalizedProject.subtitle,
          description: normalizedProject.description,
          image: normalizedProject.image,
          tags: normalizedProject.tags,
          features: normalizedProject.features,
          status: normalizedProject.status,
          accent_color: normalizedProject.accentColor,
        });
      } catch (err) {
        console.error("Supabase project insert failed", err);
      }
    }
  };

  const updateProject = async (id: string, updatedProps: Partial<ProjectItem>) => {
    const updatedProjects = data.projects.map((p) =>
      p.id === id ? { ...p, ...updatedProps } : p
    );
    const newData = { ...data, projects: updatedProjects };
    await saveData(newData);

    if (isSupabaseConfigured && supabase) {
      const targetProj = updatedProjects.find((p) => p.id === id);
      if (targetProj) {
        try {
          await supabase.from("projects").upsert({
            id: targetProj.id,
            title: targetProj.title,
            category: targetProj.category,
            subtitle: targetProj.subtitle,
            description: targetProj.description,
            image: targetProj.image,
            tags: targetProj.tags,
            features: targetProj.features,
            status: targetProj.status,
            accent_color: targetProj.accentColor,
          });
        } catch (err) {
          console.error("Supabase project update failed", err);
        }
      }
    }
  };

  const deleteProject = async (id: string) => {
    const newData = { ...data, projects: data.projects.filter((p) => p.id !== id) };
    await saveData(newData);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("projects").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase project delete failed", err);
      }
    }
  };

  const addSkill = async (skill: SkillItem) => {
    const newData = { ...data, skills: [...data.skills, skill] };
    await saveData(newData);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("skills").upsert({
          name: skill.name,
          category: skill.category,
          level: skill.level,
          desc_text: skill.desc,
          highlight: skill.highlight || false,
        }, { onConflict: "name" });
      } catch (err) {
        console.error("Supabase skill insert failed", err);
      }
    }
  };

  const deleteSkill = async (name: string) => {
    const newData = { ...data, skills: data.skills.filter((s) => s.name !== name) };
    await saveData(newData);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("skills").delete().eq("name", name);
      } catch (err) {
        console.error("Supabase skill delete failed", err);
      }
    }
  };

  const updateContact = async (updatedContact: Partial<ContactData>) => {
    const updated = { ...data.contact, ...updatedContact };
    const newData = { ...data, contact: updated };
    await saveData(newData);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("contacts").upsert({
          id: 1,
          email: updated.email,
          whatsapp: updated.whatsapp,
          location: updated.location,
          school: updated.school,
          github: updated.github,
          linkedin: updated.linkedin,
          instagram: updated.instagram,
        });
      } catch (err) {
        console.error("Supabase contact update failed", err);
      }
    }
  };

  const updateMapConfig = async (updatedMap: Partial<MapConfig>) => {
    const currentMap = data.map || defaultPortfolioData.map!;
    const newMapConfig = { ...currentMap, ...updatedMap };
    const newData = { ...data, map: newMapConfig };
    await saveData(newData);

    if (isSupabaseConfigured && supabase) {
      // 1. Cloud auto-sync to admin_settings (always active and guaranteed in Supabase)
      try {
        await supabase.from("admin_settings").upsert({
          id: "map_config",
          pin_hash: JSON.stringify(newMapConfig),
        });
      } catch (err) {}

      // 2. Cloud sync to contacts table if map_config column exists
      try {
        const { error: contactErr } = await supabase.from("contacts").upsert({
          id: 1,
          email: data.contact.email,
          whatsapp: data.contact.whatsapp,
          location: data.contact.location,
          school: data.contact.school,
          github: data.contact.github,
          linkedin: data.contact.linkedin,
          instagram: data.contact.instagram,
          map_config: newMapConfig,
        });

        // Fallback jika kolom map_config belum dibuat di tabel contacts Supabase (PGRST204)
        if (contactErr && (contactErr.code === "PGRST204" || contactErr.message?.includes("map_config"))) {
          await supabase.from("contacts").upsert({
            id: 1,
            email: data.contact.email,
            whatsapp: data.contact.whatsapp,
            location: data.contact.location,
            school: data.contact.school,
            github: data.contact.github,
            linkedin: data.contact.linkedin,
            instagram: data.contact.instagram,
          });
        }
      } catch (err) {
        console.warn("Supabase contacts map_config column update skipped", err);
      }
    }
  };

  const addCertificate = async (cert: CertificateItem) => {
    const currentCerts = Array.isArray(data.certificates) ? data.certificates : [];
    const exists = currentCerts.some((c) => c.id === cert.id);
    const updatedCerts = exists
      ? currentCerts.map((c) => (c.id === cert.id ? cert : c))
      : [cert, ...currentCerts];
    const newData = { ...data, certificates: updatedCerts };
    await saveData(newData);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("certificates").upsert({
          id: cert.id,
          title: cert.title,
          issuer: cert.issuer,
          issue_date: cert.issueDate,
          credential_id: cert.credentialId || null,
          credential_url: cert.credentialUrl || null,
          image: cert.image || null,
          skills: cert.skills || [],
          description: cert.description || null,
        });
      } catch (err) {
        console.error("Supabase certificate insert failed", err);
      }
    }
  };

  const updateCertificate = async (id: string, updatedProps: Partial<CertificateItem>) => {
    const currentCerts = Array.isArray(data.certificates) ? data.certificates : [];
    const updatedCertificates = currentCerts.map((c) =>
      c.id === id ? { ...c, ...updatedProps } : c
    );
    const newData = { ...data, certificates: updatedCertificates };
    await saveData(newData);

    if (isSupabaseConfigured && supabase) {
      const targetCert = updatedCertificates.find((c) => c.id === id);
      if (targetCert) {
        try {
          await supabase.from("certificates").upsert({
            id: targetCert.id,
            title: targetCert.title,
            issuer: targetCert.issuer,
            issue_date: targetCert.issueDate,
            credential_id: targetCert.credentialId || null,
            credential_url: targetCert.credentialUrl || null,
            image: targetCert.image || null,
            skills: targetCert.skills || [],
            description: targetCert.description || null,
          });
        } catch (err) {
          console.error("Supabase certificate update failed", err);
        }
      }
    }
  };

  const deleteCertificate = async (id: string) => {
    const currentCerts = Array.isArray(data.certificates) ? data.certificates : [];
    const newData = {
      ...data,
      certificates: currentCerts.filter((c) => c.id !== id),
    };
    await saveData(newData);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("certificates").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase certificate delete failed", err);
      }
    }
  };

  const resetToDefault = async () => {
    await saveData(defaultPortfolioData);
  };

  const reloadFromSupabase = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const [profRes, skillsRes, projRes, contactRes, certRes] = await Promise.all([
        supabase.from("profiles").select("*").single(),
        supabase.from("skills").select("*"),
        supabase.from("projects").select("*"),
        supabase.from("contacts").select("*").single(),
        supabase.from("certificates").select("*"),
      ]);

      const refreshed: PortfolioData = { ...data };

      if (profRes.data) {
        refreshed.profile = {
          name: profRes.data.name || refreshed.profile.name,
          role: profRes.data.role || refreshed.profile.role,
          subRole: profRes.data.sub_role || refreshed.profile.subRole,
          school: profRes.data.school || refreshed.profile.school,
          grade: profRes.data.grade || refreshed.profile.grade,
          major: profRes.data.major || refreshed.profile.major,
          bio: profRes.data.bio || refreshed.profile.bio,
          aboutDetail: profRes.data.about_detail || refreshed.profile.aboutDetail,
          status: profRes.data.status || refreshed.profile.status,
          vpsUptime: profRes.data.vps_uptime || refreshed.profile.vpsUptime,
          activeProjectsCount: profRes.data.active_projects_count || refreshed.profile.activeProjectsCount,
        };
      }

      if (skillsRes.data && skillsRes.data.length > 0) {
        const uniqueSkills = new Map<string, SkillItem>();
        skillsRes.data.forEach((s: any) =>
          uniqueSkills.set(s.name, {
            name: s.name,
            category: s.category,
            level: s.level,
            desc: s.desc_text || "",
            highlight: Boolean(s.highlight),
          })
        );
        refreshed.skills = Array.from(uniqueSkills.values());
      }

      if (projRes.data && projRes.data.length > 0) {
        const uniqueProjs = new Map<string, ProjectItem>();
        projRes.data.forEach((p: any) =>
          uniqueProjs.set(p.id, {
            id: p.id,
            title: p.title,
            category: p.category,
            subtitle: p.subtitle || "",
            description: p.description || "",
            image: p.image || "/images/fechat.png",
            tags: Array.isArray(p.tags) ? p.tags : [],
            features: Array.isArray(p.features) ? p.features : [],
            status: p.status || "Live & Active",
            accentColor: p.accent_color || "from-indigo-500 to-cyan-500",
          })
        );
        refreshed.projects = Array.from(uniqueProjs.values());
      }

      if (contactRes.data) {
        refreshed.contact = {
          email: contactRes.data.email || refreshed.contact.email,
          whatsapp: contactRes.data.whatsapp || refreshed.contact.whatsapp,
          location: contactRes.data.location || refreshed.contact.location,
          school: contactRes.data.school || refreshed.contact.school,
          github: contactRes.data.github || refreshed.contact.github,
          linkedin: contactRes.data.linkedin || refreshed.contact.linkedin,
          instagram: contactRes.data.instagram || refreshed.contact.instagram,
        };
      }

      if (certRes && !certRes.error && Array.isArray(certRes.data)) {
        const uniqueCerts = new Map<string, CertificateItem>();
        certRes.data.forEach((c: any) => {
          let parsedSkills: string[] = [];
          if (Array.isArray(c.skills)) parsedSkills = c.skills;
          else if (typeof c.skills === "string") {
            try {
              const parsed = JSON.parse(c.skills);
              parsedSkills = Array.isArray(parsed) ? parsed : c.skills.split(",").map((s: string) => s.trim());
            } catch {
              parsedSkills = c.skills.split(",").map((s: string) => s.trim());
            }
          }
          let img = c.image || "";
          if (img.includes("zxptqkcceiwvsiggpozz.supabase.co")) {
            img = img.replace("zxptqkcceiwvsiggpozz.supabase.co", "dffphjdyrgztoqjwojtg.supabase.co");
          }
          uniqueCerts.set(c.id, {
            id: c.id,
            title: c.title,
            issuer: c.issuer,
            issueDate: c.issue_date || "",
            credentialId: c.credential_id || "",
            credentialUrl: c.credential_url || "",
            image: img,
            skills: parsedSkills,
            description: c.description || "",
          });
        });
        refreshed.certificates = Array.from(uniqueCerts.values());
      }

      await saveData(refreshed);
    } catch (err) {
      console.error("reloadFromSupabase error:", err);
    }
  };

  const syncWithSupabase = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await updateProfile(data.profile);
      await updateContact(data.contact);
      for (const proj of data.projects) {
        await supabase.from("projects").upsert({
          id: proj.id,
          title: proj.title,
          category: proj.category,
          subtitle: proj.subtitle,
          description: proj.description,
          image: proj.image,
          tags: proj.tags,
          features: proj.features,
          status: proj.status,
          accent_color: proj.accentColor,
        });
      }
      for (const skill of data.skills) {
        await supabase.from("skills").upsert({
          name: skill.name,
          category: skill.category,
          level: skill.level,
          desc_text: skill.desc,
          highlight: skill.highlight || false,
        }, { onConflict: "name" });
      }
      if (Array.isArray(data.certificates)) {
        for (const cert of data.certificates) {
          await supabase.from("certificates").upsert({
            id: cert.id,
            title: cert.title,
            issuer: cert.issuer,
            issue_date: cert.issueDate,
            credential_id: cert.credentialId || null,
            credential_url: cert.credentialUrl || null,
            image: cert.image || null,
            skills: cert.skills || [],
            description: cert.description || null,
          });
        }
      }
      await reloadFromSupabase();
    } catch (e) {
      console.error("Failed full sync with Supabase", e);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isSupabaseActive,
        updateProfile,
        addProject,
        updateProject,
        deleteProject,
        addSkill,
        deleteSkill,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        updateContact,
        updateMapConfig,
        resetToDefault,
        syncWithSupabase,
        reloadFromSupabase,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
