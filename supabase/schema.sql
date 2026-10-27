-- ===================================================
-- SKEMA DATABASE SUPABASE UNTUK PORTOFOLIO FAKHRI ARYA DZAKI
-- Jalankan skrip ini di SQL Editor Supabase Dashboard Anda
-- ===================================================

-- 1. TABEL PROFIL (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id INT PRIMARY KEY DEFAULT 1,
  name VARCHAR(255) NOT NULL DEFAULT 'Fakhri Arya Dzaki',
  role VARCHAR(255) NOT NULL DEFAULT 'Full Stack Developer',
  sub_role VARCHAR(255) NOT NULL DEFAULT 'Digital Service Administrator',
  school VARCHAR(255) NOT NULL DEFAULT 'SMKN 71 Jakarta',
  grade VARCHAR(50) NOT NULL DEFAULT '11',
  major VARCHAR(255) NOT NULL DEFAULT 'RPL (Rekayasa Perangkat Lunak)',
  bio TEXT NOT NULL DEFAULT 'Berfokus pada pengembangan aplikasi web performa tinggi, platform real-time, serta pengolahan server & infrastruktur cloud.',
  about_detail TEXT NOT NULL DEFAULT 'Saya adalah siswa kelas 11 jurusan Rekayasa Perangkat Lunak (RPL) di SMKN 71 Jakarta.',
  status VARCHAR(255) NOT NULL DEFAULT 'Ready for Collaboration 🚀',
  vps_uptime VARCHAR(50) NOT NULL DEFAULT '99.9%',
  active_projects_count VARCHAR(50) NOT NULL DEFAULT '3+',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABEL KEAHLIAN (skills)
CREATE TABLE IF NOT EXISTS public.skills (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'Frontend', 'Backend', 'DevOps & Server'
  level VARCHAR(100) NOT NULL,    -- 'Beginner', 'Intermediate', 'Advanced', 'Expert'
  desc_text TEXT,
  highlight BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABEL PROYEK (projects)
CREATE TABLE IF NOT EXISTS public.projects (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  image VARCHAR(255),
  tags JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(100) DEFAULT 'Live & Active',
  accent_color VARCHAR(255) DEFAULT 'from-indigo-500 to-cyan-500',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABEL KONTAK (contacts)
CREATE TABLE IF NOT EXISTS public.contacts (
  id INT PRIMARY KEY DEFAULT 1,
  email VARCHAR(255) NOT NULL DEFAULT 'fakhriaryadzaki@gmail.com',
  whatsapp VARCHAR(100) NOT NULL DEFAULT '6281234567890',
  location VARCHAR(255) NOT NULL DEFAULT 'DKI Jakarta, Indonesia',
  school VARCHAR(255) NOT NULL DEFAULT 'SMKN 71 Jakarta • Kelas 11 RPL',
  github VARCHAR(255) DEFAULT 'https://github.com',
  linkedin VARCHAR(255) DEFAULT 'https://linkedin.com',
  instagram VARCHAR(255) DEFAULT 'https://instagram.com',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABEL SERTIFIKAT (certificates)
CREATE TABLE IF NOT EXISTS public.certificates (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  issue_date VARCHAR(100),
  credential_id VARCHAR(255),
  credential_url TEXT,
  image TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS) & POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent ERROR 42710
DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public Read Skills" ON public.skills;
DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
DROP POLICY IF EXISTS "Public Read Contacts" ON public.contacts;
DROP POLICY IF EXISTS "Public Read Certificates" ON public.certificates;

DROP POLICY IF EXISTS "Public Insert/Update Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public Insert/Update Skills" ON public.skills;
DROP POLICY IF EXISTS "Public Insert/Update Projects" ON public.projects;
DROP POLICY IF EXISTS "Public Insert/Update Contacts" ON public.contacts;
DROP POLICY IF EXISTS "Public Insert/Update Certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public Delete Certificates" ON public.certificates;

-- Allow Public Read Access for all tables
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Read Contacts" ON public.contacts FOR SELECT USING (true);
CREATE POLICY "Public Read Certificates" ON public.certificates FOR SELECT USING (true);

-- Allow Public Write / Update Access (Admin CMS)
CREATE POLICY "Public Insert/Update Profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Public Insert/Update Skills" ON public.skills FOR ALL USING (true);
CREATE POLICY "Public Insert/Update Projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Public Insert/Update Contacts" ON public.contacts FOR ALL USING (true);
CREATE POLICY "Public Insert/Update Certificates" ON public.certificates FOR ALL USING (true);
CREATE POLICY "Public Delete Certificates" ON public.certificates FOR DELETE USING (true);

-- Grant full table permissions and refresh PostgREST schema cache
GRANT ALL ON public.profiles TO anon, authenticated, service_role;
GRANT ALL ON public.skills TO anon, authenticated, service_role;
GRANT ALL ON public.projects TO anon, authenticated, service_role;
GRANT ALL ON public.contacts TO anon, authenticated, service_role;
GRANT ALL ON public.certificates TO anon, authenticated, service_role;
NOTIFY pgrst, 'reload schema';

-- INITIAL SEED DATA
INSERT INTO public.profiles (id, name, role, sub_role, school, grade, major, bio, about_detail, status, vps_uptime, active_projects_count)
VALUES (
  1,
  'Fakhri Arya Dzaki',
  'Full Stack Developer',
  'Digital Service Administrator',
  'SMKN 71 Jakarta',
  '11',
  'RPL (Rekayasa Perangkat Lunak)',
  'Berfokus pada pengembangan aplikasi web performa tinggi, platform real-time, serta pengolahan server & infrastruktur cloud (VPS, Docker, MySQL, Pterodactyl Panels).',
  'Saya adalah siswa kelas 11 jurusan Rekayasa Perangkat Lunak (RPL) di SMKN 71 Jakarta. Kombinasi passion di dunia pemrograman full stack dan administrasi server membuat saya mampu membangun platform dari nol hingga siap tayang di lingkungan produksi.',
  'Ready for Collaboration 🚀',
  '99.9%',
  '3+'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.contacts (id, email, whatsapp, location, school, github, linkedin, instagram)
VALUES (
  1,
  'fakhriaryadzaki@gmail.com',
  '6281234567890',
  'DKI Jakarta, Indonesia',
  'SMKN 71 Jakarta • Kelas 11 RPL',
  'https://github.com',
  'https://linkedin.com',
  'https://instagram.com'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.projects (id, title, category, subtitle, description, image, tags, features, status, accent_color)
VALUES
(
  'fechat',
  'Fechat',
  'Real-time Messaging Platform',
  'Aplikasi Chatting Real-Time Berkinerja Tinggi',
  'Fechat adalah platform aplikasi chatting real-time interaktif dengan antarmuka dark mode glassmorphism modern. Mendukung pengiriman pesan instan tanpa delay, indikator status online, serta pengelolaan kontak terintegrasi.',
  '/images/fechat.png',
  '["Next.js", "React.js", "Node.js", "WebSockets", "Tailwind CSS", "Docker"]',
  '["Real-time Instant Messaging via WebSockets", "Antarmuka Dark Glassmorphism Sleek & Clean", "Indikator Status Kehadiran Online/Offline", "Kontainerisasi Server dengan Docker"]',
  'Live & Active',
  'from-indigo-500 to-cyan-500'
),
(
  'aryanokos',
  'ARYANOKOS',
  'Virtual Number & OTP Verification',
  'Platform Nomor Virtual & Verifikasi OTP Otomatis',
  'ARYANOKOS menyediakan layanan nomor HP virtual temporer untuk penerimaan kode SMS OTP secara otomatis. Terhubung langsung dengan Provider API global dengan saldo akun & verifikasi instan.',
  '/images/aryanokos.png',
  '["React.js", "PHP", "Node.js", "MySQL", "REST API", "VPS Ubuntu"]',
  '["Penerimaan Kode SMS OTP Real-time", "Dukungan Ratusan Nomor dari Berbagai Negara", "Sistem Saldo & Log Transaksi Otomatis", "Infrastruktur Mandiri di VPS Ubuntu"]',
  'Production Ready',
  'from-cyan-500 to-emerald-500'
),
(
  'aryashop',
  'ARYASHOP',
  'Game Top-Up & Digital Credit Platform',
  'Platform Online Top-Up Game & Pulsa Digital',
  'ARYASHOP adalah platform ecommerce digital yang memudahkan pengguna melakukan top-up voucher game favorit (Mobile Legends, Free Fire, Valorant) dan pulsa/kredit digital dengan kalkulasi otomatis dan proses kilat.',
  '/images/aryashop.png',
  '["Next.js", "PHP", "MySQL", "Tailwind CSS", "Payment API"]',
  '["Katalog Produk Game & Pulsa Lengkap", "Integrasi Payment Gateway Otomatis", "Kecepatan Proses Checkout Hitungan Detik", "Desain Responsif Mobile-First"]',
  'Live & Active',
  'from-violet-500 to-purple-500'
) ON CONFLICT (id) DO NOTHING;
