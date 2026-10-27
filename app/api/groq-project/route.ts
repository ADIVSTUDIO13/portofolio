import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      apiKey,
      model = "openai/gpt-oss-120b",
      existingProject = null,
    } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Instruksi prompt proyek tidak boleh kosong." },
        { status: 400 }
      );
    }

    const groqApiKey = apiKey || process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        {
          error: "GROQ_API_KEY tidak ditemukan. Masukkan Groq API Key Anda pada pengaturan CMS atau file .env.",
          requiresKey: true,
        },
        { status: 400 }
      );
    }

    const client = new Groq({ apiKey: groqApiKey });

    const systemPrompt = `Anda adalah asisten AI arsitek perangkat lunak dan kurator portofolio profesional untuk Fakhri Arya Dzaki (Full Stack Developer & Digital Service Administrator).
Tugas Anda adalah membuat atau menyempurnakan spesifikasi proyek perangkat lunak berdasarkan instruksi/perintah pengguna.

Hasilkan objek JSON murni dengan atribut persis berikut:
1. "title": Nama proyek yang keren, modern, dan profesional (contoh: "QuickPOS Cloud", "EduManage LMS", "AutoDeploy Panel").
2. "subtitle": Slogan singkat atau ringkasan 1 baris yang menarik (contoh: "Platform Kasir Minimarket Cloud Real-time", "Sistem Ujian Online & Manajemen Sekolah Terpadu").
3. "category": Kategori proyek (contoh: "Point of Sale & Inventory Platform", "Educational Management System", "DevOps & Cloud Automation", "Real-time Messaging Platform", "E-Commerce & Digital Billing").
4. "description": Deskripsi teknis dan arsitektur mendalam yang ditulis dalam bahasa Indonesia profesional (2-4 kalimat). Jelaskan fitur unggulan, performa, dan solusi yang dihadirkan.
5. "features": Array berisi 4 sampai 5 fitur utama proyek dalam bentuk string singkat dan padat (contoh: ["Sinkronisasi Data Real-time via WebSockets", "Pencetakan Struk Otomatis Bluetooth & Thermal", "Manajemen Stok Multi-Gudang & Barcode Scanner", "Dashboard Analitik Omzet & Laporan Penjualan Harian"]).
6. "tags": Array berisi 5 sampai 7 teknologi/tech stack yang paling tepat dan relevan untuk proyek ini (contoh: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Docker"]).
7. "status": Salah satu dari: "Live & Active", "Production Ready", atau "In Development".
8. "accentColor": Pasangan gradient Tailwind CSS yang harmonis, pilih salah satu dari:
   - "from-indigo-500 to-cyan-500"
   - "from-cyan-500 to-emerald-500"
   - "from-violet-500 to-purple-500"
   - "from-emerald-500 to-teal-500"
   - "from-amber-500 to-orange-500"
   - "from-rose-500 to-pink-500"

KEMBALIKAN HANYA OBJEK JSON VALID TANPA FORMAT MARKDOWN BACKTICKS ATAU TEKS LAIN.`;

    let userMessage = `Instruksi pembuatan proyek dari pengguna:
"${prompt}"`;

    if (existingProject) {
      userMessage += `

Data proyek saat ini yang ingin disempurnakan / dirombak:
${JSON.stringify(existingProject, null, 2)}`;
    }

    const modelsToTry = [
      model,
      "openai/gpt-oss-120b",
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
    ].filter(Boolean);

    const uniqueModels = Array.from(new Set(modelsToTry));

    let contentResult = "";
    let lastError: any = null;

    for (const currentModel of uniqueModels) {
      try {
        const completion = await client.chat.completions.create({
          model: currentModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature: 0.3,
          max_completion_tokens: 2048,
          top_p: 1,
          stream: false,
        });

        contentResult = completion.choices[0]?.message?.content || "";
        if (contentResult) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(
          `Groq model ${currentModel} failed for project generator, trying fallback...`,
          err?.message || err
        );
      }
    }

    if (!contentResult) {
      throw lastError || new Error("Gagal mendapatkan respons dari model Groq.");
    }

    const cleanedJson = contentResult
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(cleanedJson);
    const title = parsedData.title || "Proyek Baru";
    const id = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return NextResponse.json({
      success: true,
      data: {
        id,
        title,
        subtitle: parsedData.subtitle || "",
        category: parsedData.category || "Web Application",
        description: parsedData.description || "",
        features: Array.isArray(parsedData.features) ? parsedData.features : [],
        tags: Array.isArray(parsedData.tags) ? parsedData.tags : ["Next.js", "React.js", "Tailwind CSS"],
        status: parsedData.status || "Production Ready",
        accentColor: parsedData.accentColor || "from-indigo-500 to-cyan-500",
      },
    });
  } catch (error: any) {
    console.error("Error in Groq Project AI generation:", error);
    return NextResponse.json(
      {
        error: error?.message || "Terjadi kesalahan internal saat memproses AI dengan Groq.",
      },
      { status: 500 }
    );
  }
}
