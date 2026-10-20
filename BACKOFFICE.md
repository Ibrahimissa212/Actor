# Portfolio backoffice

Public website: https://ibrahimissa-actor.issavi.workers.dev/
Owner editor: https://ibrahimissa-actor.issavi.workers.dev/admin/

## Editing

The editor supports Hebrew, English and Arabic. Blank Arabic translations fall back to Hebrew. Save draft, open Preview, then Publish. Published snapshots appear in Published versions; loading one replaces the editor draft only until it is published again.

Videos can be grouped by category or arranged in a custom sequence. Drag the grip or use the up/down buttons. The same ordering controls work for photos, course media, biography paragraphs and skills. Hidden items remain editable but are omitted from the public site. Media IDs are stable and must not be reused for unrelated content because reports refer to these IDs.

Uploads support JPEG, PNG, WebP and PDF up to 10 MB, and MP4 up to 24 MB. Paste the returned URL into a media or CV field. Larger video/Stream ingestion is not implemented in this version. Existing self-hosted media is preserved. Uploaded objects are public assets; do not upload confidential documents.

## Agency outreach

Create a separate link for each agency/contact. Links contain a random reference, not the recipient's email. Tracking records browser sessions, section exposure, opened photos, explicit full-player playback, playback progress and contact/CV clicks. Card autoplay previews are excluded. Watched seconds measure playback while the page is visible; coverage estimates unique parts of the timeline played. Forwarded links stay attributed to their original reference. A visit does not prove email readership or the identity of a viewer. Browser automation/blockers can create false positives or missing activity.

Owner browsers are excluded automatically when the editor loads. The activity screen includes a toggle for testing. Public visitors can opt out from the footer; Global Privacy Control is respected. Session tickets expire after 30 minutes. No persistent cross-browser visitor identity is created. Raw IPs are used transiently by Cloudflare's rate limiter and are not written to the activity database. Events and sessions are deleted after 90 days by a daily scheduled task. Cloudflare platform logs are separate from this application retention policy; query strings are redacted in configured logs.

## Runtime and deployment

Next.js still builds static assets and the admin shell. `scripts/build.mjs` additionally bundles a Worker and a standalone public hydration entry. The Worker server-renders the same React portfolio components using the published D1 content, including metadata; current text is available in initial HTML for crawlers and link previews. The generated home template reuses Next's CSS and font links, without Next's static page hydration scripts. Dynamic content therefore does not require a build/deploy.

- Worker: `ibrahimissa-actor`
- D1: `actor-backoffice` (independent from Quant Race)
- R2: `actor-portfolio-media`
- Source defaults: `content/*`, `lib/content.tsx`
- Live editing: D1 `documents` draft/published records
- Snapshots: D1 `versions`
- Outreach: `agency_links`, `sessions`, `events`
- Owner credentials: `owner_auth` (salted, peppered PBKDF2 hash)

Build: `npm ci && npm run build`
Checks: `npm run lint && npm test`
Deploy: `npx wrangler deploy`
Initialize a new database: `npx wrangler d1 execute actor-backoffice --remote --file worker/schema.sql`, then the generated `build/seed.sql`. Both are safe to rerun for an existing installation (INSERT OR IGNORE preserves published content).

Required Worker secrets:
- `TRACKING_KEY`: random 256-bit value, used as HMAC key for browser tickets, owner session cookies, and password pepper. Preserve this across deployments. Rotating it invalidates tickets/sessions and requires resetting the owner password.
- `ADMIN_SETUP_HASH`: SHA-256 hex digest of a random 256-bit setup token. Give the owner `/admin/#setup=TOKEN`. The fragment is cleared after opening and is not sent in HTTP request URLs. Setup is possible only while `owner_auth` is empty.

The owner chooses a password/passphrase of at least 16 characters. Cookies are Secure, HttpOnly, SameSite=Strict with a 24-hour lifetime. Login/setup are rate limited, mutation APIs enforce same-origin requests, and content APIs require owner authentication. Optional Cloudflare Access JWT verification is also supported with ACCESS_DOMAIN/ACCESS_AUD and the allowed owner email. Access provisioning through the connector was unavailable during implementation, so password authentication is the active method.

Owner password recovery is currently an operator task: verify the owner's request, generate a fresh setup token/hash, replace `ADMIN_SETUP_HASH`, and delete the single `owner_auth` record. Do not expose the setup token or signing secret in source control. Do not reset credentials if the owner has not asked for it.

Development-only authentication bypass requires explicit `DEV_AUTH=local-only` AND a loopback hostname. It is never configured in production. Integration tests use an isolated in-memory Miniflare database and R2 storage, not production resources.
