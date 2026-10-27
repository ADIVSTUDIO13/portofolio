import { createClient, SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://dffphjdyrgztoqjwojtg.supabase.co";

const DEFAULT_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZnBoamR5cmd6dG9xandvanRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODU5MjU0MCwiZXhwIjoyMTA0MTY4NTQwfQ.dvl_OjTNFpvcZXZ_BrHaAelf2LGNwHVpkmSBt3aGQ6o";

let clientInstance: SupabaseClient | null = null;
let lastKey = "";
let lastUrl = "";

export function getActiveSupabaseCredentials() {
  let url = DEFAULT_URL;
  let key = DEFAULT_KEY;
  if (typeof window !== "undefined") {
    try {
      const savedKey = localStorage.getItem("myporto_supabase_jwt");
      if (savedKey && savedKey.trim().length > 20) {
        key = savedKey.trim();
      }
      const savedUrl = localStorage.getItem("myporto_supabase_url");
      if (savedUrl && savedUrl.trim().startsWith("https://")) {
        url = savedUrl.trim();
      }
    } catch (e) {}
  }
  return { url, key };
}

export function getActiveSupabaseClient(): SupabaseClient | null {
  const { url, key } = getActiveSupabaseCredentials();
  if (!url || !key || !url.startsWith("https://")) return null;
  if (!clientInstance || lastKey !== key || lastUrl !== url) {
    clientInstance = createClient(url, key);
    lastKey = key;
    lastUrl = url;
  }
  return clientInstance;
}

export const isSupabaseConfigured = true;

// Proxy export so existing imports `supabase.from(...)` automatically use the active dynamic client
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getActiveSupabaseClient();
    if (!client) return undefined;
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
