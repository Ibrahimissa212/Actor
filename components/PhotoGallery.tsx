"use client";

import { track } from "@/lib/tracking";
import { useContent } from "@/lib/content";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageOff, Play, X } from "lucide-react";
import { useLanguage, type Bi } from "@/lib/i18n";
import { type CourseMedia } from "@/content/course";
import { Section, SectionHeading } from "./Section";
import { VideoThumb } from "./VideoThumb";
import { VideoPlayer } from "./VideoPlayer";

type Tab = "professional" | "course";
type Item = CourseMedia;

/** Image with a graceful placeholder when the file is missing. */
function PhotoImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: Bi;
  className?: string;
}) {
  const { t } = useLanguage();
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-bg-soft to-bg text-fg-muted ${className ?? ""}`}
      >
        <ImageOff className="h-7 w-7" />
        <span className="px-3 text-center text-xs">{t(alt)}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={t(alt)}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export function PhotoGallery() {
  const { photos, courseMedia, ui, labels } = useContent();
  const professionalItems: Item[] = photos.filter(p => !p.hidden).map(p => ({...p, kind:'photo'}));
  const courseItems = courseMedia.filter(p => !p.hidden);
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>("professional");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<Item | null>(null);

  const items = tab === "professional" ? professionalItems : courseItems;
  const photoItems = items.filter((it) => it.kind === "photo");

  const openItem = (it: Item) => {
    if (it.kind === "video") {
      setActiveVideo(it);
    } else {
      setLightboxIndex(photoItems.findIndex((p) => p.id === it.id));
    }
  };

  const close = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((i) =>
      i === null ? i : (i - 1 + photoItems.length) % photoItems.length,
    );
  const next = () =>
    setLightboxIndex((i) => (i === null ? i : (i + 1) % photoItems.length));

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
  }, [lightboxIndex, photoItems.length]);

  const tabs: { key: Tab; label: Bi }[] = [
    {
      key: "professional",
      label: ui.photos.title,
    },
    {
      key: "course",
      label: labels.courseTab,
    },
  ];

  const lightboxPhoto = lightboxIndex === null ? null : photoItems[lightboxIndex];
  const openedPhoto = lightboxPhoto?.id;
  useEffect(() => { if (openedPhoto) void track('photo_open', openedPhoto); }, [openedPhoto]);

  return (
    <Section id="photos">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={labels.galleryEyebrow}
          title={labels.galleryTitle}
        />

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              type="button"
              onClick={() => {setTab(tb.key);setLightboxIndex(null);setActiveVideo(null);}}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === tb.key
                  ? "border-accent bg-accent text-[#1a1306]"
                  : "border-border text-fg-muted hover:border-accent hover:text-fg"
              }`}
            >
              {t(tb.label)}
            </button>
          ))}
        </div>

        {/* Masonry-ish grid */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {items.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => openItem(it)}
              className="group relative block w-full overflow-hidden rounded-xl border border-border bg-bg-card"
            >
              {it.kind === "video" ? (
                <>
                  <VideoThumb
                    src={it.src}
                    title={t(it.title)}
                    className="aspect-[3/4] w-full object-cover"
                  />
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/90 text-[#1a1306] shadow-lg transition-transform group-hover:scale-110">
                      <Play className="h-5 w-5 translate-x-[1px]" fill="currentColor" />
                    </span>
                  </span>
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 text-start text-sm font-medium text-fg">
                    {t(it.title)}
                  </span>
                </>
              ) : (
                <PhotoImage
                  src={it.src}
                  alt={it.alt}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Photo lightbox */}
      <AnimatePresence>
        {lightboxPhoto ? (
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
              aria-label={t(labels.previous)}
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute start-4 rounded-full border border-border bg-bg/60 p-2 text-fg transition-colors hover:border-accent"
            >
              <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
            </button>

            <motion.div
              key={lightboxPhoto.id}
              className="max-h-[85vh] max-w-3xl"
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <PhotoImage
                src={lightboxPhoto.src}
                alt={lightboxPhoto.alt}
                className="max-h-[85vh] w-auto rounded-lg object-contain"
              />
            </motion.div>

            <button
              type="button"
              aria-label={t(labels.next)}
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

      {/* Video modal */}
      <AnimatePresence>
        {activeVideo && activeVideo.kind === "video" ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              className="relative w-full max-w-4xl"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-fg">
                  {t(activeVideo.title)}
                </h3>
                <button
                  type="button"
                  aria-label={t(ui.video.close)}
                  onClick={() => setActiveVideo(null)}
                  className="rounded-full border border-border p-2 text-fg-muted transition-colors hover:border-accent hover:text-fg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <VideoPlayer mediaId={activeVideo.id} src={activeVideo.src} title={t(activeVideo.title)} autoplay />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Section>
  );
}
