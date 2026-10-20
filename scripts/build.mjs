import { build } from "esbuild";
import { readFile, writeFile, mkdir } from "node:fs/promises";
await mkdir("build", { recursive: true });
const page = await readFile("out/index.html", "utf8");
let head = page.match(/<head>([\s\S]*?)<\/head>/)[1];
head = head
  .replace(/<script\b[\s\S]*?<\/script>/g, "")
  .replace(
    /<link\b[^>]*(?:as="script"|rel="preload"[^>]*as="image")[^>]*>/g,
    "",
  )
  .replace(/<title>[\s\S]*?<\/title>/g, "")
  .replace(
    /<meta\b[^>]*(?:name="(?:description|robots|keywords)"|property="og:[^"]*")[^>]*>/g,
    "",
  );
const htmlAttrs = page.match(/<html([^>]*)>/)[1];
await writeFile(
  "build/home-template.html",
  `<!DOCTYPE html><html${htmlAttrs}><head>${head}<!--PORTFOLIO_META--></head><body class="min-h-full"><!--PORTFOLIO_BODY--></body></html>`,
);
await build({
  entryPoints: ["scripts/public-client.tsx"],
  outfile: "out/portfolio-client.js",
  bundle: true,
  minify: true,
  format: "esm",
  platform: "browser",
  define: { "process.env.NODE_ENV": '"production"' },
  target: "es2022",
});
await build({
  entryPoints: ["worker/index.tsx"],
  outfile: "build/worker.js",
  bundle: true,
  minify: true,
  format: "esm",
  platform: "browser",
  conditions: ["browser"],
  loader: { ".html": "text" },
  define: { "process.env.NODE_ENV": '"production"' },
  target: "es2022",
});
await build({
  entryPoints: ["scripts/seed.ts"],
  outfile: "build/seed.mjs",
  bundle: true,
  format: "esm",
  platform: "node",
  packages: "external",
});
