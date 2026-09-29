"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export type LightboxImage = { url: string; alt: string };

type LightboxProps = {
  images: LightboxImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const STEP = 0.5;
const SWIPE_THRESHOLD = 50;

/**
 * Serves Cloudinary images at full resolution in the best format the
 * browser supports, without resizing or cropping.
 */
export function fullResUrl(url: string) {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  return url.replace("/upload/", "/upload/f_auto,q_auto:best/");
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Full-screen image viewer. The image is always fitted with
 * object-contain and zoomed with a uniform CSS scale, so it keeps its
 * exact proportions at every zoom level.
 */
export default function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: LightboxProps) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    startX: number;
    startY: number;
    startOffset: { x: number; y: number };
    pinchDistance: number | null;
    pinchScale: number;
    moved: boolean;
    onBackdrop: boolean;
  } | null>(null);

  const count = images.length;
  const current = images[index];

  const clampOffset = useCallback(
    (next: { x: number; y: number }, s: number) => {
      const img = imgRef.current;
      const stage = stageRef.current;
      if (!img || !stage) return next;
      // offsetWidth/Height are the fitted (unscaled) size of the image.
      const maxX = Math.max(0, (img.offsetWidth * s - stage.clientWidth) / 2);
      const maxY = Math.max(0, (img.offsetHeight * s - stage.clientHeight) / 2);
      return { x: clamp(next.x, -maxX, maxX), y: clamp(next.y, -maxY, maxY) };
    },
    []
  );

  const zoomTo = useCallback(
    (nextScale: number) => {
      const s = clamp(nextScale, MIN_SCALE, MAX_SCALE);
      setScale(s);
      setOffset((o) => (s === 1 ? { x: 0, y: 0 } : clampOffset(o, s)));
    },
    [clampOffset]
  );

  const resetZoom = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const go = useCallback(
    (delta: number) => {
      if (count < 2) return;
      resetZoom();
      onIndexChange((index + delta + count) % count);
    },
    [count, index, onIndexChange, resetZoom]
  );

  // Keyboard controls and body scroll lock while open.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "+" || e.key === "=") zoomTo(scale + STEP);
      else if (e.key === "-") zoomTo(scale - STEP);
      else if (e.key === "0") resetZoom();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose, resetZoom, scale, zoomTo]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Wheel zoom needs a non-passive listener to stop the page scrolling.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      zoomTo(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
    }
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [scale, zoomTo]);

  // Keep the image inside the stage when the window is resized.
  useEffect(() => {
    function onResize() {
      setOffset((o) => clampOffset(o, scale));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clampOffset, scale]);

  function pinchDistance() {
    const [a, b] = [...pointers.current.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function handlePointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    gesture.current = {
      startX: e.clientX,
      startY: e.clientY,
      startOffset: offset,
      pinchDistance: pointers.current.size === 2 ? pinchDistance() : null,
      pinchScale: scale,
      moved: false,
      onBackdrop: e.target === e.currentTarget,
    };
    setDragging(true);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;

    if (pointers.current.size === 2 && g.pinchDistance) {
      g.moved = true;
      const next = clamp(
        g.pinchScale * (pinchDistance() / g.pinchDistance),
        MIN_SCALE,
        MAX_SCALE
      );
      setScale(next);
      setOffset((o) => (next === 1 ? { x: 0, y: 0 } : clampOffset(o, next)));
      return;
    }

    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) g.moved = true;
    if (scale > 1) {
      setOffset(
        clampOffset({ x: g.startOffset.x + dx, y: g.startOffset.y + dy }, scale)
      );
    }
  }

  function handlePointerUp(e: React.PointerEvent) {
    const g = gesture.current;
    const wasPinch = pointers.current.size === 2;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size > 0) {
      // One finger lifted after a pinch: restart panning from here.
      const [p] = [...pointers.current.values()];
      gesture.current = {
        startX: p.x,
        startY: p.y,
        startOffset: offset,
        pinchDistance: null,
        pinchScale: scale,
        moved: true,
        onBackdrop: false,
      };
      return;
    }
    setDragging(false);
    gesture.current = null;
    if (!g || wasPinch) return;

    // A tap on the empty area around the image closes the viewer.
    if (g.onBackdrop && !g.moved) {
      onClose();
      return;
    }

    // Swipe between images when not zoomed in.
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (scale === 1 && Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
  }

  function handleDoubleClick() {
    if (scale > 1) resetZoom();
    else zoomTo(2.5);
  }

  if (!current) return null;

  const btn =
    "inline-flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-white/80">
        <span className="min-w-12 tabular-nums">
          {count > 1 ? `${index + 1} / ${count}` : ""}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={btn}
            onClick={() => zoomTo(scale - STEP)}
            disabled={scale <= MIN_SCALE}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <span className="w-12 text-center tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            className={btn}
            onClick={() => zoomTo(scale + STEP)}
            disabled={scale >= MAX_SCALE}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={btn}
            onClick={resetZoom}
            disabled={scale === 1}
            aria-label="Reset zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <button type="button" className={btn} onClick={onClose} aria-label="Close">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={stageRef}
        className={`relative flex min-h-0 flex-1 touch-none select-none items-center justify-center overflow-hidden ${
          scale > 1 ? (dragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={handleDoubleClick}
      >
        {/* A plain <img> so the viewer loads the full-resolution original
            for zooming, rather than a resized next/image variant. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current.url}
          ref={imgRef}
          src={fullResUrl(current.url)}
          alt={current.alt}
          draggable={false}
          className="max-h-full max-w-full object-contain"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: dragging ? "none" : "transform 150ms ease-out",
          }}
        />

        {count > 1 && (
          <>
            <button
              type="button"
              className={`${btn} absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 sm:left-4`}
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              className={`${btn} absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 sm:right-4`}
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto px-3 py-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                resetZoom();
                onIndexChange(i);
              }}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`h-14 w-14 shrink-0 overflow-hidden rounded border-2 bg-white/5 ${
                i === index ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}

      <p className="pb-2 text-center text-xs text-white/50">
        Scroll, pinch or double-click to zoom · drag to move
      </p>
    </div>
  );
}
