"use client";

// Global singleton promise to prevent duplicate injection
let leafletLoadingPromise: Promise<any> | null = null;

export function loadLeaflet(): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Leaflet cannot run on server"));
  }

  // Already loaded in window
  if ((window as any).L && typeof (window as any).L.map === "function") {
    return Promise.resolve((window as any).L);
  }

  if (leafletLoadingPromise) {
    return leafletLoadingPromise;
  }

  leafletLoadingPromise = new Promise((resolve, reject) => {
    // 1. Inject Leaflet CSS if not already present
    const cssId = "leaflet-stylesheet-cdn";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }

    // 2. Inject Leaflet JS if not already present
    const scriptId = "leaflet-script-cdn";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.async = true;

      script.onload = () => {
        if ((window as any).L) {
          resolve((window as any).L);
        } else {
          reject(new Error("Leaflet loaded but L is not defined"));
        }
      };

      script.onerror = () => {
        leafletLoadingPromise = null;
        reject(new Error("Failed to load Leaflet script from CDN"));
      };

      document.body.appendChild(script);
    } else {
      // Script tag exists, wait for L to be available
      const interval = setInterval(() => {
        if ((window as any).L) {
          clearInterval(interval);
          resolve((window as any).L);
        }
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
        if ((window as any).L) {
          resolve((window as any).L);
        } else {
          leafletLoadingPromise = null;
          reject(new Error("Timeout waiting for Leaflet to initialize"));
        }
      }, 5000);
    }
  });

  return leafletLoadingPromise;
}

// Custom Architectural Radar Pin Icon for dark themes
export function createGlowingRadarIcon(L: any, label = "SMKN 71 Jakarta") {
  return L.divIcon({
    className: "custom-radar-marker",
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <!-- Subtle pulsing radar ring -->
        <span style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background: rgba(99, 102, 241, 0.2); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <span style="position: absolute; width: 65%; height: 65%; border-radius: 9999px; background: rgba(99, 102, 241, 0.3);"></span>
        <!-- Central core -->
        <div style="position: relative; z-index: 10; width: 18px; height: 18px; border-radius: 9999px; background: #4f46e5; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center;">
          <div style="width: 4px; height: 4px; border-radius: 9999px; background: #ffffff;"></div>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}
