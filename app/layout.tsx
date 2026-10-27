import type { Metadata, Viewport } from "next";
import { BreadcrumbJsonLd, FAQJsonLd, SoftwareApplicationJsonLd } from "next-seo";
import "./globals.css";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { getSupabaseFullPortfolioData } from "@/lib/getPortfolioData";
import PreventZoom from "@/components/PreventZoom";

// Viewport configuration to prevent accidental page zooming on mobile
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

// Dynamic Next.js Metadata API
export async function generateMetadata(): Promise<Metadata> {
  const data = await getSupabaseFullPortfolioData();
  const { profile, contact, projects, skills, certificates = [] } = data;

  const certHighlights = certificates.map((c) => `${c.title} (${c.issuer})`).join(", ");
  const title = `${profile.name} - ${profile.role} & ${profile.subRole} | Siswa SMKN 71 Jakarta`;
  const contactSummary = `Hubungi kontak resmi: WhatsApp (+${contact.whatsapp}) atau Email (${contact.email}) untuk kolaborasi proyek web development & administrasi server VPS.`;
  const description = `${profile.bio} Siswa Kelas ${profile.grade} ${profile.school} konsentrasi ${profile.major}. Pengembang ${projects.map((p) => p.title).join(", ")}. Pemegang sertifikasi resmi: ${certHighlights || "Pemrograman Web & Lisensi Keahlian"}. ${contactSummary}`;

  const projectKeywords = projects.flatMap((p) => [
    p.title,
    p.category,
    p.subtitle,
    ...(Array.isArray(p.tags) ? p.tags : []),
    `Proyek ${p.title}`,
    `Aplikasi ${p.title}`
  ]).filter(Boolean) as string[];

  const skillKeywords = skills.flatMap((s) => [
    s.name,
    s.category,
    `${s.name} Developer`,
    `Keahlian ${s.name}`,
    `Programmer ${s.name}`
  ]);

  const certKeywords = certificates.flatMap((c) => [
    c.title,
    c.issuer,
    c.credentialId,
    `Sertifikat ${c.title}`,
    `Lisensi ${c.issuer}`,
    `Sertifikasi ${c.issuer}`,
    `Verifikasi Sertifikat ${c.title}`,
    ...(Array.isArray(c.skills)
      ? c.skills
      : typeof c.skills === "string"
      ? (c.skills as string).split(",").map((s) => s.trim())
      : [])
  ]).filter(Boolean) as string[];

  const allKeywords = Array.from(new Set([
    // Personal Branding & Identity
    profile.name,
    "Fakhri Arya Dzaki",
    "Fakhri Arya",
    "Arya Dzaki",
    "Fakhri Arya Dzaki Portofolio",
    "Arya RPL SMKN 71",
    "adivstudio13",
    "adivstudio",

    // Professional Roles & Industry Titles
    profile.role,
    profile.subRole,
    "Full Stack Developer Indonesia",
    "Junior Web Developer Indonesia",
    "Frontend Developer Next.js",
    "Backend Developer Node.js",
    "Digital Service Administrator",
    "Cloud & VPS Server Administrator",
    "Web Developer Jakarta",
    "Programmer Muda Indonesia",
    "Software Engineer Siswa SMK",
    "Freelance Web Developer Jakarta",
    "Jasa Pembuatan Website Modern",
    "Jasa Konfigurasi VPS Ubuntu",
    "Jasa Setup Pterodactyl Panel",

    // Education & Organizations
    profile.school,
    profile.major,
    "SMKN 71 Jakarta",
    "RPL SMKN 71",
    "Cyber Security SMKN 71 Jakarta",
    "Cyber Security SMK Negeri 71 Jakarta",
    "Komunitas Cyber Security SMKN 71",
    "Organisasi Cyber Security",
    "Rekayasa Perangkat Lunak SMKN 71 Jakarta",
    "Siswa RPL SMKN 71 Jakarta",
    "Portofolio Siswa SMK Rekayasa Perangkat Lunak",
    "Jurusan RPL Jakarta",
    "SMK Pusat Keunggulan Jakarta",
    "Siswa RPL Berprestasi",

    // Tech Stack & Frameworks
    "Next.js 16 Developer",
    "React.js Developer",
    "TypeScript Programmer",
    "Tailwind CSS Expert",
    "Node.js Backend REST API",
    "Ubuntu Linux VPS Server",
    "Docker Containerization",
    "Pterodactyl Game Server Panel",
    "Cyber Security Defense",
    "Linux Server Hardening",
    "Firewall Configuration",
    "Supabase Cloud PostgreSQL Database",
    "Groq AI Llama Vision Integration",
    "JWT Authentication Web Crypto",
    "OCR Tesseract Document Scanner",
    "Modern Web Development",

    // Dynamic Lists from Database
    ...projectKeywords,
    ...skillKeywords,
    ...certKeywords,

    // Certification & Credentials
    "Sertifikat Dicoding Indonesia",
    "Sertifikat Pemrograman Web",
    "Lisensi Kompetensi BNSP",
    "Sertifikasi Web Developer Resmi",
    "Kredensial Profesional Pemrograman",
    "Portofolio RPL SMKN 71",
    "Dokumentasi Sertifikat Fakhri Arya",
    "Verifikasi Sertifikat Online",

    // Real-World Platforms
    "Fechat Real-time Messaging Platform",
    "ARYANOKOS Virtual Number OTP Service",
    "ARYASHOP Game Topup Store",
    "Platform Digital Interaktif",

    // Official Contact & Collaboration Keywords
    `Kontak ${profile.name}`,
    `Contact ${profile.name}`,
    `Email ${profile.name}`,
    contact.email,
    `WhatsApp ${profile.name}`,
    `WA ${profile.name}`,
    `Nomor WhatsApp ${profile.name}`,
    `+${contact.whatsapp}`,
    `Hubungi ${profile.name}`,
    `Instagram ${contact.instagram ? contact.instagram.replace("https://instagram.com/", "@").replace("http://instagram.com/", "@") : "@fakhriaryadzaki"}`,
    `LinkedIn ${profile.name}`,
    `GitHub ${profile.name}`,
    "Jasa Web Developer Jakarta WhatsApp",
    "Jasa Buat Website Hubungi WhatsApp",
    "Kontak Programmer Jakarta",
    "Kontak Siswa RPL SMKN 71",
    `Lokasi ${contact.location}`
  ]));

  const heroImage = projects[0]?.image || "/images/fechat.png";

  return {
    metadataBase: new URL("https://www.myportofolioarya.my.id"),
    title: {
      default: `${profile.name} - Portofolio Web Developer & Server Admin | Siswa RPL SMKN 71 Jakarta`,
      template: `%s | ${profile.name}`,
    },
    description,
    keywords: allKeywords,
    authors: [{ name: profile.name, url: "https://www.myportofolioarya.my.id" }],
    creator: profile.name,
    publisher: profile.name,
    applicationName: `${profile.name} Portfolio`,
    category: "technology",
    classification: "Portfolio, Web Development, Cloud Infrastructure, Software Engineering",
    alternates: {
      canonical: "https://www.myportofolioarya.my.id",
      languages: {
        "id": "https://www.myportofolioarya.my.id",
        "id-ID": "https://www.myportofolioarya.my.id",
        "x-default": "https://www.myportofolioarya.my.id",
      },
    },
    verification: {
      google: "MNSQ0MIlyLsxQSNnS_3IGhDoRP008WbzAafA3tn5V9k",
      other: {
        "msvalidate.01": "F7D3A4B8C1D6E5F2",
      },
    },
    openGraph: {
      title: `${profile.name} - ${profile.role} & ${profile.subRole} | SMKN 71 Jakarta`,
      description,
      url: "https://www.myportofolioarya.my.id",
      siteName: `Portofolio & Sertifikat Resmi ${profile.name}`,
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: `Portofolio & Sertifikat ${profile.name} - Siswa RPL SMKN 71 Jakarta`,
        },
      ],
      locale: "id_ID",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name} - ${profile.role} | Siswa SMKN 71 Jakarta`,
      description,
      images: [heroImage],
      creator: "@fakhriaryadzaki",
    },
    other: {
      "geo.region": "ID-JK",
      "geo.placename": "Jakarta Timur",
      "geo.position": "-6.2250;106.9004",
      "ICBM": "-6.2250, 106.9004",
      "rating": "general",
      "revisit-after": "1 days",
      "author": profile.name,
      "publisher": "https://www.myportofolioarya.my.id",
      "contact:email": contact.email,
      "contact:phone_number": `+${contact.whatsapp}`,
      "og:email": contact.email,
      "og:phone_number": `+${contact.whatsapp}`,
      "og:locality": "Jakarta Timur",
      "og:region": "DKI Jakarta",
      "og:country_name": "Indonesia",
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialData = await getSupabaseFullPortfolioData();
  const { profile, contact, projects, skills, certificates = [] } = initialData;

  // Dynamic Schema.org Projects list (hasPart)
  const projectSchemas = projects.map((p) => ({
    "@type": "SoftwareApplication",
    "name": p.title,
    "applicationCategory": p.category,
    "operatingSystem": "Web, Cloud, VPS",
    "description": p.description,
    "image": `https://www.myportofolioarya.my.id${p.image.startsWith("/") ? "" : "/"}${p.image}`,
    "keywords": Array.isArray(p.tags) ? p.tags.join(", ") : "",
    "author": {
      "@id": "https://www.myportofolioarya.my.id/#person"
    }
  }));

  // Dynamic Schema.org Certificates list (hasCredential)
  const certificateSchemas = certificates.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    "name": c.title,
    "credentialCategory": "Certificate",
    "recognizedBy": {
      "@type": "Organization",
      "name": c.issuer
    },
    ...(c.credentialId ? { "identifier": c.credentialId } : {}),
    ...(c.credentialUrl ? { "url": c.credentialUrl } : {}),
    ...(c.image ? { "image": c.image.startsWith("http") ? c.image : `https://www.myportofolioarya.my.id${c.image.startsWith("/") ? "" : "/"}${c.image}` } : {}),
    ...(c.description ? { "description": c.description } : {}),
    ...(Array.isArray(c.skills) && c.skills.length > 0 ? { "teaches": c.skills.join(", ") } : {})
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": "https://www.myportofolioarya.my.id/#profilepage",
        "url": "https://www.myportofolioarya.my.id",
        "name": `Portofolio Resmi ${profile.name} - Siswa RPL SMKN 71 Jakarta`,
        "description": `Profil resmi ${profile.name}, Siswa Rekayasa Perangkat Lunak (RPL) SMKN 71 Jakarta. Full Stack Web Developer & Administrator Server VPS Linux.`,
        "mainEntity": {
          "@id": "https://www.myportofolioarya.my.id/#person"
        },
        "isPartOf": {
          "@id": "https://www.myportofolioarya.my.id/#website"
        }
      },
      {
        "@type": "Person",
        "@id": "https://www.myportofolioarya.my.id/#person",
        "name": profile.name,
        "alternateName": [
          "Fakhri Arya",
          "Arya Dzaki",
          "adivstudio13",
          "Arya RPL",
          "Fakhri Arya RPL SMKN 71",
          "Arya SMKN 71"
        ],
        "jobTitle": `${profile.role} & ${profile.subRole}`,
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Full Stack Web Developer & Cloud Server Administrator",
          "description": "Pengembangan aplikasi web performa tinggi menggunakan Next.js, React, Node.js, serta pengelolaan server VPS Ubuntu Linux dan kontainer Docker.",
          "skills": "Next.js, React.js, TypeScript, Node.js, Tailwind CSS, Docker, Linux VPS Ubuntu, PostgreSQL, Supabase, MySQL"
        },
        "email": `mailto:${contact.email}`,
        "telephone": `+${contact.whatsapp.replace(/[^0-9+]/g, "")}`,
        "gender": "Male",
        "nationality": {
          "@type": "Country",
          "name": "Indonesia"
        },
        "image": `https://www.myportofolioarya.my.id${projects[0]?.image || "/images/fechat.png"}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Jakarta Timur",
          "addressRegion": "DKI Jakarta",
          "addressCountry": "ID",
          "description": contact.location || "Jakarta Timur, DKI Jakarta, Indonesia"
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": `+${contact.whatsapp.replace(/[^0-9+]/g, "")}`,
            "contactType": "Customer Support & Inquiries",
            "email": contact.email,
            "availableLanguage": ["Indonesian", "English"],
            "areaServed": "ID"
          }
        ],
        "worksFor": {
          "@type": "EducationalOrganization",
          "name": profile.school,
          "sameAs": "https://smkn71jakarta.sch.id"
        },
        "memberOf": [
          {
            "@type": "Organization",
            "name": "Cyber Security SMK Negeri 71 Jakarta",
            "url": "https://www.myportofolioarya.my.id/#about",
            "logo": "https://www.myportofolioarya.my.id/images/cyber-security-smkn71.jpeg"
          }
        ],
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": `${profile.school} (Jurusan ${profile.major} Kelas ${profile.grade})`,
          "sameAs": "https://smkn71jakarta.sch.id"
        },
        "url": "https://www.myportofolioarya.my.id",
        "sameAs": [
          contact.instagram,
          contact.github,
          contact.linkedin,
          contact.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}` : ""
        ].filter(Boolean),
        "knowsAbout": Array.from(new Set([
          ...skills.map((s) => s.name),
          ...certificates.map((c) => c.title),
          "Full Stack Web Development",
          "Cyber Security & Network Defense",
          "Cyber Security SMKN 71 Jakarta",
          "Linux Server Hardening",
          "Next.js & React Ecosystem",
          "TypeScript & Node.js",
          "Tailwind CSS Modern Styling",
          "Ubuntu Linux Server & VPS Administration",
          "Docker Containerization",
          "Pterodactyl Game Panel",
          "Supabase Cloud Database",
          "Groq AI Llama Vision",
          "RESTful API & WebSocket Architecture",
          "JWT Authentication & Web Crypto Security",
          "Rekayasa Perangkat Lunak (RPL)"
        ])),
        "hasPart": projectSchemas,
        "hasCredential": certificateSchemas
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.myportofolioarya.my.id/#faq",
        "name": `Pertanyaan Umum Seputar ${profile.name}`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Siapa Fakhri Arya Dzaki?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Fakhri Arya Dzaki adalah siswa jurusan Rekayasa Perangkat Lunak (RPL) di SMKN 71 Jakarta yang berfokus sebagai Full Stack Web Developer dan Administrator Server VPS Linux."
            }
          },
          {
            "@type": "Question",
            "name": "Aplikasi dan platform apa saja yang pernah dibuat oleh Fakhri Arya Dzaki?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Fakhri Arya Dzaki telah mengembangkan platform Fechat (aplikasi chatting real-time dengan WebSockets), ARYANOKOS (layanan verifikasi SMS OTP nomor virtual otomatis), dan ARYASHOP (platform digital top-up game & pulsa), serta mengelola server VPS Ubuntu dan Docker."
            }
          },
          {
            "@type": "Question",
            "name": "Teknologi apa saja yang dikuasai Fakhri Arya Dzaki?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Keahlian utamanya mencakup Next.js 16, React.js, TypeScript, Tailwind CSS, Node.js, PHP, PostgreSQL, MySQL, Supabase, kontainerisasi Docker, administrasi VPS Ubuntu Linux, dan Pterodactyl Panels."
            }
          },
          {
            "@type": "Question",
            "name": "Bagaimana cara menghubungi Fakhri Arya Dzaki untuk kerja sama pembuatan website?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Anda dapat menghubungi Fakhri Arya Dzaki melalui WhatsApp (+6281234567890), email di fakhriaryadzaki@gmail.com, atau melalui formulir kontak di website resmi https://www.myportofolioarya.my.id/#contact."
            }
          }
        ]
      },
      {
        "@type": "ContactPage",
        "@id": "https://www.myportofolioarya.my.id/#contact",
        "url": "https://www.myportofolioarya.my.id/#contact",
        "name": `Kontak & Kolaborasi ${profile.name}`,
        "description": `Halaman kontak resmi ${profile.name} (${profile.school}). Hubungi melalui WhatsApp (+${contact.whatsapp}), Email (${contact.email}), atau formulir pesan langsung untuk proyek web development dan administrasi server.`,
        "mainEntity": {
          "@id": "https://www.myportofolioarya.my.id/#person"
        }
      },
      {
        "@type": "ItemList",
        "@id": "https://www.myportofolioarya.my.id/#certificates-list",
        "name": "Daftar Sertifikat & Lisensi Kompetensi",
        "description": "Koleksi sertifikat kelulusan, lisensi teknologi, dan kredensial resmi Fakhri Arya Dzaki",
        "itemListElement": certificates.map((c, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "item": {
            "@type": "EducationalOccupationalCredential",
            "name": c.title,
            "recognizedBy": {
              "@type": "Organization",
              "name": c.issuer
            },
            ...(c.credentialId ? { "identifier": c.credentialId } : {}),
            ...(c.credentialUrl ? { "url": c.credentialUrl } : {}),
            ...(c.image ? { "image": c.image.startsWith("http") ? c.image : `https://www.myportofolioarya.my.id${c.image.startsWith("/") ? "" : "/"}${c.image}` } : {}),
            "description": c.description || c.title
          }
        }))
      },
      {
        "@type": "ItemList",
        "@id": "https://www.myportofolioarya.my.id/#navigation",
        "name": "Navigasi Portofolio",
        "description": "Menu navigasi utama portofolio digital Fakhri Arya Dzaki",
        "numberOfItems": 7,
        "itemListElement": [
          {
            "@type": "SiteNavigationElement",
            "position": 1,
            "name": "Beranda",
            "description": "Perkenalan diri, headline, dan ringkasan profil Full Stack Web Developer & Administrator Server",
            "url": "https://www.myportofolioarya.my.id/#hero"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 2,
            "name": "Tentang",
            "description": `Profil lengkap ${profile.name}, latar belakang pendidikan di ${profile.school} jurusan ${profile.major}, dan pengalaman infrastruktur`,
            "url": "https://www.myportofolioarya.my.id/#about"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 3,
            "name": "Keahlian",
            "description": "Daftar keahlian teknis pemrograman, database PostgreSQL, container Docker, dan server VPS Linux",
            "url": "https://www.myportofolioarya.my.id/#skills"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 4,
            "name": "Proyek",
            "description": "Koleksi proyek perangkat lunak dan aplikasi web: Fechat, ARYANOKOS, ARYASHOP, dan platform lainnya",
            "url": "https://www.myportofolioarya.my.id/#projects"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 5,
            "name": "Sertifikat",
            "description": "Kredensial dan sertifikasi resmi Dicoding, lisensi teknologi web, dan kompetensi terverifikasi",
            "url": "https://www.myportofolioarya.my.id/#certificates"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 6,
            "name": "Galeri",
            "description": "Dokumentasi visual screenshot proyek, antarmuka sistem, dan aktivitas pengembangan",
            "url": "https://www.myportofolioarya.my.id/#gallery"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 7,
            "name": "Kontak",
            "description": `Hubungi ${profile.name} melalui WhatsApp (+${contact.whatsapp}), Email (${contact.email}), atau form pesan langsung`,
            "url": "https://www.myportofolioarya.my.id/#contact"
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.myportofolioarya.my.id/#breadcrumbs",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Beranda",
            "item": "https://www.myportofolioarya.my.id"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Tentang",
            "item": "https://www.myportofolioarya.my.id/#about"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Keahlian",
            "item": "https://www.myportofolioarya.my.id/#skills"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Proyek",
            "item": "https://www.myportofolioarya.my.id/#projects"
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "Sertifikat",
            "item": "https://www.myportofolioarya.my.id/#certificates"
          },
          {
            "@type": "ListItem",
            "position": 6,
            "name": "Galeri",
            "item": "https://www.myportofolioarya.my.id/#gallery"
          },
          {
            "@type": "ListItem",
            "position": 7,
            "name": "Kontak",
            "item": "https://www.myportofolioarya.my.id/#contact"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.myportofolioarya.my.id/#website",
        "url": "https://www.myportofolioarya.my.id",
        "name": `Portofolio & Sertifikat ${profile.name}`,
        "alternateName": [
          `${profile.name} Portfolio`,
          `Portofolio ${profile.name}`,
          `Fakhri Arya RPL SMKN 71`,
          "Arya Portfolio",
          "Website Resmi Fakhri Arya Dzaki"
        ],
        "description": `Portofolio resmi ${profile.name}, ${profile.role} & ${profile.subRole} (${profile.school}). Memuat proyek unggulan, keahlian, dan sertifikasi resmi.`,
        "publisher": {
          "@id": "https://www.myportofolioarya.my.id/#person"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.myportofolioarya.my.id/?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          },
          {
            "@type": "ReadAction",
            "target": ["https://www.myportofolioarya.my.id"]
          }
        ],
        "hasPart": [
          {
            "@type": "WebPage",
            "@id": "https://www.myportofolioarya.my.id/#hero",
            "url": "https://www.myportofolioarya.my.id/#hero",
            "name": `Beranda - ${profile.name}`,
            "description": "Pengenalan dan ringkasan profil pengembang web dan pengelola server.",
            "inLanguage": "id-ID"
          },
          {
            "@type": "WebPage",
            "@id": "https://www.myportofolioarya.my.id/#about",
            "url": "https://www.myportofolioarya.my.id/#about",
            "name": `Tentang Saya - ${profile.name}`,
            "description": `Profil mendalam tentang perjalanan pendidikan ${profile.name} di ${profile.school} serta keahliannya.`,
            "inLanguage": "id-ID"
          },
          {
            "@type": "WebPage",
            "@id": "https://www.myportofolioarya.my.id/#skills",
            "url": "https://www.myportofolioarya.my.id/#skills",
            "name": "Keahlian & Tech Stack",
            "description": "Daftar teknologi modern, bahasa pemrograman, dan alat pengembangan yang dikuasai.",
            "inLanguage": "id-ID"
          },
          {
            "@type": "WebPage",
            "@id": "https://www.myportofolioarya.my.id/#projects",
            "url": "https://www.myportofolioarya.my.id/#projects",
            "name": "Proyek Unggulan & Aplikasi Web",
            "description": "Showcase karya aplikasi digital, platform chat real-time, dan sistem e-commerce digital.",
            "inLanguage": "id-ID"
          },
          {
            "@type": "WebPage",
            "@id": "https://www.myportofolioarya.my.id/#certificates",
            "url": "https://www.myportofolioarya.my.id/#certificates",
            "name": "Sertifikat & Lisensi Kompetensi",
            "description": "Dokumentasi kredensial kelulusan kursus teknologi dan sertifikasi kompetensi keahlian.",
            "inLanguage": "id-ID"
          },
          {
            "@type": "WebPage",
            "@id": "https://www.myportofolioarya.my.id/#gallery",
            "url": "https://www.myportofolioarya.my.id/#gallery",
            "name": "Galeri Visual & Screenshot",
            "description": "Tangkapan layar dan galeri antarmuka proyek perangkat lunak.",
            "inLanguage": "id-ID"
          },
          {
            "@type": "WebPage",
            "@id": "https://www.myportofolioarya.my.id/#contact",
            "url": "https://www.myportofolioarya.my.id/#contact",
            "name": `Kontak & Kolaborasi - ${profile.name}`,
            "description": `Hubungi ${profile.name} untuk kolaborasi proyek, konsultasi web development, atau tawaran kerja.`,
            "inLanguage": "id-ID"
          }
        ]
      }
    ]
  };

  return (
    <html lang="id" className="scroll-smooth dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://dffphjdyrgztoqjwojtg.supabase.co" />
        <link rel="dns-prefetch" href="https://dffphjdyrgztoqjwojtg.supabase.co" />
        <meta name="format-detection" content="telephone=yes, date=no, email=yes, address=yes" />
        <meta name="google-site-verification" content="MNSQ0MIlyLsxQSNnS_3IGhDoRP008WbzAafA3tn5V9k" />
        {/* Next SEO Structured Data Components */}
        <BreadcrumbJsonLd
          items={[
            { name: "Beranda", item: "https://www.myportofolioarya.my.id" },
            { name: "Tentang", item: "https://www.myportofolioarya.my.id/#about" },
            { name: "Keahlian", item: "https://www.myportofolioarya.my.id/#skills" },
            { name: "Proyek", item: "https://www.myportofolioarya.my.id/#projects" },
            { name: "Sertifikat", item: "https://www.myportofolioarya.my.id/#certificates" },
            { name: "Galeri", item: "https://www.myportofolioarya.my.id/#gallery" },
            { name: "Kontak", item: "https://www.myportofolioarya.my.id/#contact" },
          ]}
        />
        <FAQJsonLd
          questions={[
            {
              question: "Siapa Fakhri Arya Dzaki?",
              answer:
                "Fakhri Arya Dzaki adalah siswa jurusan Rekayasa Perangkat Lunak (RPL) di SMKN 71 Jakarta yang berfokus sebagai Full Stack Web Developer dan Administrator Server VPS Linux.",
            },
            {
              question: "Aplikasi dan platform apa saja yang pernah dibuat oleh Fakhri Arya Dzaki?",
              answer:
                "Fakhri Arya Dzaki telah mengembangkan platform Fechat (aplikasi chatting real-time dengan WebSockets), ARYANOKOS (layanan verifikasi SMS OTP nomor virtual otomatis), dan ARYASHOP (platform digital top-up game & pulsa), serta mengelola server VPS Ubuntu dan Docker.",
            },
            {
              question: "Teknologi apa saja yang dikuasai Fakhri Arya Dzaki?",
              answer:
                "Keahlian utamanya mencakup Next.js 16, React.js, TypeScript, Tailwind CSS, Node.js, PHP, PostgreSQL, MySQL, Supabase, kontainerisasi Docker, administrasi VPS Ubuntu Linux, dan Pterodactyl Panels.",
            },
            {
              question: "Bagaimana cara menghubungi Fakhri Arya Dzaki untuk kerja sama pembuatan website?",
              answer: `Anda dapat menghubungi Fakhri Arya Dzaki melalui WhatsApp (+${contact.whatsapp}), email di ${contact.email}, atau melalui formulir kontak di website resmi https://www.myportofolioarya.my.id/#contact.`,
            },
          ]}
        />
        {projects.map((p, idx) => (
          <SoftwareApplicationJsonLd
            key={p.id || idx}
            scriptId={`next-seo-app-${p.id || idx}`}
            name={p.title}
            applicationCategory={p.category}
            operatingSystem="Web, Cloud, VPS"
            description={p.description}
            image={
              p.image
                ? p.image.startsWith("http")
                  ? p.image
                  : `https://www.myportofolioarya.my.id${p.image.startsWith("/") ? "" : "/"}${p.image}`
                : undefined
            }
            author={{
              "@type": "Person",
              name: profile.name,
              url: "https://www.myportofolioarya.my.id",
            }}
          />
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#080c14] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-white" suppressHydrationWarning>
        <PreventZoom />
        {/* Architectural subtle grid and ambient lighting */}
        <div className="fixed inset-0 bg-subtle-grid pointer-events-none z-0 opacity-30" />
        <div className="fixed inset-0 bg-ambient-top pointer-events-none z-0" />
        <PortfolioProvider initialData={initialData}>
          <div className="relative z-10">{children}</div>
        </PortfolioProvider>
      </body>
    </html>
  );
}
