-- ===================================================
-- MIGRASI DATABASE SUPABASE: FITUR OPENMAP (OPENSTREETMAP)
-- Portofolio Fakhri Arya Dzaki
-- Jalankan skrip ini di SQL Editor Dashboard Supabase Anda
-- ===================================================

-- 1. Tambahkan kolom map_config pada tabel public.contacts jika belum ada
ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS map_config JSONB DEFAULT '{
  "latitude": -6.1866,
  "longitude": 106.8708,
  "zoom": 15,
  "title": "SMKN 71 Jakarta",
  "subtitle": "Rekayasa Perangkat Lunak (RPL) & Lab Server",
  "address": "Jl. Rawasari Timur IX No.1, Cempaka Putih, Jakarta Pusat, DKI Jakarta 10570",
  "enabled": true,
  "theme": "dark"
}'::jsonb;

-- 2. Isi nilai default untuk record profil kontak utama (id = 1) jika belum memiliki map_config
UPDATE public.contacts
SET map_config = '{
  "latitude": -6.1866,
  "longitude": 106.8708,
  "zoom": 15,
  "title": "SMKN 71 Jakarta",
  "subtitle": "Rekayasa Perangkat Lunak (RPL) & Lab Server",
  "address": "Jl. Rawasari Timur IX No.1, Cempaka Putih, Jakarta Pusat, DKI Jakarta 10570",
  "enabled": true,
  "theme": "dark"
}'::jsonb
WHERE id = 1 AND (map_config IS NULL OR map_config = '{}'::jsonb);

-- 3. Muat ulang cache skema API PostgREST Supabase
NOTIFY pgrst, 'reload schema';
