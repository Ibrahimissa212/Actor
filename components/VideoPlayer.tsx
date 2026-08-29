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
    <div className="flex w-full items-center justify-center">
      <video
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
