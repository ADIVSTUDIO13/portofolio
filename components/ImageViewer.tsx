"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  ExternalLink,
  Move,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageViewerProps {
  src: string;
  alt: string;
  originalUrl?: string;
  className?: string;
  heightClassName?: string;
}

export default function ImageViewer({
  src,
  alt,
  originalUrl,
  className = "",
  heightClassName = "h-72 sm:h-[420px] md:h-[500px]",
}: ImageViewerProps) {
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastPanRef = useRef({ x: 0, y: 0 });

  // Batas zoom
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 4;
  const ZOOM_STEP = 0.35;

  // Auto-hide hint after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Clamping pan bounds based on zoomScale and container dimensions
  const clampPan = useCallback(
    (offset: { x: number; y: number }, scale: number) => {
      if (scale <= 1) return { x: 0, y: 0 };
      if (!containerRef.current) return offset;

      const rect = containerRef.current.getBoundingClientRect();
      const maxPanX = ((scale - 1) * rect.width) / 2 + 60;
      const maxPanY = ((scale - 1) * rect.height) / 2 + 60;

      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, offset.x)),
        y: Math.max(-maxPanY, Math.min(maxPanY, offset.y)),
      };
    },
    []
  );

  const handleZoom = useCallback(
    (newScale: number, focalPoint?: { clientX: number; clientY: number }) => {
      setZoomScale((prevScale) => {
        const clampedScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +newScale.toFixed(2)));

        if (clampedScale === 1) {
          setPanOffset({ x: 0, y: 0 });
          lastPanRef.current = { x: 0, y: 0 };
          return 1;
        }

        if (focalPoint && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const focalX = focalPoint.clientX - rect.left - rect.width / 2;
          const focalY = focalPoint.clientY - rect.top - rect.height / 2;

          const ratio = clampedScale / prevScale;
          const newPanX = focalX - (focalX - panOffset.x) * ratio;
          const newPanY = focalY - (focalY - panOffset.y) * ratio;

          const clamped = clampPan({ x: newPanX, y: newPanY }, clampedScale);
          setPanOffset(clamped);
          lastPanRef.current = clamped;
        } else {
          setPanOffset((prev) => {
            const clamped = clampPan(prev, clampedScale);
            lastPanRef.current = clamped;
            return clamped;
          });
        }

        return clampedScale;
      });
    },
    [clampPan, panOffset]
  );

  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    handleZoom(zoomScale + ZOOM_STEP);
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    handleZoom(zoomScale - ZOOM_STEP);
  };

  const handleResetZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    lastPanRef.current = { x: 0, y: 0 };
  };

  const handleCyclePreset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoomScale === 1) handleZoom(1.8);
    else if (zoomScale < 2.5) handleZoom(3);
    else handleResetZoom();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (zoomScale > 1) {
      handleResetZoom();
    } else {
      handleZoom(2.2, { clientX: e.clientX, clientY: e.clientY });
    }
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const zoomDelta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    handleZoom(zoomScale + zoomDelta, { clientX: e.clientX, clientY: e.clientY });
  };

  // Drag / Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomScale <= 1) return;
    const rawX = e.clientX - dragStartRef.current.x;
    const rawY = e.clientY - dragStartRef.current.y;
    const clamped = clampPan({ x: rawX, y: rawY }, zoomScale);
    setPanOffset(clamped);
    lastPanRef.current = clamped;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Handlers for Mobile (Pinch & Pan)
  const touchStateRef = useRef<{
    startDistance: number;
    startScale: number;
    lastTouch: { x: number; y: number };
  }>({
    startDistance: 0,
    startScale: 1,
    lastTouch: { x: 0, y: 0 },
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStateRef.current.startDistance = dist;
      touchStateRef.current.startScale = zoomScale;
      setIsDragging(false);
    } else if (e.touches.length === 1 && zoomScale > 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      dragStartRef.current = {
        x: touch.clientX - panOffset.x,
        y: touch.clientY - panOffset.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (touchStateRef.current.startDistance > 0) {
        const factor = dist / touchStateRef.current.startDistance;
        const targetScale = touchStateRef.current.startScale * factor;
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        handleZoom(targetScale, { clientX: midX, clientY: midY });
      }
    } else if (e.touches.length === 1 && isDragging && zoomScale > 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const rawX = touch.clientX - dragStartRef.current.x;
      const rawY = touch.clientY - dragStartRef.current.y;
      const clamped = clampPan({ x: rawX, y: rawY }, zoomScale);
      setPanOffset(clamped);
      lastPanRef.current = clamped;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStateRef.current.startDistance = 0;
  };

  // Fullscreen Container Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        handleZoom(zoomScale + ZOOM_STEP);
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        handleZoom(zoomScale - ZOOM_STEP);
      } else if (e.key === "0") {
        e.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleZoom, zoomScale]);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`group/viewer relative w-full ${heightClassName} rounded-2xl sm:rounded-3xl overflow-hidden bg-[#070b14] border border-slate-800/90 shadow-2xl flex items-center justify-center select-none ${
        zoomScale > 1
          ? isDragging
            ? "cursor-grabbing touch-none"
            : "cursor-grab touch-none"
          : "cursor-zoom-in"
      } ${className}`}
    >
      {/* Background Subtle Mesh Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Image Container */}
      <div
        className="w-full h-full flex items-center justify-center p-3 sm:p-5 relative"
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={src}
          alt={alt}
          style={{
            transform: `scale(${zoomScale}) translate(${panOffset.x / zoomScale}px, ${panOffset.y / zoomScale}px)`,
            transition: isDragging
              ? "none"
              : "transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
          className="max-h-full max-w-full object-contain rounded-lg sm:rounded-xl shadow-2xl pointer-events-auto select-none transition-shadow duration-300 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
          draggable={false}
        />
      </div>

      {/* Floating Status & Interaction Hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none"
          >
            <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-[10px] sm:text-[11px] font-medium text-slate-300 flex items-center gap-1.5 shadow-lg max-w-[85vw] truncate">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="sm:hidden truncate">Pinch / tap untuk zoom & geser</span>
              <span className="hidden sm:inline">Scroll untuk zoom • Drag untuk geser • Double-click toggle</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Glassmorphic Control Dock (Bottom Center) */}
      <div className="absolute bottom-3 sm:bottom-4 inset-x-0 flex justify-center items-center px-3 pointer-events-none z-30">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all"
        >
          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomScale <= MIN_ZOOM}
            className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer active:scale-95"
            title="Perkecil (-)"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Dynamic Percentage Badge (Clickable Preset Cycler) */}
          <button
            type="button"
            onClick={handleCyclePreset}
            className="px-2.5 sm:px-3 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 font-mono text-xs sm:text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer min-w-[54px] sm:min-w-[62px] text-center shadow-inner"
            title="Klik untuk ganti preset zoom (1x -> 1.8x -> 3x)"
          >
            {Math.round(zoomScale * 100)}%
          </button>

          {/* Zoom In Button */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomScale >= MAX_ZOOM}
            className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer active:scale-95"
            title="Perbesar (+)"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Divider */}
          <div className="w-[1px] h-5 bg-slate-800 mx-0.5" />

          {/* Reset Zoom Button */}
          {zoomScale > 1 && (
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
              title="Reset ke ukuran asli (1:1)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer active:scale-95 hidden sm:flex items-center justify-center"
            title={isFullscreen ? "Keluar Layar Penuh" : "Mode Layar Penuh"}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Open Original File / New Tab */}
          {(originalUrl || src) && (
            <a
              href={originalUrl || src}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800/80 transition-all cursor-pointer active:scale-95 flex items-center justify-center"
              title="Buka Gambar Resolusi Penuh di Tab Baru"
              aria-label="Open image in new tab"
            >
              <ExternalLink className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </a>
          )}
        </motion.div>
      </div>

      {/* Subtle indicator when zoomed in */}
      {zoomScale > 1 && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-none">
          <div className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] sm:text-[11px] font-medium text-cyan-300 flex items-center gap-1.5 backdrop-blur-md">
            <Move className="w-3 h-3 text-cyan-400" />
            <span>Pan Aktif</span>
          </div>
        </div>
      )}
    </div>
  );
}
