import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Load environment variables from .env or .env.local if not present in process.env
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const [key, ...rest] = trimmed.split("=");
          const val = rest.join("=").replace(/^["']|["']$/g, "").trim();
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const baseUrl = "https://www.myportofolioarya.my.id";
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://dffphjdyrgztoqjwojtg.supabase.co";

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZnBoamR5cmd6dG9xandvanRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODU5MjU0MCwiZXhwIjoyMTA0MTY4NTQwfQ.dvl_OjTNFpvcZXZ_BrHaAelf2LGNwHVpkmSBt3aGQ6o";

const defaultProjects = [
  {
    title: "Fakhri Arya Dzaki - Profil Resmi Siswa RPL SMKN 71 Jakarta",
    image: `${baseUrl}/images/profile.jpeg`,
  },
  {
    title: "Fechat - Real-time Messaging Platform",
    image: `${baseUrl}/images/fechat.png`,
  },
  {
    title: "ARYANOKOS - Virtual Number & OTP Verification",
    image: `${baseUrl}/images/aryanokos.png`,
  },
  {
    title: "ARYASHOP - Game Top-Up & Digital Credit",
    image: `${baseUrl}/images/aryashop.png`,
  },
  {
    title: "Server & DevOps Infrastructure Control Panel",
    image: `${baseUrl}/images/infrastructure.png`,
  },
];

function escapeXml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function generate() {
  console.log("🚀 Generating static sitemap.xml and robots.txt...");
  let lastMod = new Date();
  const images = [...defaultProjects];

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const [profRes, certRes, contactRes] = await Promise.all([
        supabase.from("profiles").select("updated_at").single(),
        supabase.from("certificates").select("title, image, created_at").order("created_at", { ascending: false }),
        supabase.from("contacts").select("updated_at").single(),
      ]);

      const candidates = [];
      if (profRes.data?.updated_at) {
        const d = new Date(profRes.data.updated_at);
        if (!isNaN(d.getTime())) candidates.push(d);
      }
      if (certRes.data && certRes.data.length > 0) {
        for (const cert of certRes.data) {
          if (cert.image) {
            const imgUrl = cert.image.startsWith("http")
              ? cert.image
              : `${baseUrl}${cert.image.startsWith("/") ? "" : "/"}${cert.image}`;
            images.push({
              title: `${cert.title} - Sertifikat Resmi Fakhri Arya Dzaki`,
              image: imgUrl,
            });
          }
          if (cert.created_at) {
            const d = new Date(cert.created_at);
            if (!isNaN(d.getTime())) candidates.push(d);
          }
        }
      }
      if (contactRes.data?.updated_at) {
        const d = new Date(contactRes.data.updated_at);
        if (!isNaN(d.getTime())) candidates.push(d);
      }

      if (candidates.length > 0) {
        lastMod = new Date(Math.max(...candidates.map((d) => d.getTime())));
      }
    } catch (err) {
      console.warn("⚠️ Warning: Failed fetching from Supabase, using defaults:", err.message);
    }
  }

  // Deduplicate images by URL
  const seenUrls = new Set();
  const uniqueImages = [];
  for (const item of images) {
    if (!seenUrls.has(item.image)) {
      seenUrls.add(item.image);
      uniqueImages.push(item);
    }
  }

  const isoDate = lastMod.toISOString();

  // Generate XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}</loc>\n`;
  xml += `    <lastmod>${isoDate}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;

  for (const img of uniqueImages) {
    xml += `    <image:image>\n`;
    xml += `      <image:loc>${escapeXml(img.image)}</image:loc>\n`;
    if (img.title) {
      xml += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
    }
    xml += `    </image:image>\n`;
  }

  xml += `  </url>\n`;
  xml += `</urlset>\n`;

  // Ensure public directory exists
  const publicDir = path.join(rootDir, "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write sitemap.xml
  const sitemapPath = path.join(publicDir, "sitemap.xml");
  fs.writeFileSync(sitemapPath, xml, "utf-8");
  console.log(`✅ sitemap.xml successfully written to ${sitemapPath} (${uniqueImages.length} images included)`);

  // Write robots.txt
  const robotsTxt = `User-agent: *\nAllow: /\nDisallow: /admin\n\nUser-agent: Googlebot\nAllow: /\nDisallow: /admin\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
  const robotsPath = path.join(publicDir, "robots.txt");
  fs.writeFileSync(robotsPath, robotsTxt, "utf-8");
  console.log(`✅ robots.txt successfully written to ${robotsPath}`);
}

generate().catch((e) => {
  console.error("❌ Error generating sitemap:", e);
  process.exit(1);
});
