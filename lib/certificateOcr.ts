export interface OcrProgress {
  status: string;
  progress: number;
}

export interface ExtractedCertificateData {
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  skills: string[];
  description: string;
  rawText: string;
}

const KNOWN_ISSUERS: { pattern: RegExp; name: string }[] = [
  { pattern: /\bdicoding\b/i, name: "Dicoding Indonesia" },
  { pattern: /\bcisco\b|\bnetacad\b/i, name: "Cisco Networking Academy" },
  { pattern: /\bbnsp\b|badan nasional sertifikasi/i, name: "BNSP (Badan Nasional Sertifikasi Profesi)" },
  { pattern: /\blsp\b|lembaga sertifikasi profesi/i, name: "LSP (Lembaga Sertifikasi Profesi)" },
  { pattern: /\bcoursera\b/i, name: "Coursera" },
  { pattern: /\budemy\b/i, name: "Udemy" },
  { pattern: /\bgoogle cloud\b/i, name: "Google Cloud" },
  { pattern: /\bgoogle\b/i, name: "Google Career Certificates" },
  { pattern: /\baws\b|amazon web services/i, name: "Amazon Web Services (AWS)" },
  { pattern: /\bmicrosoft\b/i, name: "Microsoft" },
  { pattern: /\balibaba cloud\b/i, name: "Alibaba Cloud Academy" },
  { pattern: /\boracle\b/i, name: "Oracle Academy" },
  { pattern: /\bkemendikbud\b|\bkemdikbud\b|kementerian pendidikan/i, name: "Kemendikbudristek RI" },
  { pattern: /\bfreecodecamp\b/i, name: "freeCodeCamp" },
  { pattern: /\bprogate\b/i, name: "Progate" },
  { pattern: /\bhacktiv8\b/i, name: "Hacktiv8" },
  { pattern: /\bbinar academy\b|\bbinar\b/i, name: "Binar Academy" },
  { pattern: /\brevou\b/i, name: "RevoU" },
  { pattern: /\bred hat\b/i, name: "Red Hat" },
  { pattern: /\bmikrotik\b/i, name: "MikroTik Academy" },
];

const KNOWN_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "HTML5",
  "CSS3",
  "Tailwind CSS",
  "Node.js",
  "PHP",
  "Laravel",
  "Python",
  "MySQL",
  "PostgreSQL",
  "Docker",
  "Linux",
  "Ubuntu",
  "Git",
  "GitHub",
  "RESTful API",
  "REST API",
  "Cloud Computing",
  "AWS",
  "Google Cloud",
  "Cisco",
  "CCNA",
  "Routing & Switching",
  "Computer Networking",
  "Jaringan Komputer",
  "Cybersecurity",
  "Keamanan Jaringan",
  "Web Development",
  "Full Stack",
  "Frontend",
  "Backend",
  "DevOps",
  "Mikrotik",
  "Pterodactyl",
  "VPS",
];

export function parseCertificateText(rawText: string): ExtractedCertificateData {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  let issuer = "";
  let title = "";
  let issueDate = "";
  let credentialId = "";
  let credentialUrl = "";
  const skills: string[] = [];

  // 1. Deteksi Lembaga Penerbit (Issuer)
  for (const item of KNOWN_ISSUERS) {
    if (item.pattern.test(rawText)) {
      issuer = item.name;
      break;
    }
  }

  if (!issuer) {
    const issuerMatch = rawText.match(
      /(?:diterbitkan oleh|issued by|diberikan oleh|penyelenggara|organizer|awarded by)\s*[:\-]?\s*([^\n\r]+)/i
    );
    if (issuerMatch && issuerMatch[1]) {
      issuer = issuerMatch[1].trim().replace(/^[:\-\s]+/, "").slice(0, 50);
    }
  }

  // 2. Deteksi Tanggal Terbit (Issue Date)
  // Format Indonesia: 15 Januari 2024 atau Januari 2024
  const indDateMatch = rawText.match(
    /\b(\d{1,2}\s+(?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+\d{4})\b/i
  );
  if (indDateMatch) {
    issueDate = indDateMatch[1];
  } else {
    // Format Inggris: January 15, 2024 atau 15 January 2024
    const engDateMatch = rawText.match(
      /\b((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})\b/i
    ) || rawText.match(
      /\b(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\b/i
    );

    if (engDateMatch) {
      issueDate = engDateMatch[1];
    } else {
      // Month Year
      const monthYearMatch = rawText.match(
        /\b((?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\b/i
      );
      if (monthYearMatch) {
        issueDate = monthYearMatch[1];
      } else {
        // Year only
        const yearMatch = rawText.match(/\b(20\d{2})\b/);
        if (yearMatch) {
          issueDate = yearMatch[1];
        }
      }
    }
  }

  // 3. Deteksi ID / Nomor Kredensial
  const credMatch = rawText.match(
    /(?:credential\s*id|id\s*kredensial|nomor\s*sertifikat|no\.?\s*sertifikat|certificate\s*no\.?|id\s*number|no\.?\s*reg|kode\s*verifikasi|verification\s*code)\s*[:\-#]?\s*([A-Za-z0-9\-_/]{4,40})/i
  );

  if (credMatch && credMatch[1]) {
    credentialId = credMatch[1].trim();
  } else {
    // Dicoding format / alphanumeric code candidate (e.g. 2VX3O5... or 4-part code)
    const dicodingMatch = rawText.match(/\b([A-Z0-9]{4,}-[A-Z0-9]{4,}-[A-Z0-9]{4,})\b/);
    if (dicodingMatch) {
      credentialId = dicodingMatch[1];
    }
  }

  // 4. Deteksi Tautan Verifikasi (Credential URL)
  const urlMatch = rawText.match(
    /(https?:\/\/[^\s"<>]+(?:verify|certificate|credential|cert|badge|dicoding\.com|coursera\.org|cisco\.com)[^\s"<>]*)/i
  ) || rawText.match(/(https?:\/\/[^\s"<>]+)/i);

  if (urlMatch && urlMatch[1]) {
    credentialUrl = urlMatch[1].trim().replace(/[.,;)]+$/, "");
  }

  // 5. Deteksi Keahlian Terkait (Skills)
  const lowerRaw = rawText.toLowerCase();
  for (const skill of KNOWN_SKILLS) {
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(lowerRaw)) {
      if (!skills.includes(skill)) {
        skills.push(skill);
      }
    }
  }

  // 6. Deteksi Judul Sertifikat (Title)
  // Cari kalimat setelah kata kunci penyelesaian kursus
  const titleAfterKeyword = rawText.match(
    /(?:telah menyelesaikan|has successfully completed|kelulusan atas|kompetensi dalam|kursus|course|kelas|program|title|subject)\s*[:\-\n\r]*([^\n\r]{4,80})/i
  );

  if (titleAfterKeyword && titleAfterKeyword[1]) {
    title = titleAfterKeyword[1]
      .trim()
      .replace(/^[:\-\s]+/, "")
      .replace(/["'”]/g, "");
  } else {
    // Cari baris yang diawali "Belajar..." (khas Dicoding)
    const belajarLine = lines.find((l) => /^belajar\s+/i.test(l));
    if (belajarLine) {
      title = belajarLine.trim();
    } else {
      // Cari baris yang mengandung nama umum sertifikasi
      const candidateLine = lines.find((l) =>
        /(?:developer|administrator|engineer|programmer|specialist|fundamentals|dasar|expert|pemrograman|jaringan|web|cloud|security|networking)/i.test(
          l
        ) &&
        l.length > 5 &&
        l.length < 80 &&
        !l.toLowerCase().includes("sertifikat") &&
        !l.toLowerCase().includes("certificate") &&
        !l.toLowerCase().includes(issuer.toLowerCase())
      );
      if (candidateLine) {
        title = candidateLine.trim();
      }
    }
  }

  // Jika title belum ketemu, fallback ke baris terpanjang yang bukan nama penerbit
  if (!title) {
    const validLines = lines.filter(
      (l) =>
        l.length > 8 &&
        l.length < 75 &&
        !l.toLowerCase().includes("sertifikat") &&
        !l.toLowerCase().includes("certificate") &&
        !l.toLowerCase().includes("completion") &&
        !l.toLowerCase().includes("diberikan kepada") &&
        !l.toLowerCase().includes("awarded to") &&
        (!issuer || !l.toLowerCase().includes(issuer.toLowerCase()))
    );
    if (validLines.length > 0) {
      title = validLines[0];
    } else {
      title = "Sertifikat Kompetensi";
    }
  }

  // 7. Generate Deskripsi Ringkas
  const description = `Sertifikat resmi kompetensi yang diterbitkan oleh ${
    issuer || "lembaga terkait"
  } untuk program ${title}${issueDate ? ` pada ${issueDate}` : ""}.`;

  return {
    title: title.trim(),
    issuer: issuer || "Lembaga Sertifikasi",
    issueDate: issueDate || "",
    credentialId: credentialId || "",
    credentialUrl: credentialUrl || "",
    skills: skills.length > 0 ? skills.slice(0, 6) : ["Teknologi Informasi"],
    description,
    rawText,
  };
}

export async function extractCertificateTextFromImage(
  imageSource: File | Blob | string,
  onProgress?: (progress: OcrProgress) => void
): Promise<ExtractedCertificateData> {
  // Dynamic import agar tidak membebani ukuran bundle SSR
  const { createWorker } = await import("tesseract.js");

  onProgress?.({ status: "Menginisialisasi Engine OCR...", progress: 10 });

  const worker = await createWorker("eng+ind", 1, {
    logger: (m) => {
      if (m.status === "recognizing text") {
        const pct = Math.round((m.progress || 0) * 100);
        onProgress?.({
          status: `Membaca teks dari gambar (${pct}%)...`,
          progress: Math.min(95, Math.max(20, Math.round(20 + pct * 0.75))),
        });
      } else if (m.status === "loading tesseract core") {
        onProgress?.({ status: "Memuat Core Tesseract OCR...", progress: 20 });
      } else if (m.status === "loading language traineddata") {
        onProgress?.({ status: "Memuat Model Bahasa (Indonesia & Inggris)...", progress: 30 });
      }
    },
  });

  try {
    onProgress?.({ status: "Memproses ekstraksi karakter...", progress: 60 });
    const ret = await worker.recognize(imageSource);
    const rawText = ret.data.text || "";

    onProgress?.({ status: "Menganalisis struktur data sertifikat...", progress: 95 });
    const parsedData = parseCertificateText(rawText);

    onProgress?.({ status: "Selesai!", progress: 100 });
    return parsedData;
  } finally {
    await worker.terminate();
  }
}

export async function refineCertificateWithGroq(
  rawText: string,
  apiKey?: string,
  model: string = "openai/gpt-oss-120b"
): Promise<Partial<ExtractedCertificateData> | null> {
  try {
    const res = await fetch("/api/groq-extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: rawText, apiKey, model }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error || "Gagal mengekstrak dengan Groq AI.");
    }

    const data = await res.json();
    if (data && data.success && data.data) {
      return data.data;
    }
    return null;
  } catch (e) {
    console.warn("Groq AI extraction fallback to local heuristic:", e);
    return null;
  }
}
