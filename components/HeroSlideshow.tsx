"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { photos } from "@/content/photos";

const SLIDES = photos.map((p) => p.src);
const HOLD_MS = 3500; // time each photo is shown
const FADE_S = 1.1; // crossfade / motion duration in seconds

/**
 * Full-bleed background slideshow for the hero. Crossfades between the
 * professional photos with a subtle Ken Burns zoom/pan. Purely decorative
 * (aria-hidden) and freezes on the first image when reduced motion is on.
 */
export function HeroSlideshow() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || SLIDES.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      HOLD_MS,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  if (SLIDES.length === 0) return null;

  if (reduceMotion) {
    return (
      <div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SLIDES[0]}
          alt=""
          className="h-full w-full object-cover object-top"
        />
      </div>
    );
  }

  // Alternate the pan direction so consecutive slides feel different.
  const panX = index % 2 === 0 ? [-1.5, 1.5] : [1.5, -1.5];

  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden bg-bg">
      <AnimatePresence>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_S, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.02, x: `${panX[0]}%` }}
            animate={{ scale: 1.1, x: `${panX[1]}%` }}
            transition={{
              duration: (HOLD_MS + FADE_S * 1000) / 1000,
              ease: "linear",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SLIDES[index]}
              alt=""
              loading={index === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover object-top"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
