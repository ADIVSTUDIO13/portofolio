-- ===================================================
-- SKEMA SUPABASE TABLE ADMIN AUTH & PIN SETTINGS
-- Jalankan skrip ini di SQL Editor Supabase Dashboard Anda
-- ===================================================

-- 1. BUAT TABEL ADMIN SETTINGS UNTUK MENYIMPAN HASH PIN
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  pin_hash TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BENIH DATA INITIAL (SHA-256 Hash dari 'aryatyara13')
-- SHA-256 dari 'aryatyara13' = 'aaf545a59fd100953228ad35630aaa679f3321406316b4272f196def3868b7d9'
INSERT INTO public.admin_settings (id, pin_hash)
VALUES ('default', 'aaf545a59fd100953228ad35630aaa679f3321406316b4272f196def3868b7d9')
ON CONFLICT (id) DO UPDATE 
SET pin_hash = EXCLUDED.pin_hash, updated_at = NOW();

-- 3. AKTIFKAN ROW LEVEL SECURITY (RLS)
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- 4. HAPUS POLICY LAMA JIKA ADA
DROP POLICY IF EXISTS "Public Read Admin Settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Public Update Admin Settings" ON public.admin_settings;

-- 5. BUAT POLICY AKSES
CREATE POLICY "Public Read Admin Settings" ON public.admin_settings FOR SELECT USING (true);
CREATE POLICY "Public Update Admin Settings" ON public.admin_settings FOR UPDATE USING (true);
