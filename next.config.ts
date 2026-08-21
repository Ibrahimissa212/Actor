import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export -> produces a plain HTML/CSS/JS site in `out/`,
  // ideal for free hosting on Cloudflare Pages (and Vercel too).
  output: "export",
  // Required for static export since we don't use a server image optimizer.
  images: { unoptimized: true },
  // Cloudflare Pages serves clean URLs best with trailing slashes.
  trailingSlash: true,
};

export default nextConfig;
