"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Compass,
  ExternalLink,
  Copy,
  Check,
  Layers,
  Sparkles,
  Maximize2,
  Navigation,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { loadLeaflet, createGlowingRadarIcon } from "@/lib/leafletLoader";
import { showToast } from "@/lib/swal";

export default function OpenMap() {
  const { data } = usePortfolio();
  const mapConfig = data.map || {
    latitude: -6.1866,
    longitude: 106.8708,
    zoom: 15,
    title: "SMKN 71 Jakarta",
    subtitle: "Rekayasa Perangkat Lunak (RPL) & Lab Server",
    address: "Jl. Rawasari Timur IX No.1, Cempaka Putih, Jakarta Pusat, DKI Jakarta 10570",
    enabled: true,
    theme: "dark",
  };

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<"dark" | "osm">(mapConfig.theme || "dark");
  const [copied, setCopied] = useState(false);

  // Sync theme when mapConfig updates
  useEffect(() => {
    if (mapConfig.theme && mapConfig.theme !== currentTheme) {
      setCurrentTheme(mapConfig.theme);
    }
  }, [mapConfig.theme]);

  // Initialize and update Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;

      try {
        const L = await loadLeaflet();
        if (!isMounted || !mapContainerRef.current) return;

        const { latitude, longitude, zoom, title, subtitle, address } = mapConfig;

        // Clean up previous instance if exists
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Initialize Map
        const map = L.map(mapContainerRef.current, {
          center: [latitude, longitude],
          zoom: zoom || 15,
          zoomControl: false, // Custom controls
          attributionControl: false,
        });
        mapInstanceRef.current = map;

        // Custom Attribution control in bottom-right
        L.control
          .attribution({
            position: "bottomright",
            prefix: false,
          })
          .addAttribution(
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" style="color: #94a3b8;">OpenStreetMap</a> contributors'
          )
          .addTo(map);

        // Tile layer setup: CartoDB Dark Matter or OSM Standard (Tanpa API Key)
        const tileUrl =
          currentTheme === "dark"
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

        const tileLayer = L.tileLayer(tileUrl, {
          maxZoom: 19,
          subdomains: currentTheme === "dark" ? "abcd" : "abc",
        }).addTo(map);

        tileLayer.on("tileerror", () => {
          // If dark tiles fail, smoothly fallback to OSM Standard tiles
          if (currentTheme === "dark") {
            setCurrentTheme("osm");
          }
        });
        tileLayerRef.current = tileLayer;

        // Custom Glowing Radar Marker
        const customIcon = createGlowingRadarIcon(L, title);
        const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
        markerRef.current = marker;

        // Custom Styled Popup
        const popupContent = `
          <div style="font-family: inherit; padding: 6px 2px; min-width: 210px; color: #f8fafc;">
            <div style="display: flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px;">
              <span>📍</span> Titik Lokasi
            </div>
            <div style="font-size: 14px; font-weight: 800; color: #ffffff; line-height: 1.3; margin-bottom: 3px;">
              ${title || "SMKN 71 Jakarta"}
            </div>
            <div style="font-size: 11px; color: #94a3b8; line-height: 1.4; margin-bottom: 8px;">
              ${subtitle || address || ""}
            </div>
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px; display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 10px; font-family: monospace; color: #64748b;">
                ${latitude.toFixed(4)}, ${longitude.toFixed(4)}
              </span>
              <a href="https://www.openstreetmap.org/directions?to=${latitude},${longitude}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; font-weight: 600; color: #38bdf8; text-decoration: none;">
                Arah Jalan &rarr;
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          className: "custom-osm-dark-popup",
          closeButton: false,
          offset: [0, -10],
        });

        // Open popup by default after slight delay
        setTimeout(() => {
          if (isMounted && marker) {
            marker.openPopup();
          }
        }, 600);

        setIsLoading(false);
      } catch (err) {
        console.error("Leaflet map initialization failed", err);
        setIsLoading(false);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapConfig.latitude, mapConfig.longitude, mapConfig.zoom, currentTheme]);

  if (mapConfig.enabled === false) {
    return null;
  }

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [mapConfig.latitude, mapConfig.longitude],
        mapConfig.zoom || 15,
        { duration: 1.2 }
      );
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }
  };

  const handleCopyCoords = () => {
    const coordStr = `${mapConfig.latitude.toFixed(6)}, ${mapConfig.longitude.toFixed(6)}`;
    navigator.clipboard.writeText(coordStr);
    setCopied(true);
    showToast(`Koordinat disalin: ${coordStr}`, "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTheme = () => {
    const next = currentTheme === "dark" ? "osm" : "dark";
    setCurrentTheme(next);
  };

  const osmExternalUrl = `https://www.openstreetmap.org/?mlat=${mapConfig.latitude}&mlon=${mapConfig.longitude}#map=${mapConfig.zoom || 15}/${mapConfig.latitude}/${mapConfig.longitude}`;

  return (
    <div className="w-full relative mt-8 sm:mt-12">
      {/* Container Box */}
      <div className="glass-panel p-3.5 sm:p-5 rounded-2xl relative overflow-hidden border border-white/[0.08] shadow-xl">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/10 text-slate-300 text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                OpenStreetMap Node
              </span>
              <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
                Lat: {mapConfig.latitude.toFixed(4)} • Lng: {mapConfig.longitude.toFixed(4)}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>{mapConfig.title || "SMKN 71 Jakarta"}</span>
            </h3>
            {mapConfig.address && (
              <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">
                {mapConfig.address}
              </p>
            )}
          </div>

          {/* Quick Actions Header Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title={currentTheme === "dark" ? "Ganti ke tema OpenStreetMap Standar" : "Ganti ke tema Dark Matter"}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{currentTheme === "dark" ? "Dark Map" : "OSM Standard"}</span>
            </button>

            {/* Recenter Button */}
            <button
              onClick={handleRecenter}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Pusatkan kembali peta ke titik marker"
            >
              <Compass className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Pusatkan</span>
            </button>

            {/* Copy Coordinates Button */}
            <button
              onClick={handleCopyCoords}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Salin Koordinat Latitude & Longitude"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{copied ? "Tersalin" : "Koordinat"}</span>
            </button>

            {/* Open in OpenStreetMap Link */}
            <a
              href={osmExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              title="Buka peta lengkap di situs OpenStreetMap.org"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">OpenStreetMap</span>
            </a>
          </div>
        </div>

        {/* Map Viewport Area */}
        <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[400px] rounded-xl overflow-hidden border border-white/[0.08] bg-slate-950 z-0">
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm gap-2.5">
              <div className="w-7 h-7 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
              <span className="text-xs font-mono text-slate-400">Memuat peta...</span>
            </div>
          )}

          {/* Leaflet DOM Node Target */}
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Floating In-Map Zoom Controls (Bottom-Left) */}
          <div className="absolute bottom-3 left-3 z-[400] flex flex-col gap-1.5 shadow-lg">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-white font-bold text-base flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-white font-bold text-base flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              title="Zoom Out"
            >
              &minus;
            </button>
          </div>

          {/* Floating In-Map Directions Shortcut Pill (Top-Right) */}
          <div className="absolute top-3 right-3 z-[400]">
            <a
              href={`https://www.openstreetmap.org/directions?to=${mapConfig.latitude},${mapConfig.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-200 hover:text-white backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all group cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              <span>Petunjuk Arah</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
