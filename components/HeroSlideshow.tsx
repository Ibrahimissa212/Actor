"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { photos } from "@/content/photos";

const SLIDES = photos.map((p) => p.src);
const HOLD_MS = 3500; // time each photo is shown
const FADE_S = 1.1; // crossfade duration in seconds
const KEN_S = (HOLD_MS + FADE_S * 1000) / 1000; // Ken Burns duration

/**
 * One slide's visuals.
 * - Mobile: full-bleed cover with a subtle Ken Burns zoom/pan.
 * - Desktop: the WHOLE photo (object-contain, centered) over a blurred,
 *   zoomed copy that fills the wide space so it never looks cropped to the face.
 */
function SlideVisual({
  src,
  index,
  animate,
}: {
  src: string;
  index: number;
  animate: boolean;
}) {
  const panX = index % 2 === 0 ? ["-1.5%", "1.5%"] : ["1.5%", "-1.5%"];
  const eager = index === 0;

  return (
    <>
      {/* Desktop: blurred fill + full photo */}
      <div className="absolute inset-0 hidden md:block">
        <motion.img
          src={src}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
          initial={animate ? { scale: 1.1 } : false}
          animate={animate ? { scale: 1.28 } : undefined}
          transition={animate ? { duration: KEN_S, ease: "linear" } : undefined}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          loading={eager ? "eager" : "lazy"}
          className="relative z-10 mx-auto h-full w-auto max-w-full object-contain"
        />
      </div>

      {/* Mobile: full-bleed cover with Ken Burns */}
      <motion.div
        className="absolute inset-0 md:hidden"
        initial={animate ? { scale: 1.02, x: panX[0] } : false}
        animate={animate ? { scale: 1.1, x: panX[1] } : undefined}
        transition={animate ? { duration: KEN_S, ease: "linear" } : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          loading={eager ? "eager" : "lazy"}
          className="h-full w-full object-cover object-top"
        />
      </motion.div>
    </>
  );
}

/**
 * Full-bleed background slideshow for the hero. Crossfades between the
 * professional photos. Purely decorative (aria-hidden) and freezes on the
 * first image when reduced motion is on.
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
      <div aria-hidden className="absolute inset-0 z-0 overflow-hidden bg-bg">
        <SlideVisual src={SLIDES[0]} index={0} animate={false} />
      </div>
    );
  }

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
          <SlideVisual src={SLIDES[index]} index={index} animate />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
