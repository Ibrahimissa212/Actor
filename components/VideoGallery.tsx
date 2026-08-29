"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { ui, useLanguage } from "@/lib/i18n";
import { videos, type VideoItem } from "@/content/videos";
import { Section, SectionHeading } from "./Section";
import { VideoPlayer } from "./VideoPlayer";
import { VideoThumb } from "./VideoThumb";

function VideoCard({
  video,
  onPlay,
}: {
  video: VideoItem;
  onPlay: (v: VideoItem) => void;
}) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card text-start transition-colors hover:border-accent"
    >
      {/* Live preview (plays muted while on screen) */}
      <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-bg-soft to-bg">
        <VideoThumb
          src={video.src}
          title={t(video.title)}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10" />
        <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-accent/90 text-[#1a1306] shadow-lg transition-transform group-hover:scale-110">
          <Play className="h-6 w-6 translate-x-[1px]" fill="currentColor" />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold text-fg">{t(video.title)}</h3>
        <p className="text-sm leading-relaxed text-fg-muted">
          {t(video.description)}
        </p>
      </div>
    </button>
  );
}

function CategoryBlock({
  titleKey,
  items,
  onPlay,
}: {
  titleKey: { he: string; en: string };
  items: VideoItem[];
  onPlay: (v: VideoItem) => void;
}) {
  const { t } = useLanguage();
  if (items.length === 0) return null;

  return (
    <div className="mb-14 last:mb-0">
      <h3 className="mb-6 text-xl font-semibold text-accent-soft">
        {t(titleKey)}
      </h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((v) => (
          <VideoCard key={v.id} video={v} onPlay={onPlay} />
        ))}
      </div>
    </div>
  );
}

export function VideoGallery() {
  const { t } = useLanguage();
  const [active, setActive] = useState<VideoItem | null>(null);

  const professional = videos.filter((v) => v.category === "professional");
  const course = videos.filter((v) => v.category === "course");

  return (
    <Section id="video">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={{ he: "תיק עבודות", en: "Portfolio", ar: "أعمالي" }}
          title={{ he: "וידאו", en: "Video", ar: "فيديو" }}
        />

        <CategoryBlock
          titleKey={ui.video.professional}
          items={professional}
          onPlay={setActive}
        />
        <CategoryBlock titleKey={ui.video.course} items={course} onPlay={setActive} />
      </div>

      {/* Player modal */}
      <AnimatePresence>
        {active ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
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
                  {t(active.title)}
                </h3>
                <button
                  type="button"
                  aria-label={t(ui.video.close)}
                  onClick={() => setActive(null)}
                  className="rounded-full border border-border p-2 text-fg-muted transition-colors hover:border-accent hover:text-fg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <VideoPlayer
                src={active.src}
                poster={active.poster}
                title={t(active.title)}
                autoplay
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Section>
  );
}
