import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const { text, apiKey, model = "openai/gpt-oss-120b" } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Teks OCR sertifikat tidak boleh kosong." },
        { status: 400 }
      );
    }

    const groqApiKey = apiKey || process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        {
          error: "GROQ_API_KEY tidak ditemukan. Masukkan Groq API Key Anda pada pengaturan modal atau file .env.",
          requiresKey: true,
        },
        { status: 400 }
      );
    }

    const client = new Groq({ apiKey: groqApiKey });

    const systemPrompt = `Anda adalah asisten AI spesialis ekstraksi data sertifikat dan kredensial profesional.
Tugas Anda adalah menganalisis teks hasil OCR dari sebuah sertifikat, lalu mengekstrak informasi ke dalam format JSON murni.

Informasi yang HARUS diekstrak:
1. "title": Judul sertifikat, nama kursus, atau nama pelatihan (contoh: "Belajar Dasar Pemrograman JavaScript", "Junior Web Developer", "CCNA: Introduction to Networks").
2. "issuer": Lembaga atau institusi penerbit sertifikat (contoh: "Dicoding Indonesia", "Cisco Networking Academy", "BNSP", "Coursera", "Google").
3. "issueDate": Tanggal atau tahun terbit sertifikat (format Indonesia atau internasional, contoh: "15 Januari 2024", "Januari 2024", "2024").
4. "credentialId": Nomor sertifikat, ID kredensial, atau kode verifikasi resmi (contoh: "DICODING-CERT-12345", "NO: 012/LSP/2024", kode alfanumerik). Jika tidak ada di teks, berikan string kosong "".
5. "credentialUrl": Tautan web verifikasi kredensial jika tercantum di dokumen. Jika tidak ada, berikan string kosong "".
6. "skills": Daftar keahlian, teknologi, dan topik spesifik yang dipelajari atau diuji pada sertifikat tersebut dalam bentuk array of string (contoh: ["JavaScript", "ES6+", "Asynchronous Programming", "Web Development"]). Berikan minimal 3-6 skill yang paling relevan.
7. "description": Ringkasan deskripsi profesional singkat (1-2 kalimat) mengenai pencapaian sertifikat ini dalam bahasa Indonesia.

KEMBALIKAN HANYA OBJEK JSON VALID TANPA MARKDOWN BACKTICKS ATAU PENJELASAN LAIN.`;

    const userMessage = `Berikut adalah teks mentah hasil OCR dari gambar sertifikat:
---
${text.slice(0, 4000)}
---
Ekstrak data sertifikat di atas menjadi objek JSON sesuai instruksi.`;

    // Try primary model requested by user, with fallback if model is not available
    const modelsToTry = [
      model,
      "openai/gpt-oss-120b",
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
    ].filter(Boolean);

    // Remove duplicates while keeping order
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
          temperature: 0.2,
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
        console.warn(`Groq model ${currentModel} failed, trying next fallback model...`, err?.message || err);
      }
    }

    if (!contentResult) {
      throw lastError || new Error("Gagal mendapatkan respons dari model Groq.");
    }

    // Clean JSON response (strip markdown fences if present)
    const cleanedJson = contentResult
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(cleanedJson);

    return NextResponse.json({
      success: true,
      data: {
        title: parsedData.title || "",
        issuer: parsedData.issuer || "",
        issueDate: parsedData.issueDate || "",
        credentialId: parsedData.credentialId || "",
        credentialUrl: parsedData.credentialUrl || "",
        skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
        description: parsedData.description || "",
      },
    });
  } catch (error: any) {
    console.error("Error in Groq certificate extraction API:", error);
    return NextResponse.json(
      {
        error: error?.message || "Terjadi kesalahan saat mengekstrak data dengan Groq AI.",
      },
      { status: 500 }
    );
  }
}
