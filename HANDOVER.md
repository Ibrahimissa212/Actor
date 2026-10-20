# Actor Portfolio - Project Context & Handover

## 1. What this is
A single-page, tri-lingual (Hebrew / English / Arabic) acting portfolio for **Ibrahim Issa** (איברהים עיסא / إبراهيم عيسى), aimed at acting agencies. Hebrew is the default; Hebrew and Arabic are RTL, English is LTR.

- **Owner contact:** ibrahim.issa212@gmail.com - +972-54-328-3232
- **Socials:** Instagram `@ibrahim_issa`, LinkedIn `ibrahim-issa-17409774`, Facebook `ibrahim.issa.796`

## 2. Connections (GitHub + Cloudflare)
- **Source code / version control:** Git + **GitHub** -> `https://github.com/Ibrahimissa212/Actor.git`
  - Working branch: **`main`** (this is what deploys).
- **Hosting (the host):** **Cloudflare** (Workers/Pages **Static Assets**), free tier + CDN.
  - Cloudflare is connected to the GitHub repo. **Every `git push` to `main` triggers an automatic build & deploy.**
  - Cloudflare config file in repo: `wrangler.jsonc` -> project `name: "actor"`, serves static folder `"./out"`, `compatibility_date: "2026-08-20"`.
  - **Build settings on Cloudflare:** build command `npm run build`, output directory `out`, Node version **22** (pinned via `.node-version`).
  - Public URL: a `*.pages.dev` subdomain (exact URL is in the Cloudflare dashboard; the repo still has a placeholder `https://your-name.pages.dev` in `app/layout.tsx` `metadataBase` that should be updated to the real URL).
- **Local project path:** `C:\Dev\actor-portfolio` (deliberately kept **out of OneDrive** - see gotchas).
- **IDE used to build it:** Cursor.

Flow: **Edit locally -> commit -> `git push origin main` -> Cloudflare auto-builds `out/` -> live on `*.pages.dev`.**

## 3. Tech stack (with versions)
- **Next.js 16.2.7** (App Router) in **Static Export** mode (`output: "export"`, `images.unoptimized: true`, `trailingSlash: true`) -> outputs plain HTML/CSS/JS to `out/`.
- **React 19.2.4** + React DOM
- **TypeScript 5**
- **Tailwind CSS v4** (+ `@tailwindcss/postcss`, PostCSS)
- **Framer Motion 12** (animations: hero slideshow, Ken Burns, transitions, video modals)
- **lucide-react** (icons)
- **Google Fonts - Rubik** via `next/font` (subsets: latin, hebrew, arabic)
- **Custom i18n** (React Context, no external lib) - he/en/ar + RTL/LTR
- **ESLint 9** + `eslint-config-next`
- **npm** (lockfile `package-lock.json`), **Node.js 22**, **Turbopack** (Next bundler)
- **Git + GitHub + Cloudflare** for VCS/host
- Media: **self-hosted MP4** via HTML5 `<video>`; images served as static assets (no Vimeo/YouTube - a `VimeoPlayer.tsx` exists but is unused/legacy).

## 4. Project structure
```
actor-portfolio/
├─ app/
│  ├─ layout.tsx        # root layout, metadata/SEO, fonts, LanguageProvider, default lang=he dir=rtl
│  ├─ page.tsx          # assembles sections: Navbar, Hero, About, Showreel, VideoGallery, PhotoGallery, Contact, Footer
│  ├─ globals.css       # Tailwind theme, colors (dark/cinematic), scrollbar, spotlight
│  └─ favicon.ico
├─ components/
│  ├─ Navbar.tsx, Hero.tsx, HeroSlideshow.tsx, About.tsx, Showreel.tsx
│  ├─ VideoGallery.tsx, VideoPlayer.tsx (HTML5), VideoThumb.tsx (muted in-view autoplay preview)
│  ├─ PhotoGallery.tsx (tabbed: professional + course, lightbox + video modal)
│  ├─ Contact.tsx, Footer.tsx, Section.tsx (Section + SectionHeading), LanguageSwitcher.tsx (HE/EN/AR)
│  └─ VimeoPlayer.tsx   # legacy, currently unused
├─ content/             # ALL editable text/media live here
│  ├─ site.ts           # profile (name, motto/tagline, hero line), about (paragraphs, facts, languages & accents), showreel, contact
│  ├─ videos.ts         # main Video section (categories: commercial / professional / course)
│  ├─ photos.ts         # 8 professional studio photos
│  └─ course.ts         # "From the Course" gallery tab (photos + videos)
├─ lib/
│  └─ i18n.tsx          # Lang type (he|en|ar), Bi type, ui dictionary, LanguageProvider, t() with ar->he fallback
├─ public/
│  ├─ images/           # headshot-01..08.jpg  +  images/course/course-01..20.jpg (18 used)
│  ├─ videos/           # bigbrother-promo-2020.mp4, studio.mp4, course-1.mp4, course-2.mp4  +  videos/course/*.mp4
│  └─ cv/               # placeholder for cv.pdf (currently none)
├─ next.config.ts, wrangler.jsonc, tsconfig.json (@/* alias), eslint.config.mjs, postcss.config.mjs
├─ .node-version (22), package.json, package-lock.json
└─ AGENTS.md, CLAUDE.md, README.md
```

## 5. How content is edited (the important part)
- Nearly all text is **bilingual/trilingual objects** of type `Bi = { he: string; en: string; ar?: string }`. If `ar` is omitted it **falls back to Hebrew**.
- **Personal info, bio, motto, languages & accents:** `content/site.ts`.
- **Main Video section:** `content/videos.ts`. Each item: `{ id, category, title: Bi, description: Bi, src, poster? }`. Categories & render order: `commercial` -> `course` -> `professional`.
- **Professional photos:** `content/photos.ts` (feeds both the gallery and the **hero slideshow**).
- **Course gallery tab (photos+videos):** `content/course.ts`.
- **UI chrome / labels / nav / section titles:** `lib/i18n.tsx` (the `ui` dictionary) and a few inline `{he,en,ar}` objects in components.

## 6. Media rules
- Videos are **self-hosted MP4** in `public/videos/` and played via `components/VideoPlayer.tsx` (HTML5). Cards show a **muted, looping, in-view autoplay preview** (`VideoThumb.tsx`); clicking opens a modal with sound.
- Keep each file comfortably **under 25 MB** (Cloudflare static-asset per-file limit). Current files are 1.7-13.5 MB.
- Images: keep ~200-300 KB, ~1600px long edge. No build-time image optimizer (static export).
- `ffmpeg` is **not installed**, so video poster frames / preview clips aren't auto-generated.

## 7. Local dev & deploy commands
```bash
npm install          # first time
npm run dev          # local dev server (http://localhost:3000)
npm run build        # production build -> static site in out/
npm run lint
# Deploy:
git add -A && git commit -m "..." && git push origin main   # Cloudflare auto-builds & deploys
```

## 8. Known gotchas / decisions
- **Do NOT put the project in OneDrive.** OneDrive file-locking corrupted `node_modules`/lockfile and broke `npm ci` on Cloudflare. It now lives at `C:\Dev\actor-portfolio`.
- **Static export only** (`output: "export"`) - no server-side code, no API routes, no server image optimization.
- Cloudflare was first mis-detected as an OpenNext/Workers app; fixed by `wrangler.jsonc` pointing at `./out`.
- `metadataBase` in `app/layout.tsx` is still a **placeholder** - update to the real `*.pages.dev` URL for correct SEO/social previews.
- Windows line-ending warnings (LF<->CRLF) on commit are harmless.
- **Currently hidden** (by design, until content exists): the **CV download button** (`contact.cvPath: ""` in `site.ts`) and the **Showreel section** (`showreel.vimeoId: ""`).
- `components/VimeoPlayer.tsx` is legacy/unused (kept for a possible future Vimeo showreel).
- Repo contains `AGENTS.md` / `CLAUDE.md` with agent guidance.

## 9. Current state & open tasks
- Live, tri-lingual, with: hero photo slideshow, About (bio + skills + **Languages & Accents** incl. Arabic dialects: Lebanese/Palestinian/Syrian/Egyptian), Video section (Big Brother 2021 promo, course clips incl. "דמות קיצון" roles, studio shoot), tabbed photo+video gallery, Contact.
- **Pending / nice-to-have:** real CV PDF (then set `cvPath` and the button shows), a dedicated showreel, custom domain, and updating `metadataBase`.

## 10. Typical requests an agent can handle
- "Add a video/photo" -> drop file in `public/...` and add an entry in the relevant `content/*.ts`.
- "Change any text / translate" -> edit `content/*.ts` or `lib/i18n.tsx`.
- "Add a 4th language" -> extend `Lang`/`LANGS`/`dirFor` and `Bi` in `lib/i18n.tsx` + `LanguageSwitcher.tsx`.
- "Publish changes" -> commit and `git push origin main`.
