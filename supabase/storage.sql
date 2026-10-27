-- ===================================================
-- SKEMA SUPABASE STORAGE BUCKET & POLICIES
-- Jalankan skrip ini di SQL Editor Supabase Dashboard Anda
-- ===================================================

-- 1. BUAT BUCKET STORAGE UNTUK ASSET PORTOFOLIO (portfolio-assets)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. HAPUS POLICY LAMA JIKA ADA
DROP POLICY IF EXISTS "Public Read Storage Assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Storage Assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Storage Assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Storage Assets" ON storage.objects;

-- 3. POLICY AKSES BACA PUBLIK (Akses URL Gambar)
CREATE POLICY "Public Read Storage Assets" ON storage.objects 
FOR SELECT USING (bucket_id = 'portfolio-assets');

-- 4. POLICY UPLOAD GAMBAR (Admin CMS)
CREATE POLICY "Public Insert Storage Assets" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets');

-- 5. POLICY EDIT & UPDATE GAMBAR
CREATE POLICY "Public Update Storage Assets" ON storage.objects 
FOR UPDATE USING (bucket_id = 'portfolio-assets');

-- 6. POLICY HAPUS GAMBAR
CREATE POLICY "Public Delete Storage Assets" ON storage.objects 
FOR DELETE USING (bucket_id = 'portfolio-assets');
