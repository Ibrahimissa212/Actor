"use client";

import { useEffect, useRef } from "react";

/**
 * Silent, looping video preview that autoplays only while on screen
 * (via IntersectionObserver) to keep bandwidth in check. Clicking is
 * handled by the parent, which opens the full player with sound.
 */
export function VideoThumb({
  src,
  title,
  className,
}: {
  src: string;
  title?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.2 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      title={title}
      muted
      loop
      playsInline
      preload="metadata"
      tabIndex={-1}
      className={className}
    />
  );
}
