"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { photos, categoryLabels, type GalleryCategory, type GalleryPhoto } from "@/lib/gallery";

const aspectClass = {
  landscape: "aspect-[3/2]",
  portrait: "aspect-[2/3]",
  square: "aspect-square",
};

export function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory === "all"
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  const next = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, prev, next]);

  const categories: GalleryCategory[] = ["all", "boarding", "day-care", "walking", "cats"];

  return (
    <>
      {/* ── Category filter tabs ── */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setLightboxIndex(null); }}
            className={`font-body text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full transition-all duration-200 ${
              activeCategory === cat
                ? "bg-teal text-cream shadow-sm"
                : "bg-white border border-forest/10 text-forest/55 hover:border-teal/40 hover:text-teal"
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* ── Masonry grid ── */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-body text-sm text-forest/40">No photos in this category yet.</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {filtered.map((photo, i) => (
            <PhotoCard key={photo.src + i} photo={photo} index={i} onOpen={openLightbox} />
          ))}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Prev */}
          {filtered.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-4xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`relative w-full ${aspectClass[filtered[lightboxIndex].aspect]}`}>
              <Image
                src={filtered[lightboxIndex].src}
                alt={filtered[lightboxIndex].alt}
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 1200px) 90vw, 900px"
                unoptimized={filtered[lightboxIndex].src.endsWith(".svg")}
              />
            </div>
            {filtered[lightboxIndex].caption && (
              <p className="mt-4 text-center font-body text-sm text-white/65">
                {filtered[lightboxIndex].caption}
              </p>
            )}
            <p className="mt-2 text-center font-body text-xs text-white/30">
              {lightboxIndex + 1} / {filtered.length}
            </p>
          </div>

          {/* Next */}
          {filtered.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      )}
    </>
  );
}

function PhotoCard({
  photo,
  index,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  onOpen: (index: number) => void;
}) {
  return (
    <div
      className="break-inside-avoid mb-4 group cursor-pointer relative overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
      onClick={() => onOpen(index)}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={`relative w-full ${aspectClass[photo.aspect]}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 50vw, 33vw"
          unoptimized={photo.src.endsWith(".svg")}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-teal/0 group-hover:bg-teal/25 transition-all duration-300 flex items-end p-4">
          {photo.caption && (
            <p className="font-body text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-snug drop-shadow">
              {photo.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
