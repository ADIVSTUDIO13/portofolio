"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  ArrowLeft,
  KeyRound,
  Upload,
  CheckCircle2,
  Database,
  User,
  FolderCode,
  Cpu,
  Mail,
  Instagram,
  Github,
  Linkedin,
  Award,
  Calendar,
  ExternalLink,
  FileText,
  Sparkles,
  Scan,
  ChevronDown,
  ChevronUp,
  Bot,
  Copy,
  Search,
  SlidersHorizontal,
  Eye,
  PanelLeftClose,
  PanelLeft,
  X,
  Layers,
  Settings,
  HelpCircle,
  Hash,
  Check,
  ShieldCheck,
  Key,
  MapPin,
  Compass,
  Navigation,
} from "lucide-react";
import { usePortfolio, ProjectItem, SkillItem, CertificateItem, generateProjectSlug } from "@/context/PortfolioContext";
import AdminMapPicker from "@/components/AdminMapPicker";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { showSuccessAlert, showErrorAlert, showConfirmDialog, showToast } from "@/lib/swal";
import { extractCertificateTextFromImage, refineCertificateWithGroq } from "@/lib/certificateOcr";
import ImageViewer from "@/components/ImageViewer";
import {
  createAdminJwt,
  verifyAdminJwt,
  decodeJwtPayload,
  regenerateJwtSecret,
  generateRandomHex,
  JwtPayload,
} from "@/lib/jwt";

// SHA-256 Hash of default PIN 'aryatyara13'
const DEFAULT_PIN_HASH = "aaf545a59fd100953228ad35630aaa679f3321406316b4272f196def3868b7d9";
const ADMIN_PIN_HASH_STORAGE_KEY = "myporto_admin_pin_hash_v2";
const ADMIN_JWT_STORAGE_KEY = "myporto_admin_jwt";
const SUPABASE_JWT_STORAGE_KEY = "myporto_supabase_jwt";
const SUPABASE_URL_STORAGE_KEY = "myporto_supabase_url";
const GROQ_API_KEY_STORAGE = "myporto_groq_api_key_v1";
const GROQ_MODEL_STORAGE = "myporto_groq_model_v1";

// Utility function to compute SHA-256 in Web Crypto API
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function AdminPage() {
  const {
    data,
    updateProfile,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    deleteSkill,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    updateContact,
    updateMapConfig,
    resetToDefault,
    syncWithSupabase,
    reloadFromSupabase,
    isSupabaseActive,
  } = usePortfolio();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [storedPinHash, setStoredPinHash] = useState(DEFAULT_PIN_HASH);

  // JWT Session & Supabase Key States
  const [activeJwtToken, setActiveJwtToken] = useState("");
  const [jwtPayload, setJwtPayload] = useState<JwtPayload | null>(null);
  const [customJwtInput, setCustomJwtInput] = useState("");
  const [supabaseJwtInput, setSupabaseJwtInput] = useState("");
  const [supabaseUrlInput, setSupabaseUrlInput] = useState("");
  const [isRefreshingDb, setIsRefreshingDb] = useState(false);
  const [isSavingSupabaseJwt, setIsSavingSupabaseJwt] = useState(false);

  // Studio Desk Navigation State
  const [activeTab, setActiveTab] = useState<
    "profile" | "projects" | "certificates" | "skills" | "contact" | "map" | "supabase" | "groq" | "security"
  >("projects");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  // Search queries for lists
  const [projectSearch, setProjectSearch] = useState("");
  const [certSearch, setCertSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");

  // Groq AI configuration
  const [groqApiKey, setGroqApiKey] = useState("");
  const [groqModel, setGroqModel] = useState("openai/gpt-oss-120b");
  const [showAiSettings, setShowAiSettings] = useState(false);

  // Form States
  const [profileForm, setProfileForm] = useState(data.profile);
  const [contactForm, setContactForm] = useState(data.contact);
  const [mapForm, setMapForm] = useState({
    latitude: data.map?.latitude ?? -6.1866,
    longitude: data.map?.longitude ?? 106.8708,
    zoom: data.map?.zoom ?? 15,
    title: data.map?.title ?? "SMKN 71 Jakarta",
    subtitle: data.map?.subtitle ?? "Rekayasa Perangkat Lunak (RPL) & Lab Server",
    address: data.map?.address ?? "Jl. Rawasari Timur IX No.1, Cempaka Putih, Jakarta Pusat, DKI Jakarta 10570",
    enabled: data.map?.enabled ?? true,
    theme: (data.map?.theme ?? "dark") as "dark" | "osm",
  });

  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [mapSearchResults, setMapSearchResults] = useState<any[]>([]);
  const [isSearchingMap, setIsSearchingMap] = useState(false);

  useEffect(() => {
    setProfileForm(data.profile);
    setContactForm(data.contact);
    if (data.map) {
      setMapForm({
        latitude: data.map.latitude,
        longitude: data.map.longitude,
        zoom: data.map.zoom,
        title: data.map.title,
        subtitle: data.map.subtitle,
        address: data.map.address,
        enabled: data.map.enabled,
        theme: data.map.theme || "dark",
      });
    }
  }, [data]);

  // Geocoding Server Route Search Handler - Otomatis isi SEMUA form
  const handleSearchLocation = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = customQuery !== undefined ? customQuery : mapSearchQuery;
    if (!q.trim()) return;
    setIsSearchingMap(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (res.ok && json.results && json.results.length > 0) {
        setMapSearchResults(json.results);
        const best = json.results[0];
        // Otomatis isi SEMUA field form
        setMapForm((prev) => ({
          ...prev,
          title: best.title,
          subtitle: best.subtitle,
          address: best.address,
          latitude: best.latitude,
          longitude: best.longitude,
          zoom: best.zoom || 16,
        }));
        showToast(`Semua form otomatis terisi: ${best.title}!`, "success");
      } else {
        setMapSearchResults([]);
        showErrorAlert("Lokasi Tidak Ditemukan", "Coba gunakan nama kota, gedung, atau landmark yang lebih spesifik.");
      }
    } catch (err) {
      console.error("Geocoding search error", err);
      showErrorAlert("Gagal Mencari Lokasi", "Pastikan perangkat Anda terhubung ke internet.");
    } finally {
      setIsSearchingMap(false);
    }
  };

  // Browser GPS Location Detector + Reverse Geocoding Otomatis
  const handleDetectCurrentLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      showErrorAlert("Tidak Didukung", "Browser Anda tidak mendukung deteksi geolokasi GPS.");
      return;
    }
    showToast("Mendeteksi lokasi GPS perangkat Anda...", "info");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMapForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));

        // Reverse geocoding otomatis untuk mengisi semua field
        try {
          const revRes = await fetch(`/api/geocode?lat=${lat}&lon=${lng}`);
          if (revRes.ok) {
            const revData = await revRes.json();
            if (revData.result) {
              setMapForm((prev) => ({
                ...prev,
                title: revData.result.title,
                subtitle: revData.result.subtitle,
                address: revData.result.address,
                latitude: lat,
                longitude: lng,
              }));
              showToast(`Semua form terisi otomatis via GPS: ${revData.result.title}!`, "success");
              return;
            }
          }
        } catch (e) {}

        showToast(`GPS Terdeteksi: ${lat.toFixed(4)}, ${lng.toFixed(4)}`, "success");
      },
      () => {
        showErrorAlert("Izin Lokasi Ditolak", "Izinkan akses lokasi pada peramban Anda untuk menggunakan fitur ini.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Save Map Config Handler
  const handleSaveMap = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await updateMapConfig(mapForm);
    showSuccessAlert("Konfigurasi Peta Disimpan!", "Titik koordinat dan pengaturan OpenStreetMap berhasil diperbarui.");
  };

  // Project Drawer State
  const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [projectForm, setProjectForm] = useState<ProjectItem>({
    id: "",
    title: "",
    category: "Real-time Messaging Platform",
    subtitle: "",
    description: "",
    image: "/images/fechat.png",
    tags: [],
    features: [],
    status: "Live & Active",
    accentColor: "from-indigo-500 to-cyan-500",
  });
  const [tagInputText, setTagInputText] = useState("");
  const [featureInputText, setFeatureInputText] = useState("");
  const [projectAiPrompt, setProjectAiPrompt] = useState("");
  const [isGeneratingProjectAi, setIsGeneratingProjectAi] = useState(false);

  // Certificate Drawer State
  const [isCertDrawerOpen, setIsCertDrawerOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [uploadingCertImage, setUploadingCertImage] = useState(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatusText, setOcrStatusText] = useState("");
  const [rawOcrText, setRawOcrText] = useState("");
  const [showRawOcr, setShowRawOcr] = useState(false);
  const [certForm, setCertForm] = useState<CertificateItem>({
    id: "",
    title: "",
    issuer: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
    image: "",
    skills: [],
    description: "",
  });
  const [certSkillInputText, setCertSkillInputText] = useState("");
  const [previewCertInModal, setPreviewCertInModal] = useState<string | null>(null);

  // Skill Drawer State
  const [isSkillDrawerOpen, setIsSkillDrawerOpen] = useState(false);
  const [skillForm, setSkillForm] = useState<SkillItem>({
    name: "",
    category: "Frontend",
    level: "Advanced",
    desc: "",
    highlight: false,
  });

  // Security Form State
  const [currentPinInput, setCurrentPinInput] = useState("");
  const [newPinInput, setNewPinInput] = useState("");
  const [confirmPinInput, setConfirmPinInput] = useState("");

  // Load Pin Hash, Saved JWT & Config on Mount
  useEffect(() => {
    async function loadPinHash() {
      let hash = DEFAULT_PIN_HASH;
      try {
        const savedHash = localStorage.getItem(ADMIN_PIN_HASH_STORAGE_KEY);
        if (savedHash) hash = savedHash;
      } catch (e) {
        console.error("Failed to load pin hash from local storage", e);
      }

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: adminSettings } = await supabase
            .from("admin_settings")
            .select("pin_hash")
            .eq("id", "default")
            .single();
          if (adminSettings && adminSettings.pin_hash) {
            hash = adminSettings.pin_hash;
          }
        } catch (err) {
          console.warn("Could not load admin_settings from Supabase", err);
        }
      }

      setStoredPinHash(hash);

      // 1. Verify Saved Admin JWT Session
      try {
        const savedJwt = localStorage.getItem(ADMIN_JWT_STORAGE_KEY);
        if (savedJwt) {
          setActiveJwtToken(savedJwt);
          const verification = await verifyAdminJwt(savedJwt);
          if (verification.valid) {
            setIsAuthenticated(true);
            setJwtPayload(verification.payload || decodeJwtPayload(savedJwt));
          } else {
            console.warn("Saved JWT session is invalid or expired:", verification.error);
            localStorage.removeItem(ADMIN_JWT_STORAGE_KEY);
            setActiveJwtToken("");
            setJwtPayload(null);
          }
        }
      } catch (jwtErr) {
        console.error("Error verifying JWT session on mount", jwtErr);
      }

      // 2. Load Supabase Custom Credentials
      try {
        const savedSupabaseJwt = localStorage.getItem(SUPABASE_JWT_STORAGE_KEY);
        if (savedSupabaseJwt) setSupabaseJwtInput(savedSupabaseJwt);
        const savedSupabaseUrl = localStorage.getItem(SUPABASE_URL_STORAGE_KEY);
        if (savedSupabaseUrl) setSupabaseUrlInput(savedSupabaseUrl);
      } catch (e) {}

      // 3. Load Groq AI Config
      try {
        const savedGroqKey = localStorage.getItem(GROQ_API_KEY_STORAGE);
        if (savedGroqKey) setGroqApiKey(savedGroqKey);
        const savedGroqModel = localStorage.getItem(GROQ_MODEL_STORAGE);
        if (savedGroqModel) setGroqModel(savedGroqModel);
      } catch (e) {
        console.error("Failed loading Groq config from localStorage", e);
      }
    }

    loadPinHash();
  }, []);

  // Keyboard shortcut (Escape to close open drawers)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (previewCertInModal) setPreviewCertInModal(null);
        else if (isCertDrawerOpen) setIsCertDrawerOpen(false);
        else if (isProjectDrawerOpen) setIsProjectDrawerOpen(false);
        else if (isSkillDrawerOpen) setIsSkillDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCertDrawerOpen, isProjectDrawerOpen, isSkillDrawerOpen, previewCertInModal]);

  // Auth Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputHash = await sha256(pinInput.trim());

    if (inputHash === storedPinHash) {
      setIsAuthenticated(true);
      setAuthError("");

      // Generate and save JWT Session Token
      try {
        const token = await createAdminJwt({
          sub: "admin",
          role: "admin",
          pinHash: inputHash,
        });
        setActiveJwtToken(token);
        setJwtPayload(decodeJwtPayload(token));
        localStorage.setItem(ADMIN_JWT_STORAGE_KEY, token);
      } catch (jwtErr) {
        console.error("Failed generating admin JWT token", jwtErr);
      }

      showToast("Selamat datang di Sanity Studio Admin!", "success");
    } else {
      setAuthError("PIN Keamanan Salah. Silakan coba lagi.");
      showErrorAlert("Akses Ditolak", "PIN Keamanan yang Anda masukkan tidak sesuai.");
    }
  };

  // Upload Project Image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio-assets")
          .upload(filePath, file);

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from("portfolio-assets")
            .getPublicUrl(filePath);

          if (publicUrlData && publicUrlData.publicUrl) {
            setProjectForm((prev) => ({ ...prev, image: publicUrlData.publicUrl }));
            setUploadingImage(false);
            showToast("Asset gambar berhasil diunggah ke Supabase!", "success");
            return;
          }
        }
      }

      // Local Base64 fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectForm((prev) => ({ ...prev, image: reader.result as string }));
        setUploadingImage(false);
        showToast("Gambar berhasil dimuat!", "success");
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Failed uploading image", err);
      setUploadingImage(false);
      showErrorAlert("Gagal Upload", "Terjadi kesalahan saat mengunggah gambar.");
    }
  };

  // Call Groq AI to generate project
  const handleGenerateProjectAi = async () => {
    if (!projectAiPrompt.trim()) {
      showErrorAlert("Instruksi Kosong", "Silakan masukkan ide proyek untuk diproses AI.");
      return;
    }

    setIsGeneratingProjectAi(true);
    try {
      const res = await fetch("/api/groq-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: projectAiPrompt,
          apiKey: groqApiKey,
          model: groqModel,
          existingProject: editingProjectId ? projectForm : null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal memproses proyek dengan Groq AI.");
      }

      const generated = json.data;
      const autoSlug = generateProjectSlug(generated.title);
      setProjectForm((prev) => ({
        ...prev,
        id: editingProjectId ? prev.id : (autoSlug || prev.id),
        title: generated.title || prev.title,
        subtitle: generated.subtitle || prev.subtitle,
        category: generated.category || prev.category,
        description: generated.description || prev.description,
        tags: generated.tags || prev.tags,
        features: generated.features || prev.features,
        status: generated.status || prev.status,
        accentColor: generated.accentColor || prev.accentColor,
      }));

      showSuccessAlert(
        "✨ Proyek Berhasil Dirancang AI!",
        `Data proyek "${generated.title}" telah dimuat ke editor inspector.`
      );
    } catch (err: any) {
      console.error("Gagal generate proyek:", err);
      showErrorAlert("AI Gagal", err?.message || "Terjadi kesalahan saat memproses AI.");
    } finally {
      setIsGeneratingProjectAi(false);
    }
  };

  // OCR + Groq AI refinement on certificate
  const runOcrOnCertificate = async (imageInput: File | string) => {
    setIsOcrProcessing(true);
    setOcrProgress(5);
    setOcrStatusText("Memulai analisis OCR (Tesseract Engine)...");

    try {
      const ocrResult = await extractCertificateTextFromImage(imageInput, (p) => {
        setOcrProgress(Math.min(65, Math.max(5, Math.round(p.progress * 0.65))));
        setOcrStatusText(p.status);
      });

      setRawOcrText(ocrResult.rawText);

      setOcrProgress(75);
      setOcrStatusText(`Mengekstrak Keahlian & ID Kredensial dengan Groq AI (${groqModel})...`);

      let aiResult = null;
      if (ocrResult.rawText && ocrResult.rawText.trim().length > 0) {
        try {
          aiResult = await refineCertificateWithGroq(ocrResult.rawText, groqApiKey, groqModel);
        } catch (aiErr) {
          console.warn("Groq AI extraction fallback:", aiErr);
        }
      }

      setOcrProgress(100);
      setOcrStatusText("Analisis selesai!");

      if (aiResult) {
        setCertForm((prev) => ({
          ...prev,
          title: aiResult.title || ocrResult.title || prev.title,
          issuer: aiResult.issuer || ocrResult.issuer || prev.issuer,
          issueDate: aiResult.issueDate || ocrResult.issueDate || prev.issueDate,
          credentialId: aiResult.credentialId || ocrResult.credentialId || prev.credentialId,
          credentialUrl: aiResult.credentialUrl || ocrResult.credentialUrl || prev.credentialUrl,
          description: aiResult.description || ocrResult.description || prev.description,
          skills: aiResult.skills && aiResult.skills.length > 0 ? aiResult.skills : ocrResult.skills,
        }));
        showToast("✨ Groq AI Berhasil! Data terisi otomatis.", "success");
      } else {
        setCertForm((prev) => ({
          ...prev,
          title: ocrResult.title || prev.title,
          issuer: ocrResult.issuer || prev.issuer,
          issueDate: ocrResult.issueDate || prev.issueDate,
          credentialId: ocrResult.credentialId || prev.credentialId,
          credentialUrl: ocrResult.credentialUrl || prev.credentialUrl,
          description: ocrResult.description || prev.description,
          skills: ocrResult.skills,
        }));
        showToast("OCR Berhasil membaca data dokumen.", "success");
      }
    } catch (err) {
      console.error("Gagal OCR:", err);
      showToast("OCR tidak dapat membaca teks secara otomatis.", "info");
    } finally {
      setIsOcrProcessing(false);
    }
  };

  // Certificate Image Upload Handler with Automatic OCR
  const handleCertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCertImage(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const fileExt = file.name.split(".").pop();
        const fileName = `cert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `certificates/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio-assets")
          .upload(filePath, file);

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from("portfolio-assets")
            .getPublicUrl(filePath);

          if (publicUrlData && publicUrlData.publicUrl) {
            setCertForm((prev) => ({ ...prev, image: publicUrlData.publicUrl }));
            setUploadingCertImage(false);
            showToast("Gambar terunggah ke Cloud! Memulai OCR...", "info");
            await runOcrOnCertificate(file);
            return;
          }
        }
      }

      // Local Base64 fallback with canvas compression
      const compressedDataUrl = await (async () => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const rawResult = e.target?.result as string;
            if (typeof window === "undefined") {
              resolve(rawResult);
              return;
            }
            const img = new window.Image();
            img.onload = () => {
              try {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;
                const maxWidth = 1280;
                if (width > maxWidth) {
                  height = Math.round((height * maxWidth) / width);
                  width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                  resolve(rawResult);
                  return;
                }
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL("image/jpeg", 0.75));
              } catch {
                resolve(rawResult);
              }
            };
            img.onerror = () => resolve(rawResult);
            img.src = rawResult;
          };
          reader.readAsDataURL(file);
        });
      })();

      setCertForm((prev) => ({ ...prev, image: compressedDataUrl }));
      setUploadingCertImage(false);
      showToast("Gambar sertifikat dimuat! Memulai OCR...", "info");
      await runOcrOnCertificate(file);
    } catch (err) {
      console.error("Upload cert error", err);
      setUploadingCertImage(false);
      showErrorAlert("Gagal Upload", "Terjadi kesalahan saat memproses gambar.");
    }
  };

  // Save PIN
  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentHash = await sha256(currentPinInput.trim());
    if (currentHash !== storedPinHash) {
      showErrorAlert("Gagal Memperbarui PIN", "PIN Lama salah.");
      return;
    }
    if (newPinInput.length < 4) {
      showErrorAlert("Gagal Memperbarui PIN", "PIN Baru minimal 4 karakter.");
      return;
    }
    if (newPinInput !== confirmPinInput) {
      showErrorAlert("Gagal Memperbarui PIN", "Konfirmasi PIN Baru tidak cocok.");
      return;
    }

    const newHash = await sha256(newPinInput.trim());
    setStoredPinHash(newHash);
    try {
      localStorage.setItem(ADMIN_PIN_HASH_STORAGE_KEY, newHash);
      const token = await createAdminJwt({ sub: "admin", role: "admin", pinHash: newHash });
      localStorage.setItem(ADMIN_JWT_STORAGE_KEY, token);
      setActiveJwtToken(token);
      setJwtPayload(decodeJwtPayload(token));
    } catch (e) {}

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("admin_settings").upsert({
          id: "default",
          pin_hash: newHash,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {}
    }

    showSuccessAlert("PIN Berhasil Diperbarui!", "PIN Admin baru telah diamankan dan token JWT sesi diperbarui.");
    setCurrentPinInput("");
    setNewPinInput("");
    setConfirmPinInput("");
  };

  // JWT & Session Handlers
  const handleLogout = () => {
    try {
      localStorage.removeItem(ADMIN_JWT_STORAGE_KEY);
    } catch (e) {}
    setActiveJwtToken("");
    setJwtPayload(null);
    setIsAuthenticated(false);
    showToast("Keluar dari Studio CMS", "info");
  };

  const handleSaveCustomJwt = async (tokenToSave?: string) => {
    const rawToken = (tokenToSave !== undefined ? tokenToSave : customJwtInput).trim();
    if (!rawToken) {
      showErrorAlert("Token Kosong", "Silakan masukkan token JWT yang valid.");
      return;
    }
    const check = await verifyAdminJwt(rawToken);
    if (!check.valid) {
      const proceed = await showConfirmDialog(
        "Token Mungkin Tidak Valid",
        `Peringatan: ${check.error || "Format token tidak sesuai"}. Tetap simpan token ini?`,
        "Tetap Simpan"
      );
      if (!proceed) return;
    }
    try {
      localStorage.setItem(ADMIN_JWT_STORAGE_KEY, rawToken);
      setActiveJwtToken(rawToken);
      setJwtPayload(check.payload || decodeJwtPayload(rawToken));
      setCustomJwtInput("");
      showSuccessAlert("Token JWT Disimpan", "Token otentikasi JWT admin berhasil diperbarui di sesi browser.");
    } catch (e) {
      showErrorAlert("Gagal Menyimpan", "Tidak dapat menyimpan token ke browser storage.");
    }
  };

  const handleGenerateFreshJwt = async () => {
    try {
      const token = await createAdminJwt({
        sub: "admin",
        role: "admin",
        pinHash: storedPinHash,
      });
      localStorage.setItem(ADMIN_JWT_STORAGE_KEY, token);
      setActiveJwtToken(token);
      setJwtPayload(decodeJwtPayload(token));
      showSuccessAlert("Token Acak Dibuat!", "Token JWT HMAC-SHA256 baru dengan nonce & random JTI unik berhasil digenerate.");
    } catch (err: any) {
      showErrorAlert("Gagal Generate JWT", err?.message || "Terjadi kesalahan.");
    }
  };

  const handleRegenerateRandomSecret = async () => {
    const confirm = await showConfirmDialog(
      "Acak Ulang Secret Key JWT?",
      "Tindakan ini akan membuat kunci rahasia HMAC-SHA256 256-bit baru secara acak (random). Token lama akan di-regenerate.",
      "Ya, Acak Secret Key"
    );
    if (!confirm) return;
    try {
      regenerateJwtSecret();
      const token = await createAdminJwt({
        sub: "admin",
        role: "admin",
        pinHash: storedPinHash,
      });
      localStorage.setItem(ADMIN_JWT_STORAGE_KEY, token);
      setActiveJwtToken(token);
      setJwtPayload(decodeJwtPayload(token));
      showSuccessAlert("Secret Key Diacak!", "Secret key baru 256-bit telah digenerate secara acak dan token sesi baru diterbitkan.");
    } catch (err: any) {
      showErrorAlert("Gagal Mengacak Secret", err?.message || "Terjadi kesalahan.");
    }
  };

  const handleSaveSupabaseCredentials = async () => {
    setIsSavingSupabaseJwt(true);
    try {
      if (supabaseJwtInput.trim()) {
        localStorage.setItem(SUPABASE_JWT_STORAGE_KEY, supabaseJwtInput.trim());
      } else {
        localStorage.removeItem(SUPABASE_JWT_STORAGE_KEY);
      }
      if (supabaseUrlInput.trim()) {
        localStorage.setItem(SUPABASE_URL_STORAGE_KEY, supabaseUrlInput.trim());
      } else {
        localStorage.removeItem(SUPABASE_URL_STORAGE_KEY);
      }
      showSuccessAlert("Kredensial Disimpan", "Token JWT & URL Supabase berhasil disimpan. Memuat ulang data dari cloud...");
      await reloadFromSupabase();
    } catch (err: any) {
      showErrorAlert("Gagal Menyimpan", err?.message || "Terjadi kesalahan saat menyimpan token Supabase.");
    } finally {
      setIsSavingSupabaseJwt(false);
    }
  };

  const handleResetSupabaseCredentials = async () => {
    const confirm = await showConfirmDialog(
      "Reset Kredensial Supabase?",
      "Konfigurasi token JWT custom akan dihapus dan kembali menggunakan env bawaan.",
      "Ya, Reset"
    );
    if (!confirm) return;
    try {
      localStorage.removeItem(SUPABASE_JWT_STORAGE_KEY);
      localStorage.removeItem(SUPABASE_URL_STORAGE_KEY);
      setSupabaseJwtInput("");
      setSupabaseUrlInput("");
      showSuccessAlert("Reset Selesai", "Kredensial dikembalikan ke konfigurasi default.");
      await reloadFromSupabase();
    } catch (e) {}
  };

  // Filtered lists
  const filteredProjects = data.projects.filter(
    (p) =>
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(projectSearch.toLowerCase()))
  );

  const certificatesList = Array.isArray(data.certificates) ? data.certificates : [];
  const filteredCertificates = certificatesList.filter(
    (c) =>
      c.title.toLowerCase().includes(certSearch.toLowerCase()) ||
      c.issuer.toLowerCase().includes(certSearch.toLowerCase()) ||
      (c.skills && c.skills.some((s) => s.toLowerCase().includes(certSearch.toLowerCase())))
  );

  const filteredSkills = data.skills.filter(
    (s) =>
      s.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
      s.category.toLowerCase().includes(skillSearch.toLowerCase())
  );

  // 1. LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen py-10 sm:py-20 flex items-center justify-center relative z-10 px-4 bg-[#050811]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl space-y-5 sm:space-y-6 relative overflow-hidden backdrop-blur-2xl"
        >
          {/* Subtle Studio Glow Accent */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-indigo-500 to-cyan-500" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-3 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 mx-auto shadow-xl shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Lock className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                Sanity Desk Engine
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Studio Content Manager</h1>
              <p className="text-xs text-slate-400">
                Masukkan PIN Keamanan untuk membuka studio portofolio
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-400" /> PIN Admin
                </span>
                <span className="text-[10px] text-slate-500 font-mono">SHA-256 Protected</span>
              </label>
              <input
                type="password"
                required
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-base text-center tracking-widest transition-all font-mono"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium text-center">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-500/25 transition-all duration-300 cursor-pointer active:scale-95 text-xs sm:text-sm"
            >
              Buka Studio Dashboard
            </button>

            <a
              href="/"
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Portofolio Utama
            </a>
          </form>
        </motion.div>
      </main>
    );
  }

  // 2. SANITY STUDIO WORKSPACE LAYOUT
  return (
    <div className="min-h-screen flex flex-col bg-[#060913] text-slate-100 selection:bg-cyan-500/30">
      {/* Top Studio Navbar */}
      <header className="h-14 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-3 sm:px-6">
        {/* Left: Brand & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors lg:hidden"
            title="Toggle Studio Desk Sidebar"
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-md">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white hidden sm:inline">
              PORTOFOLIO<span className="text-cyan-400 font-mono">STUDIO</span>
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block mx-1" />

          {/* Breadcrumb path */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="hidden sm:inline text-slate-500">Desk</span>
            <span className="hidden sm:inline text-slate-600">/</span>
            <span className="font-semibold text-slate-200 capitalize">
              {activeTab === "groq" ? "Groq AI Engine" : activeTab}
            </span>
          </div>
        </div>

        {/* Right: Actions & Live Indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Database Pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              isSupabaseActive
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            }`}
            title={isSupabaseActive ? "Supabase Cloud Database Terkoneksi" : "Mode Penyimpanan Lokal"}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isSupabaseActive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="hidden md:inline">{isSupabaseActive ? "Supabase Live" : "Local Mode"}</span>
          </div>

          {/* Fast Sync Button */}
          <button
            onClick={async () => {
              await syncWithSupabase();
              showToast("Sinkronisasi database berhasil!", "success");
            }}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Sinkronkan data dengan Supabase Cloud"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Sync Cloud</span>
          </button>

          {/* View Live Portfolio */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 sm:px-3 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-xs font-semibold text-indigo-300 hover:text-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Buka Portofolio di Tab Baru"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Live Web</span>
          </a>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
            title="Kunci / Keluar Studio"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Studio Body: Sidebar Desk + Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Backdrop Overlay */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Desk Navigation Sidebar: Drawer overlay on mobile, static sidebar on lg+ */}
        <aside
          className={`
            fixed lg:static top-0 bottom-0 left-0 z-50 lg:z-20
            w-72 sm:w-80 lg:w-64 xl:w-72 h-full lg:h-auto
            border-r border-slate-800/80 bg-[#070b14] flex flex-col justify-between
            transition-transform duration-300 ease-in-out flex-shrink-0
            ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Mobile Sidebar Close Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800/80 lg:hidden bg-slate-950/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-md">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-white">
                PORTOFOLIO<span className="text-cyan-400 font-mono">STUDIO</span>
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Navigation List */}
          <div className="p-4 space-y-6 overflow-y-auto flex-1">
            {/* CONTENT DOCUMENTS SECTION */}
            <div className="space-y-1.5">
              <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Content Types</span>
                <span>{data.projects.length + certificatesList.length + data.skills.length} Items</span>
              </div>

              {[
                { id: "projects", label: "Projects", icon: FolderCode, count: data.projects.length },
                { id: "certificates", label: "Certificates", icon: Award, count: certificatesList.length },
                { id: "skills", label: "Skills & Tech", icon: Cpu, count: data.skills.length },
                { id: "profile", label: "Profile & Bio", icon: User, badge: "Live" },
                { id: "contact", label: "Contact & Social", icon: Mail, badge: "Live" },
                { id: "map", label: "OpenMap & Lokasi", icon: MapPin, badge: mapForm.enabled ? "Live" : "Off" },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      if (typeof window !== "undefined" && window.innerWidth < 1024) {
                        setIsSidebarOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-indigo-600/20 text-cyan-300 border border-indigo-500/30 font-semibold shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined ? (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                          isActive
                            ? "bg-cyan-500/20 text-cyan-300 font-bold"
                            : "bg-slate-900 text-slate-500"
                        }`}
                      >
                        {item.count}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* STUDIO CONFIGURATION SECTION */}
            <div className="space-y-1.5 pt-4 border-t border-slate-800/60">
              <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Studio Settings
              </div>

              {[
                { id: "groq", label: "Groq AI Engine", icon: Bot, note: "Vision/Chat" },
                { id: "supabase", label: "Supabase Database", icon: Database, note: isSupabaseActive ? "Active" : "Local" },
                { id: "security", label: "Security PIN", icon: KeyRound, note: "SHA-256" },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      if (typeof window !== "undefined" && window.innerWidth < 1024) {
                        setIsSidebarOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-indigo-600/20 text-cyan-300 border border-indigo-500/30 font-semibold shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{item.note}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer User Card */}
          <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-slate-950">
                FA
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-200 leading-none">Fakhri Arya Dzaki</div>
                <div className="text-[10px] text-cyan-400 font-mono">Administrator</div>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </aside>

        {/* Main Document Workspace Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#060913] p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 w-full max-w-full min-w-0">
          {/* Mobile Horizontal Quick Navigation Bar */}
          <div className="flex lg:hidden items-center gap-1.5 pb-2.5 overflow-x-auto no-scrollbar border-b border-slate-800/80 -mx-3.5 px-3.5 sm:-mx-6 sm:px-6">
            {[
              { id: "projects", label: "Projects", icon: FolderCode },
              { id: "certificates", label: "Certificates", icon: Award },
              { id: "skills", label: "Skills", icon: Cpu },
              { id: "profile", label: "Profile", icon: User },
              { id: "contact", label: "Contact", icon: Mail },
              { id: "map", label: "OpenMap", icon: MapPin },
              { id: "supabase", label: "Supabase", icon: Database },
              { id: "groq", label: "Groq AI", icon: Bot },
              { id: "security", label: "Security", icon: KeyRound },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-medium transition-all cursor-pointer flex-shrink-0 ${
                    isActive
                      ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30"
                      : "bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          {/* TAB 1: PROJECTS VIEW */}
          {activeTab === "projects" && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight">
                    <FolderCode className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" /> Projects Management
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">
                    Kelola etalase proyek aplikasi, microservices, dan arsitektur sistem.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProjectId(null);
                    setProjectForm({
                      id: "",
                      title: "",
                      category: "Full Stack Application",
                      subtitle: "",
                      description: "",
                      image: "/images/fechat.png",
                      tags: ["Next.js", "TypeScript", "Tailwind CSS"],
                      features: ["Real-time synchronization", "Modern Dark UI"],
                      status: "Live & Active",
                      accentColor: "from-indigo-500 to-cyan-500",
                    });
                    setTagInputText("");
                    setFeatureInputText("");
                    setProjectAiPrompt("");
                    setIsProjectDrawerOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" /> New Project
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-900/60 border border-slate-800">
                <Search className="w-4 h-4 text-slate-500 ml-2" />
                <input
                  type="text"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder="Cari berdasarkan judul, kategori, atau tech stack..."
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                {projectSearch && (
                  <button
                    onClick={() => setProjectSearch("")}
                    className="p-1 rounded-md text-slate-400 hover:text-white mr-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="group rounded-2xl sm:rounded-3xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-all p-5 sm:p-6 space-y-4 shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Image Thumbnail Preview */}
                      <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[10px] font-semibold text-cyan-300">
                          {proj.category}
                        </div>
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-[10px] font-semibold text-emerald-400">
                          {proj.status}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {proj.title}
                        </h3>
                        {proj.subtitle && <p className="text-xs text-slate-400">{proj.subtitle}</p>}
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>

                      {/* Tag Chips */}
                      {proj.tags && proj.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500">ID: {proj.id}</span>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/25 text-[10px] font-semibold text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
                            title={proj.link}
                          >
                            <ExternalLink className="w-2.5 h-2.5" /> Live
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProjectId(proj.id);
                            setProjectForm(proj);
                            setTagInputText("");
                            setFeatureInputText("");
                            setIsProjectDrawerOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-cyan-400" /> Edit
                        </button>
                        <button
                          onClick={async () => {
                            const confirmed = await showConfirmDialog(
                              "Hapus Proyek?",
                              `Apakah Anda yakin ingin menghapus "${proj.title}"?`,
                              "Ya, Hapus"
                            );
                            if (confirmed) {
                              await deleteProject(proj.id);
                              showToast(`Proyek ${proj.title} dihapus`, "info");
                            }
                          }}
                          className="p-1.5 rounded-xl bg-rose-950/30 border border-rose-800 text-rose-300 hover:bg-rose-900/50 transition-colors cursor-pointer"
                          title="Hapus Proyek"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CERTIFICATES VIEW */}
          {activeTab === "certificates" && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" /> Certificates & Licenses
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">
                    Dokumen sertifikasi resmi dengan auto-scanner OCR Tesseract dan Groq AI.
                  </p>
                </div>
 
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    disabled={isRefreshingDb}
                    onClick={async () => {
                      setIsRefreshingDb(true);
                      try {
                        await reloadFromSupabase();
                        showToast("Daftar sertifikat dimuat ulang dari database!", "success");
                      } catch (err) {
                        showToast("Gagal memuat ulang data", "error");
                      } finally {
                        setIsRefreshingDb(false);
                      }
                    }}
                    className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2.5 rounded-xl font-bold text-xs text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all active:scale-95"
                    title="Muat ulang dan sinkronkan data langsung dari tabel public.certificates Supabase"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshingDb ? "animate-spin" : ""}`} />
                    <span className="inline">Refresh DB</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                      {certificatesList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingCertId(null);
                      setCertForm({
                        id: `cert_${Date.now()}`,
                        title: "",
                        issuer: "",
                        issueDate: "",
                        credentialId: "",
                        credentialUrl: "",
                        image: "",
                        skills: [],
                        description: "",
                      });
                      setCertSkillInputText("");
                      setRawOcrText("");
                      setIsCertDrawerOpen(true);
                    }}
                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> New Certificate
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-900/60 border border-slate-800">
                <Search className="w-4 h-4 text-slate-500 ml-2" />
                <input
                  type="text"
                  value={certSearch}
                  onChange={(e) => setCertSearch(e.target.value)}
                  placeholder="Cari sertifikat berdasarkan judul, penerbit (issuer), atau keahlian..."
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                {certSearch && (
                  <button onClick={() => setCertSearch("")} className="p-1 text-slate-400 hover:text-white mr-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Certificates Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="group rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 p-5 space-y-4 shadow-lg flex flex-col justify-between transition-all"
                  >
                    <div className="space-y-3">
                      {/* Image Preview with Zoom Trigger */}
                      {cert.image && (
                        <div
                          onClick={() => setPreviewCertInModal(cert.image || null)}
                          className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 cursor-zoom-in group/img"
                          title="Klik untuk Zoom Pratinjau Dokumen"
                        >
                          <img
                            src={cert.image}
                            alt={cert.title}
                            className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-[10px] font-semibold text-cyan-300 flex items-center gap-1 shadow-lg">
                              <Eye className="w-3 h-3" /> Zoom Dokumen
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-semibold text-indigo-400">
                          {cert.issuer}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 mt-1">
                          {cert.title}
                        </h3>
                        {cert.issueDate && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" /> {cert.issueDate}
                          </p>
                        )}
                      </div>

                      {cert.credentialId && (
                        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400 truncate">
                          ID: <span className="text-cyan-300">{cert.credentialId}</span>
                        </div>
                      )}

                      {/* Skills */}
                      {cert.skills && cert.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {cert.skills.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-mono text-slate-300"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      {cert.credentialUrl ? (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> Verifikasi
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-500">Internal Cert</span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCertId(cert.id);
                            setCertForm(cert);
                            setCertSkillInputText("");
                            setRawOcrText("");
                            setIsCertDrawerOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit Sertifikat"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                        </button>
                        <button
                          onClick={async () => {
                            const confirmed = await showConfirmDialog(
                              "Hapus Sertifikat?",
                              `Apakah Anda yakin ingin menghapus "${cert.title}"?`,
                              "Ya, Hapus"
                            );
                            if (confirmed) {
                              await deleteCertificate(cert.id);
                              showToast(`Sertifikat ${cert.title} berhasil dihapus`, "info");
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-950/30 border border-rose-800 text-rose-300 hover:bg-rose-900/50 transition-colors cursor-pointer"
                          title="Hapus Sertifikat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS VIEW */}
          {activeTab === "skills" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight">
                    <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" /> Skills & Technical Stack
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">
                    Daftar keahlian, teknologi, dan level kompetensi.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSkillForm({
                      name: "",
                      category: "Frontend",
                      level: "Advanced",
                      desc: "",
                      highlight: false,
                    });
                    setIsSkillDrawerOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" /> New Skill
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between shadow-md"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{skill.name}</span>
                        {skill.highlight && (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-semibold">
                            Top
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        {skill.category} • <span className="text-slate-300">{skill.level}</span>
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        const confirmed = await showConfirmDialog(
                          "Hapus Skill?",
                          `Hapus keahlian ${skill.name}?`,
                          "Ya, Hapus"
                        );
                        if (confirmed) {
                          await deleteSkill(skill.name);
                          showToast(`Skill ${skill.name} dihapus`, "info");
                        }
                      }}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Hapus Skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE VIEW */}
          {activeTab === "profile" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateProfile(profileForm);
                showSuccessAlert("Profil Diperbarui!", "Data profil Fakhri Arya Dzaki berhasil disimpan.");
              }}
              className="max-w-4xl mx-auto p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-950/90 border border-slate-800/90 space-y-4 sm:space-y-6 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-400" /> Profil Utama & Bio Dokumen
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">Informasi personal untuk Hero dan About section.</p>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer transition-all active:scale-95 text-center"
                >
                  Simpan Perubahan
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Nama Lengkap</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Peran Utama</label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Peran Sekunder</label>
                  <input
                    type="text"
                    value={profileForm.subRole}
                    onChange={(e) => setProfileForm({ ...profileForm, subRole: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Sekolah / Institusi</label>
                  <input
                    type="text"
                    value={profileForm.school}
                    onChange={(e) => setProfileForm({ ...profileForm, school: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Tingkat Kelas</label>
                  <input
                    type="text"
                    value={profileForm.grade}
                    onChange={(e) => setProfileForm({ ...profileForm, grade: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Jurusan / Konsentrasi</label>
                  <input
                    type="text"
                    value={profileForm.major}
                    onChange={(e) => setProfileForm({ ...profileForm, major: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Bio Singkat (Hero Section)</label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Detail Lengkap (About Section)</label>
                <textarea
                  rows={4}
                  value={profileForm.aboutDetail}
                  onChange={(e) => setProfileForm({ ...profileForm, aboutDetail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </form>
          )}

          {/* TAB 5: CONTACT VIEW */}
          {activeTab === "contact" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateContact(contactForm);
                showSuccessAlert("Kontak Disimpan!", "Informasi kontak dan tautan sosial media berhasil diperbarui.");
              }}
              className="max-w-4xl mx-auto p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-950/90 border border-slate-800/90 space-y-4 sm:space-y-6 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-indigo-400" /> Kontak & Media Sosial
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">Kelola tautan WhatsApp, Email, GitHub, dan Instagram.</p>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer transition-all active:scale-95 text-center"
                >
                  Simpan Kontak
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email Resmi
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-rose-400" /> URL Instagram
                  </label>
                  <input
                    type="text"
                    value={contactForm.instagram}
                    onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                    placeholder="https://instagram.com/fakhriaryadzaki"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-slate-300" /> URL GitHub
                  </label>
                  <input
                    type="text"
                    value={contactForm.github}
                    onChange={(e) => setContactForm({ ...contactForm, github: e.target.value })}
                    placeholder="https://github.com/fakhriaryadzaki"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-blue-400" /> URL LinkedIn
                  </label>
                  <input
                    type="text"
                    value={contactForm.linkedin}
                    onChange={(e) => setContactForm({ ...contactForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/fakhriaryadzaki"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Nomor WhatsApp (Kode Negara 62)</label>
                  <input
                    type="text"
                    value={contactForm.whatsapp}
                    onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Lokasi Dominan</label>
                  <input
                    type="text"
                    value={contactForm.location}
                    onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* OpenMap Quick Access Card inside Contact Tab */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Integrasi OpenStreetMap (OpenMap)</div>
                    <div className="text-[11px] text-slate-400">
                      Titik saat ini: {mapForm.title} ({mapForm.latitude.toFixed(4)}, {mapForm.longitude.toFixed(4)})
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("map")}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" /> Atur Koordinat & Peta &rarr;
                </button>
              </div>
            </form>
          )}

          {/* TAB: OPENMAP & LOCATION VIEW */}
          {activeTab === "map" && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" /> OpenMap & Lokasi Beranda
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">
                    Atur titik koordinat OpenStreetMap interaktif, judul pin, alamat, dan tema peta.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      mapForm.enabled
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                    }`}
                  >
                    {mapForm.enabled ? "● Tampil di Beranda" : "○ Dinonaktifkan"}
                  </span>

                  <button
                    type="button"
                    onClick={handleSaveMap}
                    className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                  >
                    <Check className="w-4 h-4" /> Simpan Konfigurasi
                  </button>
                </div>
              </div>

              {/* Geocoding Search Bar */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-cyan-400" /> Cari Tempat & Isi Semua Form Otomatis
                  </label>
                  <span className="text-[10px] text-cyan-400 font-mono font-semibold">Auto-Fill All Fields</span>
                </div>
                <form onSubmit={handleSearchLocation} className="flex gap-2">
                  <input
                    type="text"
                    value={mapSearchQuery}
                    onChange={(e) => setMapSearchQuery(e.target.value)}
                    placeholder="Ketik nama gedung, sekolah, atau alamat (contoh: SMKN 71 Jakarta, Monas, Senayan)..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={isSearchingMap}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-md"
                  >
                    <Search className={`w-3.5 h-3.5 ${isSearchingMap ? "animate-spin" : ""}`} />
                    <span>{isSearchingMap ? "Mencari..." : "Cari & Isi Form"}</span>
                  </button>
                </form>

                {/* Multiple Search Results Pill Suggestions */}
                {mapSearchResults.length > 1 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">
                      Pilihan Lokasi Ditemukan (Klik untuk terapkan ke semua form):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {mapSearchResults.map((res, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setMapForm((prev) => ({
                              ...prev,
                              title: res.title,
                              subtitle: res.subtitle,
                              address: res.address,
                              latitude: res.latitude,
                              longitude: res.longitude,
                              zoom: res.zoom || 16,
                            }));
                            showToast(`Semua form terisi otomatis: ${res.title}!`, "success");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/50 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors text-left truncate max-w-xs cursor-pointer flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                          <span className="truncate">{res.title}</span>
                          <span className="text-[10px] text-slate-500">({res.subtitle})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Main Grid: Left Controls + Right Interactive Map Picker */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Form: 5 Cols */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800/90 space-y-4 shadow-xl">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
                      <span>Detail Lokasi Pin</span>
                      <span className="text-[10px] font-mono text-cyan-400">Coords</span>
                    </h3>

                    {/* Quick Preset Buttons */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-slate-400 font-medium">Preset Cepat:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setMapForm((prev) => ({
                              ...prev,
                              latitude: -6.1866,
                              longitude: 106.8708,
                              zoom: 15,
                              title: "SMKN 71 Jakarta",
                              subtitle: "Rekayasa Perangkat Lunak (RPL) & Lab Server",
                              address: "Jl. Rawasari Timur IX No.1, Cempaka Putih, Jakarta Pusat",
                            }))
                          }
                          className="px-2.5 py-1 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800 text-[11px] font-semibold text-indigo-300 transition-colors cursor-pointer"
                        >
                          🏫 SMKN 71 Jakarta
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setMapForm((prev) => ({
                              ...prev,
                              latitude: -6.1754,
                              longitude: 106.8272,
                              zoom: 15,
                              title: "Monumen Nasional (Monas)",
                              subtitle: "Pusat Kota Jakarta",
                              address: "Gambir, Jakarta Pusat, DKI Jakarta",
                            }))
                          }
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 transition-colors cursor-pointer"
                        >
                          🏛️ Monas Jakarta
                        </button>
                        <button
                          type="button"
                          onClick={handleDetectCurrentLocation}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800 text-[11px] font-semibold text-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Compass className="w-3 h-3" /> GPS Saya
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Judul Marker *</label>
                        <input
                          type="text"
                          value={mapForm.title}
                          onChange={(e) => setMapForm({ ...mapForm, title: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Subjudul / Deskripsi Marker</label>
                        <input
                          type="text"
                          value={mapForm.subtitle}
                          onChange={(e) => setMapForm({ ...mapForm, subtitle: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-300">Alamat Lengkap</label>
                          <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                            <span>✨ Terisi otomatis dari peta</span>
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={mapForm.address}
                          onChange={(e) => setMapForm({ ...mapForm, address: e.target.value })}
                          placeholder="Alamat lengkap terisi otomatis saat pin digeser atau dicari..."
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 resize-none"
                        />
                      </div>

                      {/* Lat & Lng Numeric Fields */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-300 font-mono">Latitude</label>
                          <input
                            type="number"
                            step="any"
                            value={mapForm.latitude}
                            onChange={(e) => setMapForm({ ...mapForm, latitude: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-300 font-mono">Longitude</label>
                          <input
                            type="number"
                            step="any"
                            value={mapForm.longitude}
                            onChange={(e) => setMapForm({ ...mapForm, longitude: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      {/* Zoom Slider */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-300">
                          <span>Tingkat Perbesaran (Zoom):</span>
                          <span className="text-cyan-400 font-mono">{mapForm.zoom}x</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="19"
                          step="1"
                          value={mapForm.zoom}
                          onChange={(e) => setMapForm({ ...mapForm, zoom: parseInt(e.target.value, 10) })}
                          className="w-full accent-cyan-400 cursor-pointer"
                        />
                      </div>

                      {/* Theme & Enable Toggles */}
                      <div className="pt-2 border-t border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-semibold text-slate-300">Tema Tampilan Peta</div>
                            <div className="text-[10px] text-slate-500">Dark Matter serasi dengan portofolio</div>
                          </div>
                          <select
                            value={mapForm.theme}
                            onChange={(e) => setMapForm({ ...mapForm, theme: e.target.value as any })}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none font-medium"
                          >
                            <option value="dark">Dark Matter (CartoDB)</option>
                            <option value="osm">Standard OpenStreetMap</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                          <div>
                            <div className="text-xs font-semibold text-slate-300">Tampilkan di Beranda</div>
                            <div className="text-[10px] text-slate-500">Aktifkan/nonaktifkan widget peta di halaman utama</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setMapForm({ ...mapForm, enabled: !mapForm.enabled })}
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                              mapForm.enabled ? "bg-cyan-500 justify-end" : "bg-slate-800 justify-start"
                            }`}
                          >
                            <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSaveMap}
                        className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-500/20 cursor-pointer transition-all active:scale-95 text-center mt-2 flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> Simpan Konfigurasi Peta
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Form: 7 Cols Interactive Studio Map */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800/90 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-cyan-400" /> Pratinjau Interaktif Studio
                      </h3>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Lat: {mapForm.latitude.toFixed(4)} | Lng: {mapForm.longitude.toFixed(4)}
                      </span>
                    </div>

                    {/* Map Picker Component with Auto-Fill on Click/Drag */}
                    <AdminMapPicker
                      latitude={mapForm.latitude}
                      longitude={mapForm.longitude}
                      zoom={mapForm.zoom}
                      title={mapForm.title}
                      theme={mapForm.theme}
                      onLocationChange={(lat, lng) => {
                        setMapForm((prev) => ({
                          ...prev,
                          latitude: lat,
                          longitude: lng,
                        }));
                      }}
                      onLocationDetailsChange={(details) => {
                        setMapForm((prev) => ({
                          ...prev,
                          title: details.title || prev.title,
                          subtitle: details.subtitle || prev.subtitle,
                          address: details.address || prev.address,
                          latitude: details.latitude,
                          longitude: details.longitude,
                        }));
                        showToast(`Alamat lengkap otomatis terisi!`, "success");
                      }}
                      onZoomChange={(newZoom) => {
                        setMapForm((prev) => ({
                          ...prev,
                          zoom: newZoom,
                        }));
                      }}
                    />

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>
                        💡 <strong>Tip:</strong> Klik di mana saja pada peta atau geser pin radar untuk menetapkan koordinat secara langsung.
                      </span>
                      <a
                        href="/#openmap"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1 shrink-0 ml-2 font-medium"
                      >
                        Lihat di Web <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GROQ AI ENGINE CONFIGURATION */}
          {activeTab === "groq" && (
            <div className="max-w-4xl mx-auto p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-950/90 border border-slate-800/90 space-y-4 sm:space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-cyan-400" /> Groq AI Engine Integration
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">
                    Konfigurasi mesin LLM kecepatan tinggi untuk OCR extractor & project generator.
                  </p>
                </div>
                <div className="w-fit px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold font-mono">
                  Groq SDK Ready
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Groq API Key (gsk_...)</span>
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      Dapatkan Key Gratis <ExternalLink className="w-3 h-3" />
                    </a>
                  </label>
                  <input
                    type="password"
                    value={groqApiKey}
                    onChange={(e) => {
                      const val = e.target.value;
                      setGroqApiKey(val);
                      try {
                        localStorage.setItem(GROQ_API_KEY_STORAGE, val);
                      } catch (e) {}
                    }}
                    placeholder="gsk_..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    API Key tersimpan aman di browser Anda dan di-fallback otomatis ke file server .env.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Model Groq AI</label>
                  <select
                    value={groqModel}
                    onChange={(e) => {
                      const val = e.target.value;
                      setGroqModel(val);
                      try {
                        localStorage.setItem(GROQ_MODEL_STORAGE, val);
                      } catch (e) {}
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (Recommended - Ultra Smart)</option>
                    <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Fast & Reliable)</option>
                    <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2 text-xs text-slate-300">
                  <div className="font-bold text-indigo-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Fitur AI Aktif di Portofolio Studio
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>Ekstraksi otomatis ID Kredensial, Lembaga, dan Keahlian dari scan sertifikat OCR.</li>
                    <li>Pembuatan instan arsitektur proyek, fitur-fitur, tags, dan deskripsi dari prompt singkat.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SUPABASE DATABASE VIEW */}
          {activeTab === "supabase" && (
            <div className="max-w-4xl mx-auto p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-950/90 border border-slate-800/90 space-y-4 sm:space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-400" /> Supabase Cloud Database & Storage
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">Manajemen sinkronisasi cloud, reset data, dan skema SQL.</p>
                </div>
                <span
                  className={`w-fit px-3 py-1 rounded-full text-xs font-semibold ${
                    isSupabaseActive
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                  }`}
                >
                  {isSupabaseActive ? "Connected Cloud" : "Local Fallback"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4">
                <button
                  onClick={async () => {
                    await syncWithSupabase();
                    showSuccessAlert("Sinkronisasi Berhasil!", "Seluruh data portofolio berhasil disinkronkan.");
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" /> Sinkronkan Semua ke Cloud
                </button>

                <button
                  onClick={async () => {
                    const confirmed = await showConfirmDialog(
                      "Reset Data ke Default?",
                      "Tindakan ini akan mengembalikan data portofolio ke konfigurasi awal.",
                      "Ya, Reset"
                    );
                    if (confirmed) {
                      await resetToDefault();
                      showSuccessAlert("Reset Selesai", "Data telah dikembalikan ke default.");
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-rose-300 bg-rose-950/40 border border-rose-800 hover:bg-rose-900/60 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  Reset ke Default
                </button>
              </div>

              {/* JWT / Supabase Custom Key Configuration */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-cyan-400" /> Token JWT & Kredensial Supabase
                  </h4>
                  {typeof window !== "undefined" && localStorage.getItem(SUPABASE_JWT_STORAGE_KEY) && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Custom Key Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Simpan Token JWT Supabase (Anon / Service Role Key) khusus langsung di browser tanpa perlu deploy ulang environment variable.
                </p>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Supabase Project URL</label>
                    <input
                      type="text"
                      value={supabaseUrlInput}
                      onChange={(e) => setSupabaseUrlInput(e.target.value)}
                      placeholder="https://xyzcompany.supabase.co"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Token JWT Supabase (Anon Key / Service Key)</span>
                      <span className="text-[10px] text-slate-500 font-mono">Format: eyJhbGci...</span>
                    </label>
                    <textarea
                      rows={2}
                      value={supabaseJwtInput}
                      onChange={(e) => setSupabaseJwtInput(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-500 break-all resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      disabled={isSavingSupabaseJwt}
                      onClick={handleSaveSupabaseCredentials}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {isSavingSupabaseJwt ? "Menyimpan..." : "Simpan Token JWT Supabase"}
                    </button>

                    <button
                      type="button"
                      onClick={handleResetSupabaseCredentials}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      Kembalikan ke Default .env
                    </button>
                  </div>
                </div>
              </div>

              {/* SQL Script Box */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-cyan-400" /> Skema SQL Tabel Sertifikat
                  </h4>
                  <button
                    onClick={() => {
                      const sql = `-- 1. Buat Tabel Certificates jika belum ada
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
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public Insert/Update Certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public Delete Certificates" ON public.certificates;
CREATE POLICY "Public Read Certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update Certificates" ON public.certificates FOR ALL USING (true);
CREATE POLICY "Public Delete Certificates" ON public.certificates FOR DELETE USING (true);
GRANT ALL ON public.certificates TO anon, authenticated, service_role;
NOTIFY pgrst, 'reload schema';`;
                      navigator.clipboard.writeText(sql);
                      showToast("SQL disalin ke clipboard!", "success");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-cyan-400" /> Salin SQL
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300 overflow-x-auto select-all max-h-48">
{`CREATE TABLE IF NOT EXISTS public.certificates (
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
);`}
                </pre>
              </div>

              {/* SQL Script Box for OpenMap */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Skema SQL Kolom OpenMap (contacts)
                  </h4>
                  <button
                    onClick={() => {
                      const sql = `-- Tambah kolom map_config pada tabel contacts
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS map_config JSONB DEFAULT '{"latitude": -6.1866, "longitude": 106.8708, "zoom": 15, "title": "SMKN 71 Jakarta", "subtitle": "Rekayasa Perangkat Lunak (RPL) & Lab Server", "enabled": true, "theme": "dark"}'::jsonb;
NOTIFY pgrst, 'reload schema';`;
                      navigator.clipboard.writeText(sql);
                      showToast("SQL OpenMap disalin ke clipboard!", "success");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-cyan-400" /> Salin SQL OpenMap
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300 overflow-x-auto select-all">
{`-- Tambah kolom map_config pada tabel contacts
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS map_config JSONB DEFAULT '{}'::jsonb;
NOTIFY pgrst, 'reload schema';`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 8: SECURITY PIN & JWT VIEW */}
          {activeTab === "security" && (
            <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
              {/* Form 1: PIN Management */}
              <form
                onSubmit={handleChangePin}
                className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-950/90 border border-slate-800/90 space-y-4 sm:space-y-6 shadow-xl"
              >
                <div className="space-y-1 pb-4 border-b border-slate-800">
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-amber-400" /> Perbarui PIN Keamanan Studio
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">
                    PIN dienkripsi secara lokal & cloud dengan standar SHA-256 Hash.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">PIN Lama</label>
                    <input
                      type="password"
                      required
                      value={currentPinInput}
                      onChange={(e) => setCurrentPinInput(e.target.value)}
                      placeholder="Masukkan PIN saat ini"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 font-mono tracking-widest"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">PIN Baru</label>
                    <input
                      type="password"
                      required
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      placeholder="Minimal 4 karakter"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 font-mono tracking-widest"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Konfirmasi PIN Baru</label>
                    <input
                      type="password"
                      required
                      value={confirmPinInput}
                      onChange={(e) => setConfirmPinInput(e.target.value)}
                      placeholder="Ulangi PIN baru"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 font-mono tracking-widest"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  Simpan & Perbarui PIN
                </button>
              </form>

              {/* Form 2: JWT Session Token Management */}
              <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-950/90 border border-slate-800/90 space-y-4 sm:space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="space-y-1">
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-cyan-400" /> Sesi Token JWT Admin
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">
                      Token otentikasi HMAC-SHA256 tersimpan di browser untuk login otomatis & otorisasi API.
                    </p>
                  </div>
                  <span className="w-fit px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    JWT Active
                  </span>
                </div>

                {/* Active Token Info Box */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-indigo-400" /> Token JWT Sesi Saat Ini
                    </span>
                    {activeJwtToken && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(activeJwtToken);
                          showToast("Token JWT disalin ke clipboard!", "success");
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3 h-3" /> Salin Token
                      </button>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-[10px] sm:text-[11px] font-mono text-cyan-300 break-all select-all max-h-24 overflow-y-auto">
                    {activeJwtToken || "Belum ada token JWT aktif (login ulang untuk membuat token)."}
                  </div>

                  {jwtPayload && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                        <div className="text-slate-500 text-[10px]">ROLE / SUBJECT</div>
                        <div className="text-slate-200 font-bold capitalize">{jwtPayload.role || jwtPayload.sub || "admin"}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                        <div className="text-slate-500 text-[10px]">ISSUED AT</div>
                        <div className="text-slate-200">
                          {jwtPayload.iat ? new Date(jwtPayload.iat * 1000).toLocaleTimeString() : "-"}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                        <div className="text-slate-500 text-[10px]">EXPIRES</div>
                        <div className="text-emerald-400">
                          {jwtPayload.exp ? new Date(jwtPayload.exp * 1000).toLocaleDateString() : "7 Hari"}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleGenerateFreshJwt}
                      className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Generate Token Acak
                    </button>
                    <button
                      type="button"
                      onClick={handleRegenerateRandomSecret}
                      className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                      title="Acak kunci rahasia HMAC-SHA256 256-bit baru secara random"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Acak Secret Key Baru
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Hapus Sesi Token
                    </button>
                  </div>
                </div>

                {/* Custom Token Saver Form */}
                <div className="pt-2 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Simpan / Terapkan Token JWT Kustom</span>
                      <span className="text-[10px] text-slate-500 font-mono">Simpan ke myporto_admin_jwt</span>
                    </label>
                    <textarea
                      rows={2}
                      value={customJwtInput}
                      onChange={(e) => setCustomJwtInput(e.target.value)}
                      placeholder="Paste token JWT kustom Anda di sini..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-500 break-all resize-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveCustomJwt()}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 text-center"
                  >
                    <Check className="w-3.5 h-3.5" /> Simpan Token JWT
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. SANITY-STYLE SLIDE-OVER DRAWER FOR PROJECT INSPECTION */}
      <AnimatePresence>
        {isProjectDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="w-full max-w-2xl h-full bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                      {editingProjectId ? "EDIT DOCUMENT" : "NEW DOCUMENT"}
                    </span>
                    <span className="text-xs text-slate-500">projects.schema.json</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {projectForm.title || "Untitled Project"}
                  </h3>
                </div>

                <button
                  onClick={() => setIsProjectDrawerOpen(false)}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Scroll */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* GROQ AI ASSISTANT EXPANDER */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2.5 sm:space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Groq AI Prompt-to-Project
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">{groqModel}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Ketik konsep atau ide proyek, AI akan mengisi judul, fitur, tags, dan deskripsi secara instan.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={projectAiPrompt}
                      onChange={(e) => setProjectAiPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleGenerateProjectAi();
                        }
                      }}
                      placeholder="Contoh: Aplikasi POS pintar minimarket berbasis Next.js..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      disabled={isGeneratingProjectAi}
                      onClick={handleGenerateProjectAi}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isGeneratingProjectAi ? "animate-spin" : ""}`} />
                      {isGeneratingProjectAi ? "AI..." : "Generate"}
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Judul Proyek *</label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          const newSlug = generateProjectSlug(newTitle);
                          const shouldAutoUpdateId = !editingProjectId || !projectForm.id || projectForm.id === generateProjectSlug(projectForm.title);
                          setProjectForm({
                            ...projectForm,
                            title: newTitle,
                            ...(shouldAutoUpdateId ? { id: newSlug } : {}),
                          });
                        }}
                        placeholder="Contoh: Fechat, ARYANOKOS, ARYASHOP"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Hash className="w-3.5 h-3.5 text-cyan-400" />
                          ID Proyek (Slug) *
                        </label>
                        <span className="text-[10px] text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                          Auto-generated
                        </span>
                      </div>
                      <input
                        type="text"
                        value={projectForm.id}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            id: generateProjectSlug(e.target.value),
                          })
                        }
                        placeholder="otomatis-dari-judul"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
                      />
                      <p className="text-[10px] text-slate-500">
                        Otomatis sama persis dari judul proyek (contoh: <code className="text-cyan-400 font-mono">fechat</code>, <code className="text-cyan-400 font-mono">aryanokos</code>).
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Kategori</label>
                      <input
                        type="text"
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Slogan / Subtitle</label>
                      <input
                        type="text"
                        value={projectForm.subtitle}
                        onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      URL Website / Demo
                      <span className="text-slate-500 font-normal">(opsional)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={projectForm.link || ""}
                        onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                        placeholder="https://example.com"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-500 placeholder-slate-600"
                      />
                      {projectForm.link && (
                        <a
                          href={projectForm.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-600/40 transition-colors"
                          title="Buka URL"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Deskripsi Arsitektur</label>
                    <textarea
                      rows={3}
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  {/* Asset Image Upload */}
                  <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-cyan-400" /> Asset Gambar Proyek
                      </span>
                      {uploadingImage && <span className="text-cyan-400 text-xs animate-pulse">Mengunggah...</span>}
                    </label>

                    <div className="flex gap-2">
                      <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-cyan-400" /> Pilih File
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                      <input
                        type="text"
                        value={projectForm.image || ""}
                        onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                        placeholder="/images/fechat.png atau URL"
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none"
                      />
                    </div>

                    {projectForm.image && (
                      <div className="relative h-28 w-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                        <img src={projectForm.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Interactive Tags Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Tech Stack / Tags</label>
                    <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 min-h-[42px] items-center">
                      {projectForm.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-cyan-300 border border-indigo-500/30 text-[11px] font-mono flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() =>
                              setProjectForm({
                                ...projectForm,
                                tags: projectForm.tags.filter((_, i) => i !== idx),
                              })
                            }
                            className="hover:text-rose-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={tagInputText}
                        onChange={(e) => setTagInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            const val = tagInputText.trim();
                            if (val && !projectForm.tags.includes(val)) {
                              setProjectForm({ ...projectForm, tags: [...projectForm.tags, val] });
                              setTagInputText("");
                            }
                          }
                        }}
                        placeholder="Ketik tag lalu tekan Enter..."
                        className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none min-w-[120px] px-1"
                      />
                    </div>
                  </div>

                  {/* Interactive Features Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Fitur-Fitur Utama</label>
                    <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 min-h-[42px] items-center">
                      {projectForm.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-[11px] flex items-center gap-1"
                        >
                          {feat}
                          <button
                            type="button"
                            onClick={() =>
                              setProjectForm({
                                ...projectForm,
                                features: projectForm.features.filter((_, i) => i !== idx),
                              })
                            }
                            className="hover:text-rose-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={featureInputText}
                        onChange={(e) => setFeatureInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = featureInputText.trim();
                            if (val && !projectForm.features.includes(val)) {
                              setProjectForm({ ...projectForm, features: [...projectForm.features, val] });
                              setFeatureInputText("");
                            }
                          }
                        }}
                        placeholder="Ketik fitur lalu tekan Enter..."
                        className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none min-w-[120px] px-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-3.5 sm:p-4 px-4 sm:px-6 border-t border-slate-800 bg-slate-900/90 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsProjectDrawerOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white text-center"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const finalId = generateProjectSlug(projectForm.id || projectForm.title) || `project-${Date.now()}`;
                    const finalizedProject = { ...projectForm, id: finalId };
                    if (editingProjectId) {
                      await updateProject(editingProjectId, finalizedProject);
                      showSuccessAlert("Proyek Disimpan!", `Proyek "${projectForm.title}" berhasil diperbarui.`);
                    } else {
                      await addProject(finalizedProject);
                      showSuccessAlert("Proyek Dibuat!", `Proyek "${projectForm.title}" (ID: ${finalId}) berhasil ditambahkan.`);
                    }
                    setIsProjectDrawerOpen(false);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1.5"
                >
                  Simpan & Publikasikan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. SANITY-STYLE SLIDE-OVER DRAWER FOR CERTIFICATE INSPECTION */}
      <AnimatePresence>
        {isCertDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="w-full max-w-2xl h-full bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                      {editingCertId ? "EDIT DOCUMENT" : "NEW DOCUMENT"}
                    </span>
                    <span className="text-xs text-slate-500">certificates.schema.json</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {certForm.title || "Untitled Certificate"}
                  </h3>
                </div>

                <button
                  onClick={() => setIsCertDrawerOpen(false)}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Scroll */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* OCR SCANNING ACTIVE BAR */}
                {isOcrProcessing && (
                  <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-2.5 animate-pulse">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-cyan-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" /> {ocrStatusText}
                      </span>
                      <span className="font-mono text-cyan-300 font-bold">{ocrProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-300 rounded-full"
                        style={{ width: `${ocrProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* CERTIFICATE IMAGE & SCANNER PANEL */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Scan className="w-4 h-4 text-cyan-400" /> Upload Dokumen & Auto OCR
                    </span>
                    {uploadingCertImage && <span className="text-cyan-400 text-xs animate-pulse">Uploading...</span>}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer flex items-center justify-center gap-2 transition-colors">
                      <Upload className="w-4 h-4 text-cyan-400" /> Upload Scan Sertifikat
                      <input type="file" accept="image/*" onChange={handleCertImageUpload} className="hidden" />
                    </label>

                    {certForm.image && (
                      <button
                        type="button"
                        disabled={isOcrProcessing}
                        onClick={() => runOcrOnCertificate(certForm.image!)}
                        className="px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        {isOcrProcessing ? "Memindai..." : "Scan Ulang OCR"}
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={certForm.image || ""}
                    onChange={(e) => setCertForm({ ...certForm, image: e.target.value })}
                    placeholder="URL gambar atau path Supabase"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none"
                  />

                  {certForm.image && (
                    <div className="relative h-32 w-48 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mt-2">
                      <img src={certForm.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Judul Sertifikat *</label>
                      <input
                        type="text"
                        required
                        value={certForm.title}
                        onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Lembaga Penerbit (Issuer) *</label>
                      <input
                        type="text"
                        required
                        value={certForm.issuer}
                        onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Tanggal / Tahun Terbit</label>
                      <input
                        type="text"
                        value={certForm.issueDate}
                        onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">ID / Nomor Kredensial</label>
                      <input
                        type="text"
                        value={certForm.credentialId || ""}
                        onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Tautan Verifikasi Kredensial</label>
                    <input
                      type="url"
                      value={certForm.credentialUrl || ""}
                      onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Interactive Skills Chip Field */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Keahlian Terkait (Skills)</label>
                    <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 min-h-[42px] items-center">
                      {(certForm.skills || []).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-cyan-300 border border-indigo-500/30 text-[11px] font-mono flex items-center gap-1"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() =>
                              setCertForm({
                                ...certForm,
                                skills: (certForm.skills || []).filter((_, i) => i !== idx),
                              })
                            }
                            className="hover:text-rose-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={certSkillInputText}
                        onChange={(e) => setCertSkillInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            const val = certSkillInputText.trim();
                            if (val && !(certForm.skills || []).includes(val)) {
                              setCertForm({
                                ...certForm,
                                skills: [...(certForm.skills || []), val],
                              });
                              setCertSkillInputText("");
                            }
                          }
                        }}
                        placeholder="Ketik skill lalu tekan Enter..."
                        className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none min-w-[120px] px-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Deskripsi / Materi Singkat</label>
                    <textarea
                      rows={3}
                      value={certForm.description || ""}
                      onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-3.5 sm:p-4 px-4 sm:px-6 border-t border-slate-800 bg-slate-900/90 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsCertDrawerOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white text-center"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!certForm.title || !certForm.issuer) {
                      showErrorAlert("Data Kurang", "Judul dan lembaga penerbit wajib diisi.");
                      return;
                    }

                    const finalCert: CertificateItem = {
                      ...certForm,
                      id: certForm.id || `cert_${Date.now()}`,
                      skills: certForm.skills || [],
                    };

                    if (editingCertId) {
                      await updateCertificate(editingCertId, finalCert);
                      showSuccessAlert("Sertifikat Disimpan!", `Sertifikat "${finalCert.title}" berhasil diperbarui.`);
                    } else {
                      await addCertificate(finalCert);
                      showSuccessAlert("Sertifikat Ditambahkan!", `Sertifikat "${finalCert.title}" berhasil ditambahkan.`);
                    }
                    setIsCertDrawerOpen(false);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1.5"
                >
                  Simpan & Publikasikan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. SLIDE-OVER DRAWER FOR SKILL INSPECTION */}
      <AnimatePresence>
        {isSkillDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="w-full max-w-md h-full bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                <h3 className="text-sm sm:text-base font-bold text-white">Tambah Technical Skill</h3>
                <button onClick={() => setIsSkillDrawerOpen(false)} className="p-1.5 sm:p-2 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Nama Skill</label>
                  <input
                    type="text"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    placeholder="Contoh: Docker, Kubernetes, Next.js"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Kategori</label>
                  <select
                    value={skillForm.category}
                    onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="DevOps & Server">DevOps & Server</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Tingkat Kemampuan</label>
                  <select
                    value={skillForm.level}
                    onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 px-4 sm:px-6 border-t border-slate-800 bg-slate-900/90 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsSkillDrawerOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white text-center"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (skillForm.name) {
                      await addSkill(skillForm);
                      showSuccessAlert("Keahlian Ditambahkan!", `Stack ${skillForm.name} berhasil disimpan.`);
                      setIsSkillDrawerOpen(false);
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer text-center"
                >
                  Simpan Skill
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. MODAL PREVIEW IMAGE VIEWER FOR ADMIN */}
      <AnimatePresence>
        {previewCertInModal && (
          <div
            onClick={() => setPreviewCertInModal(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-3 sm:space-y-4 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-400" /> Pratinjau Dokumen Sertifikat
                </h3>
                <button
                  onClick={() => setPreviewCertInModal(null)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ImageViewer
                src={previewCertInModal}
                alt="Certificate Full Document"
                originalUrl={previewCertInModal}
                heightClassName="h-60 sm:h-[480px]"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
