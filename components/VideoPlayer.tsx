"use client";
import { useEffect, useRef } from "react";
import { track } from "@/lib/tracking";
type VideoPlayerProps = {
  src: string;
  mediaId?: string;
  poster?: string;
  title?: string;
  autoplay?: boolean;
};
export function VideoPlayer({
  src,
  mediaId,
  poster,
  title = "Video",
  autoplay = false,
}: VideoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const playback = crypto.randomUUID();
    let seconds = 0,
      last = performance.now(),
      previous = el.currentTime,
      reported = 0,
      started = false;
    const covered = new Set<number>();
    const report = () => {
      if (seconds <= reported) return;
      reported = seconds;
      void track("video_progress", mediaId || src, {
        playback,
        seconds: Math.round(seconds),
        coverage: el.duration
          ? Math.min(100, Math.round((covered.size / el.duration) * 100))
          : 0,
      });
    };
    const play = () => {
      if (!started) {
        started = true;
        void track("video_play", mediaId || src, { playback });
      }
      last = performance.now();
      previous = el.currentTime;
    };
    const tick = () => {
      const now = performance.now(),
        delta = (now - last) / 1000,
        position = el.currentTime;
      if (
        !el.paused &&
        !el.seeking &&
        document.visibilityState === "visible" &&
        delta < 2 &&
        position > previous &&
        position - previous <= delta * Math.max(el.playbackRate, 1) + 0.75
      ) {
        seconds += delta;
        for (let i = Math.floor(previous); i < Math.ceil(position); i++)
          covered.add(i);
        if (seconds - reported >= 10) report();
      }
      last = now;
      previous = position;
    };
    const ended = () => {
      tick();
      report();
      void track("video_end", mediaId || src, { playback });
    };
    const visibility = () => {
      if (document.visibilityState === "hidden") report();
      last = performance.now();
      previous = el.currentTime;
    };
    const timer = setInterval(tick, 500);
    el.addEventListener("play", play);
    el.addEventListener("pause", report);
    el.addEventListener("ended", ended);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pagehide", report);
    return () => {
      tick();
      report();
      clearInterval(timer);
      el.removeEventListener("play", play);
      el.removeEventListener("pause", report);
      el.removeEventListener("ended", ended);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pagehide", report);
    };
  }, [src, mediaId]);
  return (
    <div className="flex w-full items-center justify-center">
      <video
        ref={ref}
        src={src}
        poster={poster}
        title={title}
        controls
        autoPlay={autoplay}
        playsInline
        preload="metadata"
        className="max-h-[80vh] w-auto max-w-full rounded-xl bg-black"
      />
    </div>
  );
}
