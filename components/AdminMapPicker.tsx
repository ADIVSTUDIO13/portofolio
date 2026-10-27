"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadLeaflet, createGlowingRadarIcon } from "@/lib/leafletLoader";
import { Compass, Layers, MousePointerClick } from "lucide-react";

interface AdminMapPickerProps {
  latitude: number;
  longitude: number;
  zoom: number;
  title: string;
  theme: "dark" | "osm";
  cartoApiKey?: string;
  onLocationChange: (lat: number, lng: number) => void;
  onLocationDetailsChange?: (details: {
    title: string;
    subtitle: string;
    address: string;
    latitude: number;
    longitude: number;
    zoom?: number;
  }) => void;
  onZoomChange?: (zoom: number) => void;
}

export default function AdminMapPicker({
  latitude,
  longitude,
  zoom,
  title,
  theme,
  onLocationChange,
  onLocationDetailsChange,
  onZoomChange,
}: AdminMapPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [mapTheme, setMapTheme] = useState<"dark" | "osm">(theme || "dark");

  const onLocationChangeRef = useRef(onLocationChange);
  const onLocationDetailsChangeRef = useRef(onLocationDetailsChange);
  const onZoomChangeRef = useRef(onZoomChange);

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
    onLocationDetailsChangeRef.current = onLocationDetailsChange;
    onZoomChangeRef.current = onZoomChange;
  });

  useEffect(() => {
    setMapTheme(theme);
  }, [theme]);

  // Reverse geocoding helper to auto-fill title, subtitle, and full address
  const fetchAddressDetails = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(`/api/geocode?lat=${lat}&lon=${lng}`);
      if (res.ok) {
        const data = await res.json();
        if (data.result && onLocationDetailsChangeRef.current) {
          onLocationDetailsChangeRef.current(data.result);
        }
      }
    } catch (e) {
      console.warn("Reverse geocode failed", e);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!containerRef.current) return;

      try {
        const L = await loadLeaflet();
        if (!isMounted || !containerRef.current) return;

        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        const map = L.map(containerRef.current, {
          center: [latitude, longitude],
          zoom: zoom || 15,
          zoomControl: false,
          attributionControl: false,
        });
        mapRef.current = map;

        // Custom Attribution control
        L.control
          .attribution({ position: "bottomright", prefix: false })
          .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" style="color: #64748b;">OSM</a>')
          .addTo(map);

        // Tile layer setup: CartoDB Dark Matter or OSM Standard (Tanpa API Key)
        const tileUrl =
          mapTheme === "dark"
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

        const tileLayer = L.tileLayer(tileUrl, {
          maxZoom: 19,
          subdomains: mapTheme === "dark" ? "abcd" : "abc",
        }).addTo(map);

        tileLayer.on("tileerror", () => {
          if (mapTheme === "dark") {
            setMapTheme("osm");
          }
        });
        tileLayerRef.current = tileLayer;

        // Draggable Marker
        const icon = createGlowingRadarIcon(L, title);
        const marker = L.marker([latitude, longitude], {
          icon,
          draggable: true,
        }).addTo(map);
        markerRef.current = marker;

        // Popup tooltip
        marker.bindPopup(
          `<div style="color: #ffffff; font-size: 11px; font-weight: 700; text-align: center;">
            📍 ${title || "Titik Terpilih"}
            <div style="font-size: 9px; color: #94a3b8; font-weight: 400; margin-top: 2px;">
              Semua form otomatis terisi saat pin digeser / diklik
            </div>
          </div>`,
          { className: "custom-osm-dark-popup", closeButton: false }
        );

        // Dragend event - Otomatis isi koordinat dan alamat lengkap
        marker.on("dragend", (e: any) => {
          const lat = e.target.getLatLng().lat;
          const lng = e.target.getLatLng().lng;
          if (onLocationChangeRef.current) {
            onLocationChangeRef.current(lat, lng);
          }
          fetchAddressDetails(lat, lng);
        });

        // Click on map to reposition marker - Otomatis isi koordinat dan alamat lengkap
        map.on("click", (e: any) => {
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;
          marker.setLatLng([lat, lng]);
          if (onLocationChangeRef.current) {
            onLocationChangeRef.current(lat, lng);
          }
          fetchAddressDetails(lat, lng);
        });

        // Zoom event
        map.on("zoomend", () => {
          if (onZoomChangeRef.current) {
            onZoomChangeRef.current(map.getZoom());
          }
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Admin map picker init failed", err);
        setIsLoading(false);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync marker and center when coordinates prop change from external inputs
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const currentPos = markerRef.current.getLatLng();
      const dist = Math.abs(currentPos.lat - latitude) + Math.abs(currentPos.lng - longitude);
      if (dist > 0.00001) {
        markerRef.current.setLatLng([latitude, longitude]);
        mapRef.current.flyTo([latitude, longitude], zoom || mapRef.current.getZoom(), {
          duration: 0.8,
        });
      }
    }
  }, [latitude, longitude, zoom]);

  // Sync tile layer when mapTheme changes
  useEffect(() => {
    if (mapRef.current && (window as any).L) {
      const L = (window as any).L;
      if (tileLayerRef.current) {
        mapRef.current.removeLayer(tileLayerRef.current);
      }
      const tileUrl =
        mapTheme === "dark"
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

      tileLayerRef.current = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: mapTheme === "dark" ? "abcd" : "abc",
      }).addTo(mapRef.current);
    }
  }, [mapTheme]);

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo([latitude, longitude], zoom || 15, { duration: 0.8 });
    }
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[460px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-cyan-300">Memuat Map Studio...</span>
        </div>
      )}

      {/* Map DOM Element */}
      <div ref={containerRef} className="w-full h-full cursor-crosshair z-0" />

      {/* Top Banner Guide Pill */}
      <div className="absolute top-3 left-3 z-[400] pointer-events-none flex flex-col gap-1.5">
        <div className="px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 shadow-lg">
          <MousePointerClick className="w-3.5 h-3.5 text-cyan-400" />
          <span>Klik peta atau geser pin untuk set koordinat</span>
        </div>
        {isReverseGeocoding && (
          <div className="px-2.5 py-1 rounded-xl bg-cyan-950/90 backdrop-blur-md border border-cyan-500/50 text-[10px] font-bold text-cyan-300 flex items-center gap-1.5 shadow-xl animate-pulse">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span>Mengisi otomatis alamat lengkap dari titik peta...</span>
          </div>
        )}
      </div>

      {/* Floating Control Buttons (Top-Right) */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-1.5 shadow-lg">
        {/* Recenter Button */}
        <button
          type="button"
          onClick={handleRecenter}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Pusatkan kembali ke koordinat saat ini"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={() => setMapTheme((prev) => (prev === "dark" ? "osm" : "dark"))}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title={mapTheme === "dark" ? "Ubah ke tema OSM Standard" : "Ubah ke tema Dark Matter"}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
        </button>
      </div>

      {/* Floating Zoom Buttons (Bottom-Left) */}
      <div className="absolute bottom-3 left-3 z-[400] flex flex-col gap-1.5 shadow-lg">
        <button
          type="button"
          onClick={() => mapRef.current?.zoomIn()}
          className="w-7 h-7 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-white font-bold text-sm flex items-center justify-center transition-all cursor-pointer shadow-md"
          title="Zoom In"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => mapRef.current?.zoomOut()}
          className="w-7 h-7 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-white font-bold text-sm flex items-center justify-center transition-all cursor-pointer shadow-md"
          title="Zoom Out"
        >
          &minus;
        </button>
      </div>

      {/* Live Coordinate Pill (Bottom-Center) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
        <div className="px-3 py-1 rounded-full bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-cyan-300 backdrop-blur-md shadow-lg">
          {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </div>
      </div>
    </div>
  );
}
