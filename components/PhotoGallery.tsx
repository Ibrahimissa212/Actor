"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
import { ui, useLanguage } from "@/lib/i18n";
import { photos, type PhotoItem } from "@/content/photos";
import { Section, SectionHeading } from "./Section";

/** Image with a graceful placeholder when the file is missing. */
function PhotoImage({ photo, className }: { photo: PhotoItem; className?: string }) {
  const { t } = useLanguage();
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-bg-soft to-bg text-fg-muted ${className ?? ""}`}
      >
        <ImageOff className="h-7 w-7" />
        <span className="px-3 text-center text-xs">{t(photo.alt)}</span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={photo.src}
      alt={t(photo.alt)}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export function PhotoGallery() {
  const { t } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = photos;

  const close = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((i) =>
      i === null ? i : (i - 1 + filtered.length) % filtered.length,
    );
  const next = () =>
    setLightboxIndex((i) => (i === null ? i : (i + 1) % filtered.length));

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, filtered.length]);

  return (
    <Section id="photos">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={{ he: "גלריה", en: "Gallery" }}
          title={ui.photos.title}
        />

        {/* Masonry-ish grid */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {filtered.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="group block w-full overflow-hidden rounded-xl border border-border bg-bg-card"
            >
              <PhotoImage
                photo={photo}
                className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              type="button"
              aria-label={t(ui.video.close)}
              onClick={close}
              className="absolute end-4 top-4 rounded-full border border-border p-2 text-fg-muted transition-colors hover:border-accent hover:text-fg"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              type="button"
              aria-label="Previous"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute start-4 rounded-full border border-border bg-bg/60 p-2 text-fg transition-colors hover:border-accent"
            >
              <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
            </button>

            <motion.div
              key={filtered[lightboxIndex].id}
              className="max-h-[85vh] max-w-3xl"
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <PhotoImage
                photo={filtered[lightboxIndex]}
                className="max-h-[85vh] w-auto rounded-lg object-contain"
              />
            </motion.div>

            <button
              type="button"
              aria-label="Next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute end-4 rounded-full border border-border bg-bg/60 p-2 text-fg transition-colors hover:border-accent"
            >
              <ChevronRight className="h-6 w-6 rtl:rotate-180" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Section>
  );
}
