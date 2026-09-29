"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import Lightbox from "./Lightbox";
import type { ImageRef } from "@/lib/types";

/**
 * Artwork image browser: a large, uncropped main image with previous/next
 * controls and a thumbnail strip. Clicking the image opens a full-screen
 * viewer with zoom.
 */
export default function ArtworkGallery({
  images,
  title,
}: {
  images: ImageRef[];
  title: string;
}) {
  const valid = images.filter((img) => img.url);
  const [index, setIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  const count = valid.length;
  const current = valid[index];
  const altFor = (i: number) =>
    count > 1 ? `${title} — image ${i + 1} of ${count}` : title;

  // Fitted to the viewport so the whole painting is always visible,
  // whatever its proportions or the screen size.
  const frame =
    "relative h-[min(70svh,34rem)] w-full overflow-hidden bg-surface lg:h-[min(80svh,46rem)]";

  if (!current) {
    return (
      <div className={frame}>
        <CmsImage alt={title} sizes="50vw" className="absolute inset-0" />
      </div>
    );
  }

  function go(delta: number) {
    setIndex((i) => (i + delta + count) % count);
  }

  const navBtn =
    "absolute top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground shadow transition hover:bg-background";

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className={`group ${frame}`}>
        <button
          type="button"
          onClick={() => setViewerOpen(true)}
          className="absolute inset-3 cursor-zoom-in sm:inset-4"
          aria-label={`Open ${altFor(index)} in full-screen viewer`}
        >
          <Image
            key={current.url}
            src={current.url}
            alt={altFor(index)}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            quality={90}
            className="object-contain"
            priority={index === 0}
          />
        </button>

        <button
          type="button"
          onClick={() => setViewerOpen(true)}
          className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded bg-background/80 px-2.5 py-1.5 text-xs text-foreground shadow transition hover:bg-background"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          View full screen
        </button>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className={`${navBtn} left-2`}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className={`${navBtn} right-2`}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/60 px-2 py-0.5 text-xs tabular-nums text-white">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {valid.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`relative h-20 w-20 shrink-0 overflow-hidden border-2 bg-surface transition ${
                i === index
                  ? "border-foreground"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {viewerOpen && (
        <Lightbox
          images={valid.map((img, i) => ({ url: img.url, alt: altFor(i) }))}
          index={index}
          onIndexChange={setIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
}
