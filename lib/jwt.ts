/**
 * JWT Utility for Antigravity Portfolio Studio Admin
 * Generates cryptographically secure random secrets and standard HMAC-SHA256 JWT tokens.
 */

export interface JwtPayload {
  sub?: string;
  user?: string;
  role?: string;
  jti?: string;
  nonce?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

export const JWT_SECRET_STORAGE_KEY = "myporto_jwt_secret_v2";

/**
 * Generate cryptographically secure random hexadecimal string
 */
export function generateRandomHex(bytesCount: number = 32): string {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint8Array(bytesCount);
    crypto.getRandomValues(array);
    return Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Fallback if crypto.getRandomValues is unavailable
  let result = "";
  for (let i = 0; i < bytesCount * 2; i++) {
    result += Math.floor(Math.random() * 16).toString(16);
  }
  return result;
}

/**
 * Generate a fresh cryptographically random 256-bit secret key (64 hex characters)
 */
export function generateRandomSecret(): string {
  return generateRandomHex(32);
}

// In-memory fallback for SSR/server contexts
let serverMemorySecret: string | null = null;

/**
 * Get the active JWT Secret: reads persisted random secret from localStorage,
 * or generates and persists a new random secret on first run.
 */
export function getJwtSecret(): string {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(JWT_SECRET_STORAGE_KEY);
      if (stored && stored.trim().length >= 32) {
        return stored.trim();
      }
      const newRandomSecret = generateRandomSecret();
      localStorage.setItem(JWT_SECRET_STORAGE_KEY, newRandomSecret);
      return newRandomSecret;
    } catch {
      // localStorage disabled/restricted
    }
  }

  if (!serverMemorySecret) {
    serverMemorySecret = generateRandomSecret();
  }
  return serverMemorySecret;
}

/**
 * Force regenerate a brand new random secret (invalidates previously issued tokens)
 */
export function regenerateJwtSecret(): string {
  const newSecret = generateRandomSecret();
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(JWT_SECRET_STORAGE_KEY, newSecret);
    } catch {}
  }
  serverMemorySecret = newSecret;
  return newSecret;
}

function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("Illegal base64url string!");
  }
  return atob(output);
}

// Compute HMAC-SHA256 signature in browser/node environment
async function hmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  const hashArray = Array.from(new Uint8Array(signature));
  const binaryString = String.fromCharCode(...hashArray);
  return base64UrlEncode(binaryString);
}

/**
 * Generate a valid JWT token string with cryptographically random ID and nonce
 */
export async function createAdminJwt(
  payload: JwtPayload,
  expiresInSeconds: number = 7 * 24 * 60 * 60, // 7 days
  secret?: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const activeSecret = secret || getJwtSecret();
  const header = { alg: "HS256", typ: "JWT" };
  const fullPayload: JwtPayload = {
    jti: generateRandomHex(16),
    nonce: generateRandomHex(8),
    iat: now,
    exp: now + expiresInSeconds,
    sub: "admin",
    role: "admin",
    user: "Fakhri Arya Dzaki",
    ...payload,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = await hmacSha256(`${encodedHeader}.${encodedPayload}`, activeSecret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify and decode a JWT token string
 */
export async function verifyAdminJwt(
  token: string,
  secret?: string
): Promise<{ valid: boolean; payload?: JwtPayload; error?: string }> {
  try {
    if (!token || typeof token !== "string") {
      return { valid: false, error: "Token tidak ada atau tidak valid." };
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false, error: "Format token JWT tidak sesuai (harus 3 bagian)." };
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const activeSecret = secret || getJwtSecret();
    const expectedSignature = await hmacSha256(`${encodedHeader}.${encodedPayload}`, activeSecret);

    if (signature !== expectedSignature) {
      return { valid: false, error: "Tanda tangan digital (signature) JWT tidak valid." };
    }

    const payloadJson = base64UrlDecode(encodedPayload);
    const payload: JwtPayload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: "Token JWT telah kedaluwarsa (expired)." };
    }

    return { valid: true, payload };
  } catch (e: any) {
    return { valid: false, error: e?.message || "Gagal memverifikasi token JWT." };
  }
}

/**
 * Parse JWT payload without verification (for inspection)
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    return null;
  }
}
