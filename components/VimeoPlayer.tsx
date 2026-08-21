"use client";

type VimeoPlayerProps = {
  vimeoId: string;
  vimeoHash?: string;
  title?: string;
  autoplay?: boolean;
};

/**
 * Clean, ad-free Vimeo embed.
 * Params keep the player minimal (no Vimeo branding/related clutter).
 */
export function VimeoPlayer({
  vimeoId,
  vimeoHash,
  title = "Video",
  autoplay = false,
}: VimeoPlayerProps) {
  const params = new URLSearchParams({
    title: "0",
    byline: "0",
    portrait: "0",
    dnt: "1",
    autoplay: autoplay ? "1" : "0",
  });
  if (vimeoHash) params.set("h", vimeoHash);

  const src = `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ aspectRatio: "16 / 9" }}>
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
