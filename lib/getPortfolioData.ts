import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { PortfolioData, ProfileData, SkillItem, ProjectItem, GalleryItem, ContactData } from "@/context/PortfolioContext";

const defaultProfile: ProfileData = {
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
};

const defaultSkills: SkillItem[] = [
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
];

const defaultProjects: ProjectItem[] = [
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
];

const defaultGallery: GalleryItem[] = [
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
];

const defaultContact: ContactData = {
  email: "fakhriaryadzaki@gmail.com",
  whatsapp: "6281234567890",
  location: "DKI Jakarta, Indonesia",
  school: "SMKN 71 Jakarta • Kelas 11 RPL",
  github: "https://github.com/fakhriaryadzaki",
  linkedin: "https://linkedin.com/in/fakhriaryadzaki",
  instagram: "https://instagram.com/fakhriaryadzaki",
};

const defaultCertificates = [
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
];

export const defaultPortfolioData: PortfolioData = {
  profile: defaultProfile,
  skills: defaultSkills,
  projects: defaultProjects,
  certificates: defaultCertificates,
  gallery: defaultGallery,
  contact: defaultContact,
};

export async function getSupabaseFullPortfolioData(): Promise<PortfolioData> {
  const result: PortfolioData = { ...defaultPortfolioData };

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
        result.profile = {
          name: profRes.data.name || result.profile.name,
          role: profRes.data.role || result.profile.role,
          subRole: profRes.data.sub_role || result.profile.subRole,
          school: profRes.data.school || result.profile.school,
          grade: profRes.data.grade || result.profile.grade,
          major: profRes.data.major || result.profile.major,
          bio: profRes.data.bio || result.profile.bio,
          aboutDetail: profRes.data.about_detail || result.profile.aboutDetail,
          status: profRes.data.status || result.profile.status,
          vpsUptime: profRes.data.vps_uptime || result.profile.vpsUptime,
          activeProjectsCount: profRes.data.active_projects_count || result.profile.activeProjectsCount,
        };
      }

      if (skillsRes.data && skillsRes.data.length > 0) {
        result.skills = skillsRes.data.map((s: any) => ({
          name: s.name,
          category: s.category,
          level: s.level,
          desc: s.desc_text || "",
          highlight: Boolean(s.highlight),
        }));
      }

      if (projRes.data && projRes.data.length > 0) {
        result.projects = projRes.data.map((p: any) => ({
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

        result.gallery = [...dynamicGallery, ...defaultGallery.slice(3)];
      }

      if (certRes && certRes.data && certRes.data.length > 0) {
        result.certificates = certRes.data.map((c: any) => {
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
            skills: Array.isArray(c.skills) ? c.skills : [],
            description: c.description || "",
          };
        });
      }

      if (contactRes.data) {
        result.contact = {
          email: contactRes.data.email || result.contact.email,
          whatsapp: contactRes.data.whatsapp || result.contact.whatsapp,
          location: contactRes.data.location || result.contact.location,
          school: contactRes.data.school || result.contact.school,
          github: contactRes.data.github || result.contact.github,
          linkedin: contactRes.data.linkedin || result.contact.linkedin,
          instagram: contactRes.data.instagram || result.contact.instagram,
        };
      }
    } catch (e) {
      console.warn("Error loading full portfolio data from Supabase server side", e);
    }
  }

  return result;
}
