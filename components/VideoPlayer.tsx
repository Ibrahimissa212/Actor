"use client";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  title?: string;
  autoplay?: boolean;
};

/**
 * Self-hosted HTML5 video player for files served from /public/videos.
 * No third-party embeds, no ads — just a clean native player.
 */
export function VideoPlayer({
  src,
  poster,
  title = "Video",
  autoplay = false,
}: VideoPlayerProps) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-black"
      style={{ aspectRatio: "16 / 9" }}
    >
      <video
        src={src}
        poster={poster}
        title={title}
        controls
        autoPlay={autoplay}
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full bg-black object-contain"
      />
    </div>
  );
}
