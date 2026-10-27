# 🚀 Portofolio Resmi - Fakhri Arya Dzaki

<div align="center">

  <img src="https://raw.githubusercontent.com/ADIVSTUDIO13/portofolio/main/public/images/fechat.png" alt="Portofolio Banner" width="100%" style="border-radius: 12px; max-width: 800px;" onerror="this.style.display='none'" />

  <br /><br />

  [![Live Website](https://img.shields.io/badge/Website-myportofolioarya.my.id-6366f1?style=for-the-badge&logo=googlechrome&logoColor=white)](https://www.myportofolioarya.my.id)
  [![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Groq AI](https://img.shields.io/badge/Groq_AI_SDK-F05032?style=for-the-badge&logo=openai&logoColor=white)](https://groq.com/)

  <p align="center">
    <strong>Website Portofolio Interaktif, Modern, & Dinamis dengan Dark Glassmorphism, Admin CMS Terintegrasi, Smart OCR, dan Groq AI.</strong>
  </p>

  <p align="center">
    <a href="#-tentang-projek">Tentang</a> •
    <a href="#-fitur-utama">Fitur Utama</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-struktur-direktori">Struktur Folder</a> •
    <a href="#-instalasi--penggunaan">Instalasi</a> •
    <a href="#-environment-variables">Environment</a> •
    <a href="#-kontak--sosial-media">Kontak</a>
  </p>

</div>

---

## 📌 Tentang Projek

Website portofolio resmi **Fakhri Arya Dzaki**, Siswa Rekayasa Perangkat Lunak (RPL) di SMKN 71 Jakarta. Platform ini dirancang khusus untuk merepresentasikan kemampuan profesional di bidang:
- **Full Stack Web Development**: Membangun aplikasi web modern, performa tinggi, dan ramah pengguna dengan Next.js App Router, React 19, dan Tailwind CSS.
- **Server Administration & DevOps**: Pengelolaan server Linux Ubuntu (VPS), orkestrasi kontainer Docker, manajemen panel Pterodactyl, konfigurasi Nginx reverse proxy, dan SSL.
- **Digital Infrastructure & Services**: Implementasi arsitektur cloud, database Supabase (PostgreSQL), dan integrasi AI cerdas (Groq LLM).

Aplikasi dapat diakses secara publik melalui domain resmi: **[https://www.myportofolioarya.my.id](https://www.myportofolioarya.my.id)**.

---

## ✨ Fitur Utama

### 1. 🎨 Antarmuka Modern & Imersif (Dark Glassmorphism)
- Desain bertema gelap elegan (*Sleek Dark Theme*) dengan efek kedalaman *glassmorphism* dan gradasi warna modern.
- Animasi mikro interaktif dan transisi mulus menggunakan **Framer Motion**.
- Responsif penuh di semua perangkat (Desktop, Tablet, dan Smartphone).

### 2. 💼 Showcase Proyek Unggulan
- Menampilkan berbagai proyek produksi nyata seperti:
  - **Fechat**: Platform chatting real-time berbasis WebSockets, Next.js, dan Docker.
  - **ARYANOKOS**: Layanan nomor HP virtual & verifikasi OTP otomatis terintegrasi provider API global.
  - **ARYASHOP**: Platform e-commerce produk digital, akun premium, dan voucher game.
- Modal detail proyek dengan informasi arsitektur, daftar fitur, teknologi, dan tautan akses langsung.

### 3. 📜 Sertifikat Resmi & Smart OCR Extraction
- Galeri sertifikat pelatihan dan kompetensi terverifikasi (Dicoding, Cisco Networking Academy, BNSP, dsb).
- Fitur **Smart OCR** menggunakan **Tesseract.js** untuk membaca teks langsung dari gambar sertifikat secara otomatis di sisi klien/server.
- **AI Extraction** via **Groq Cloud SDK** untuk mengenali judul, institusi penerbit, tanggal terbit, ID kredensial, dan daftar keterampilan yang relevan.

### 4. 🛠️ Dashboard Admin & CMS Dinamis (`/admin`)
- Panel kendali lengkap untuk memodifikasi konten secara langsung tanpa perlu menyunting kode sumber:
  - Pengaturan Profil Utama, Bio, Status Ketersediaan, dan Metrik Statistik.
  - Manajemen Keterampilan (*Skills Matrix*).
  - Manajemen Portofolio Proyek (Tambah, Edit, Hapus, AI Auto-Generate Prompt).
  - Manajemen Sertifikat & Verifikasi Kredensial.
  - Galeri Dokumentasi Kegiatan & Screenshot Interaktif.
  - Pengelolaan Pesan Masuk dari formulir kontak.
- Sinkronisasi data ganda: Mendukung penyimpanan berbasis **Supabase Database** dengan *fallback* aman ke **LocalStorage**.

### 5. 🗺️ Peta Interaktif & Geocoding OpenStreetMap
- Widget peta lokasi interaktif berbasis **Leaflet** dan **OpenStreetMap**.
- Mendukung fitur *reverse geocoding* dan pencarian lokasi secara dinamis melalui API rute bawaan (`/api/geocode`).

### 6. 🔍 Optimasi SEO & PWA
- Konfigurasi **Next SEO** komprehensif (Meta tags, OpenGraph profile, Twitter Card).
- Generator peta situs dinamis (`scripts/generate-sitemap.mjs`) untuk pengindeksan optimal di Google Search Console.
- Web Manifest (`manifest.ts`) untuk dukungan pengalaman Progressive Web App (PWA).

---

## 🛠️ Tech Stack

### Frontend & UI
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router Architecture)
- **Library**: [React 19](https://react.dev/)
- **Bahasa**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + PostCSS + Autoprefixer
- **Animasi**: [Framer Motion](https://www.framer.com/motion/)
- **Ikonografi**: [Lucide React](https://lucide.dev/)
- **Notifikasi**: [SweetAlert2](https://sweetalert2.github.io/)

### Backend, Database & Layanan AI
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL & Row Level Security)
- **Koneksi Database Direct**: `pg` (PostgreSQL Client)
- **AI Engine**: [Groq Cloud SDK](https://groq.com/) (Llama 3.3, GPT-OSS)
- **Optical Character Recognition (OCR)**: [Tesseract.js](https://tesseract.projectnaptha.com/)
- **Geocoding & Maps**: [Leaflet](https://leafletjs.com/) & Nominatim OpenStreetMap

### Deployment & Server
- **Hosting Frontend**: [Vercel](https://vercel.com/)
- **Infrastruktur Mandiri**: VPS Linux Ubuntu Server
- **Kontainerisasi**: Docker & Docker Compose
- **Server Panel**: Pterodactyl Panels
- **Web Server & SSL**: Nginx Reverse Proxy + Let's Encrypt SSL

---

## 📁 Struktur Direktori

```plaintext
myporto/
├── app/                      # Next.js App Router
│   ├── admin/                # Dashboard Admin CMS (/admin)
│   ├── api/                  # API Serverless Routes
│   │   ├── geocode/          # Forward & Reverse Geocoding via Nominatim
│   │   ├── groq-extract/     # AI Certificate OCR Extraction via Groq SDK
│   │   └── groq-project/     # AI Project Description Generator via Groq
│   ├── globals.css           # Konfigurasi CSS Global & Utilitas Tailwind
│   ├── icon.tsx              # Dynamic Favicon Generator
│   ├── layout.tsx            # Root Layout, SEO & Context Provider
│   ├── manifest.ts           # Web App Manifest PWA
│   └── page.tsx              # Halaman Beranda (Landing Page)
├── components/               # Komponen Antarmuka Reusable
│   ├── About.tsx             # Bagian Profil & Latar Belakang
│   ├── AdminMapPicker.tsx    # Modal Pemilih Lokasi Peta di Admin
│   ├── Certificates.tsx      # Galeri Sertifikat & OCR Scanner
│   ├── Contact.tsx           # Formulir Kontak & Tautan Sosial
│   ├── Footer.tsx            # Footer Website
│   ├── Gallery.tsx           # Galeri Foto Dokumentasi & Screenshot
│   ├── GalleryModal.tsx      # Modal Lightbox Preview Gambar
│   ├── Hero.tsx              # Banner Utama & Headline
│   ├── ImageViewer.tsx       # Viewer Gambar Fullscreen
│   ├── Navbar.tsx            # Header & Navigasi Responsif
│   ├── OpenMap.tsx           # Peta Lokasi Interaktif Leaflet
│   ├── Projects.tsx          # Grid Portofolio Proyek
│   └── Skills.tsx            # Matriks Keahlian & Teknologi
├── context/                  # React Context API (PortfolioContext)
├── lib/                      # Helper & Utilitas Aplikasi
│   ├── certificateOcr.ts     # Engine OCR Berbasis Tesseract.js
│   ├── getPortfolioData.ts   # Data Fallback & Pengambilan Data Portofolio
│   ├── jwt.ts                # Manajemen Token JWT Admin
│   ├── leafletLoader.ts      # Dynamic Loader untuk Leaflet Maps
│   ├── supabaseClient.ts     # Inisialisasi Klien Supabase
│   └── swal.ts               # Custom Modal Alert SweetAlert2
├── public/                   # Asset Statis (Gambar, Ikon, dsb)
├── scripts/                  # Skrip Otomasi (Sitemap Generator)
├── supabase/                 # Skema & Migrasi Database SQL
├── next.config.mjs           # Konfigurasi Next.js
├── tailwind.config.ts        # Konfigurasi Tema Tailwind CSS
└── package.json              # Manajemen Dependensi & Skrip NPM
```

---

## 🚀 Instalasi & Penggunaan

Ikuti langkah-langkah di bawah ini untuk menjalankan projek di lingkungan pengembangan lokal (*local development*):

### 1. Prasyarat
Pastikan Anda telah menginstal perangkat lunak berikut di komputer Anda:
- [Node.js](https://nodejs.org/) (Versi 18.x atau lebih baru disarankan)
- [Git](https://git-scm.com/)
- Paket manajer `npm`, `yarn`, atau `pnpm`

### 2. Kloning Repositori
```bash
git clone https://github.com/ADIVSTUDIO13/portofolio.git
cd portofolio
```

### 3. Menginstal Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variables
Salin berkas contoh `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Buka berkas `.env.local` dan masukkan kredensial Supabase serta Groq API Key Anda (lihat bagian [Environment Variables](#-environment-variables)).

### 5. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban (*browser*) Anda dan akses alamat:
```
http://localhost:3000
```

### 6. Membangun untuk Produksi (*Production Build*)
```bash
npm run build
npm run start
```

---

## ⚙️ Environment Variables

Aplikasi ini menggunakan beberapa variabel lingkungan untuk menghubungkan basis data dan fitur kecerdasan buatan:

| Variabel | Deskripsi | Wajib? |
| :--- | :--- | :---: |
| `NEXT_PUBLIC_SUPABASE_URL` | URL endpoint instans Supabase Anda | Opsional (Tersedia data lokal) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anonymous API Key Supabase | Opsional (Tersedia data lokal) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key untuk menjalankan skrip migrasi database | Hanya untuk migrasi |
| `GROQ_API_KEY` | Kunci API dari [Groq Console](https://console.groq.com) untuk fitur AI | Opsional (Bisa dimasukkan via UI Admin) |
| `NEXT_PUBLIC_SITE_URL` | URL kanonikal publik website (`https://www.myportofolioarya.my.id`) | Direkomendasikan |

---

## 📜 Skrip NPM yang Tersedia

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan Next.js development server pada port default `3000` |
| `npm run build` | Membuat sitemap terbaru secara otomatis dan mengompilasi bundel produksi |
| `npm run start` | Menjalankan server aplikasi Next.js hasil kompilasi produksi |
| `npm run sitemap` | Menjalankan skrip generator sitemap (`scripts/generate-sitemap.mjs`) |
| `npm run lint` | Menjalankan linter Next.js untuk memeriksa kepatuhan kode |
| `npm run migrate:openmap` | Menjalankan migrasi tabel lokasi peta OpenMap pada database Supabase |

---

## 📬 Kontak & Sosial Media

Tertarik berkolaborasi atau memiliki pertanyaan seputar proyek? Silakan hubungi saya melalui saluran berikut:

- **Nama Lengkap**: Fakhri Arya Dzaki
- **Sekolah**: SMKN 71 Jakarta (Jurusan Rekayasa Perangkat Lunak)
- **Website Resmi**: [https://www.myportofolioarya.my.id](https://www.myportofolioarya.my.id)
- **GitHub**: [@ADIVSTUDIO13](https://github.com/ADIVSTUDIO13)
- **Email**: [fakhriaryadzaki@gmail.com](mailto:fakhriaryadzaki@gmail.com)

---

<div align="center">
  <sub>Dibangun dengan dedikasi dan kode yang bersih oleh <strong>Fakhri Arya Dzaki</strong>. Hak Cipta dilindungi undang-undang.</sub>
</div>
