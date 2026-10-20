import { renderToString } from "react-dom/server.browser";
import { createRemoteJWKSet, jwtVerify } from "jose";
import {
  ContentProvider,
  defaultContent,
  type SiteContent,
} from "../lib/content";
import { LanguageProvider } from "../lib/i18n";
import { Portfolio } from "../components/Portfolio";
import { authAction, passwordOwner } from "./auth";
import { validateContent } from "./validation";
import template from "../build/home-template.html";

type Env = {
  ASSETS: Fetcher;
  DB: D1Database;
  MEDIA: R2Bucket;
  ACCESS_AUD: string;
  ACCESS_DOMAIN: string;
  OWNER_EMAIL: string;
  TRACKING_KEY: string;
  ADMIN_SETUP_HASH?: string;
  AUTH_LIMITER?: RateLimit;
  RATE_LIMITER?: RateLimit;
  DEV_AUTH?: string;
};
const json = (value: unknown, status = 200) =>
  Response.json(value, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
const now = () => new Date().toISOString();
const jwks = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
async function owner(req: Request, env: Env) {
  // A development bypass is accepted only for an explicit local configuration and loopback host.
  if (
    env.DEV_AUTH === "local-only" &&
    ["localhost", "127.0.0.1"].includes(new URL(req.url).hostname)
  )
    return "local-development";
  if (await passwordOwner(req, env)) return env.OWNER_EMAIL;
  const token = req.headers.get("Cf-Access-Jwt-Assertion");
  if (!env.ACCESS_AUD || !env.ACCESS_DOMAIN || !token) return null;
  const issuer = `https://${env.ACCESS_DOMAIN}`;
  try {
    if (!jwks.has(issuer))
      jwks.set(
        issuer,
        createRemoteJWKSet(new URL(issuer + "/cdn-cgi/access/certs")),
      );
    const { payload } = await jwtVerify(token, jwks.get(issuer)!, {
      issuer,
      audience: env.ACCESS_AUD,
      algorithms: ["RS256"],
    });
    return typeof payload.email === "string" &&
      payload.email.toLowerCase() === env.OWNER_EMAIL.toLowerCase()
      ? payload.email
      : null;
  } catch {
    return null;
  }
}
async function readBody(req: Request, max = 800000) {
  if (Number(req.headers.get("Content-Length") || 0) > max)
    throw new Error("Request too large");
  const reader = req.body?.getReader();
  if (!reader) throw new Error("Missing body");
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > max) {
      await reader.cancel();
      throw new Error("Request too large");
    }
    chunks.push(value);
  }
  const data = new Uint8Array(length);
  let offset = 0;
  for (const c of chunks) {
    data.set(c, offset);
    offset += c.length;
  }
  return JSON.parse(new TextDecoder().decode(data));
}
async function document(env: Env, id: string) {
  return await env.DB.prepare("SELECT * FROM documents WHERE id=?")
    .bind(id)
    .first<{ body: string; revision: number; updated_at: string }>();
}
async function draft(env: Env) {
  const value = await document(env, "draft");
  if (value)
    return {
      content: JSON.parse(value.body) as SiteContent,
      revision: value.revision,
      updatedAt: value.updated_at,
    };
  return { content: defaultContent, revision: 0, updatedAt: null };
}
async function published(env: Env) {
  const row = await document(env, "published");
  return row ? (JSON.parse(row.body) as SiteContent) : defaultContent;
}
const b64 = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
async function sign(env: Env, text: string) {
  if (!env.TRACKING_KEY) throw new Error("Tracking is not configured");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.TRACKING_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return b64(
    new Uint8Array(
      await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text)),
    ),
  );
}
async function verifyTicket(env: Env, token: unknown) {
  if (typeof token !== "string" || token.length > 400) return null;
  const [id, expiry, sig] = token.split(".");
  if (!id || !expiry || !sig || Number(expiry) < Date.now()) return null;
  const expected = await sign(env, `${id}.${expiry}`);
  if (sig.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++)
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff ? null : id;
}
function escape(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
async function home(
  req: Request,
  env: Env,
  content: SiteContent,
  preview = false,
) {
  const rendered = renderToString(
    <ContentProvider content={content}>
      <LanguageProvider>
        <Portfolio />
      </LanguageProvider>
    </ContentProvider>,
  );
  const data = JSON.stringify(content)
    .replaceAll("<", "\\u003c")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
  const url = new URL(req.url);
  url.pathname = "/";
  url.search = "";
  const image = new URL(content.seo.image || "/images/headshot-01.jpg", url)
    .href;
  const metadata = `<title>${escape(content.seo.title)}</title><meta name="description" content="${escape(content.seo.description)}"><meta property="og:title" content="${escape(content.seo.title)}"><meta property="og:description" content="${escape(content.seo.description)}"><meta property="og:image" content="${escape(image)}"><meta property="og:url" content="${escape(url.href)}"><link rel="canonical" href="${escape(url.href)}">${preview ? '<meta name="robots" content="noindex,nofollow">' : ""}`;
  const html = template
    .replace("<!--PORTFOLIO_META-->", metadata)
    .replace(
      "<!--PORTFOLIO_BODY-->",
      `<div id="portfolio-root">${rendered}</div><script id="portfolio-content" type="application/json">${data}</script><script type="module" src="/portfolio-client.js"></script>`,
    );
  return new Response(html, {
    headers: {
      "Content-Type": "text/html;charset=utf-8",
      "Cache-Control": preview ? "no-store" : "no-cache",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      ...(preview ? { "X-Robots-Tag": "noindex,nofollow" } : {}),
    },
  });
}
async function admin(req: Request, env: Env, email: string, path: string) {
  if (
    req.method !== "GET" &&
    req.headers.get("Origin") !== new URL(req.url).origin
  )
    return json({ error: "Invalid origin" }, 403);
  if (path === "/admin/api/content") {
    if (req.method === "GET") return json(await draft(env));
    if (req.method === "PUT") {
      const input = await readBody(req);
      const content = validateContent(input.content),
        time = now();
      const revision = Number(input.revision);
      if (!Number.isInteger(revision) || revision < 0)
        return json({ error: "Invalid revision" }, 400);
      let changes = 0;
      if (revision === 0) {
        const r = await env.DB.prepare(
          "INSERT OR IGNORE INTO documents(id,body,revision,updated_at) VALUES(?,?,1,?)",
        )
          .bind("draft", JSON.stringify(content), time)
          .run();
        changes = r.meta.changes;
      } else {
        const r = await env.DB.prepare(
          "UPDATE documents SET body=?,revision=revision+1,updated_at=? WHERE id=? AND revision=?",
        )
          .bind(JSON.stringify(content), time, "draft", revision)
          .run();
        changes = r.meta.changes;
      }
      if (!changes)
        return json(
          {
            error: "Another edit was saved. Reload before saving your changes.",
          },
          409,
        );
      return json({ revision: revision + 1, updatedAt: time });
    }
  }
  if (path === "/admin/api/publish" && req.method === "POST") {
    const input = await readBody(req, 1000);
    const d = await draft(env);
    if (d.revision !== input.revision || !d.revision)
      return json({ error: "Save the draft before publishing." }, 409);
    validateContent(d.content);
    const time = now(),
      id = crypto.randomUUID();
    const results = await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO versions(id,body,created_at,author) SELECT ?,body,?,? FROM documents WHERE id=? AND revision=?",
      ).bind(id, time, email, "draft", d.revision),
      env.DB.prepare(
        "INSERT INTO documents(id,body,revision,updated_at) SELECT ?,body,revision,? FROM documents WHERE id=? AND revision=? ON CONFLICT(id) DO UPDATE SET body=excluded.body,revision=excluded.revision,updated_at=excluded.updated_at",
      ).bind("published", time, "draft", d.revision),
    ]);
    if (!results[0].meta.changes)
      return json({ error: "Draft changed. Reload before publishing." }, 409);
    return json({ publishedAt: time });
  }
  if (path === "/admin/api/versions" && req.method === "GET")
    return json(
      (
        await env.DB.prepare(
          "SELECT id,created_at,author FROM versions ORDER BY created_at DESC LIMIT 30",
        ).all()
      ).results,
    );
  if (path.startsWith("/admin/api/versions/") && req.method === "GET") {
    const row = await env.DB.prepare("SELECT body FROM versions WHERE id=?")
      .bind(path.split("/").at(-1))
      .first<{ body: string }>();
    return row
      ? json(JSON.parse(row.body))
      : json({ error: "Version not found" }, 404);
  }
  if (path === "/admin/api/links") {
    if (req.method === "GET")
      return json(
        (
          await env.DB.prepare(
            `SELECT l.*,COUNT(DISTINCT s.id) AS visits,MAX(e.created_at) AS last_activity,COUNT(DISTINCT CASE WHEN e.type='video_play' THEN s.id END) AS video_visits FROM agency_links l LEFT JOIN sessions s ON s.link_id=l.id LEFT JOIN events e ON e.session_id=s.id GROUP BY l.id ORDER BY l.created_at DESC`,
          ).all()
        ).results,
      );
    if (req.method === "POST") {
      const b = await readBody(req, 5000);
      if (
        typeof b.agency !== "string" ||
        !b.agency.trim() ||
        b.agency.length > 200
      )
        return json({ error: "Enter an agency name" }, 400);
      const id = b64(crypto.getRandomValues(new Uint8Array(12)));
      await env.DB.prepare(
        "INSERT INTO agency_links(id,agency,contact,notes,created_at) VALUES(?,?,?,?,?)",
      )
        .bind(
          id,
          b.agency.trim(),
          String(b.contact || "").slice(0, 200),
          String(b.notes || "").slice(0, 2000),
          now(),
        )
        .run();
      return json({ id });
    }
  }
  if (path.startsWith("/admin/api/links/") && req.method === "PATCH") {
    const b = await readBody(req, 1000);
    await env.DB.prepare("UPDATE agency_links SET active=? WHERE id=?")
      .bind(b.active ? 1 : 0, path.split("/").at(-1))
      .run();
    return json({ ok: true });
  }
  if (path === "/admin/api/events" && req.method === "GET") {
    const u = new URL(req.url),
      link = u.searchParams.get("link"),
      before = u.searchParams.get("before") || "9999",
      limit = 200;
    const rows = await env.DB.prepare(
      `SELECT e.*,s.link_id,l.agency FROM events e JOIN sessions s ON s.id=e.session_id LEFT JOIN agency_links l ON l.id=s.link_id WHERE (? IS NULL OR s.link_id=?) AND e.created_at<? ORDER BY e.created_at DESC,e.id DESC LIMIT ?`,
    )
      .bind(link, link, before, limit)
      .all();
    return json(rows.results);
  }
  if (path === "/admin/api/events" && req.method === "DELETE") {
    const b = await readBody(req, 1000);
    if (b.sessionId)
      await env.DB.prepare("DELETE FROM sessions WHERE id=?")
        .bind(String(b.sessionId))
        .run();
    else if (b.linkId)
      await env.DB.prepare("DELETE FROM sessions WHERE link_id=?")
        .bind(String(b.linkId))
        .run();
    else return json({ error: "Choose a session or agency link" }, 400);
    return json({ ok: true });
  }
  if (path === "/admin/api/upload" && req.method === "POST") {
    const type = req.headers.get("Content-Type") || "";
    const extensions: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "application/pdf": "pdf",
      "video/mp4": "mp4",
    };
    if (!extensions[type])
      return json({ error: "Upload a JPG, PNG, WebP, PDF or MP4 file." }, 400);
    const max = type === "video/mp4" ? 24 * 1024 * 1024 : 10 * 1024 * 1024;
    const length = Number(req.headers.get("Content-Length") || 0);
    if (!length || length > max)
      return json(
        {
          error:
            type === "video/mp4"
              ? "MP4 uploads must be under 24 MB."
              : "File must be under 10 MB.",
        },
        400,
      );
    const key = crypto.randomUUID() + "." + extensions[type];
    await env.MEDIA.put(key, req.body, { httpMetadata: { contentType: type } });
    return json({ url: "/media/" + key });
  }
  if (path === "/admin/preview" && req.method === "GET")
    return home(req, env, (await draft(env)).content, true);
  if (path.startsWith("/admin/api/")) return json({ error: "Not found" }, 404);
  if (path === "/admin" || path === "/admin/") {
    const u = new URL(req.url);
    u.pathname = "/admin/";
    return env.ASSETS.fetch(new Request(u, req));
  }
  return json({ error: "Not found" }, 404);
}
const worker = {
  async fetch(req: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(req.url),
        path = url.pathname.replace(/\/$/, "") || "/";
      if (path === "/admin" || path.startsWith("/admin/")) {
        if (path.startsWith("/admin/auth/"))
          return authAction(
            req,
            env,
            path.split("/").at(-1)!,
            req.method === "POST" ? await readBody(req, 3000) : {},
          );
        // The public admin shell contains no private data; all content and reporting APIs authenticate separately.
        if (path === "/admin") {
          const u = new URL(req.url);
          u.pathname = "/admin/";
          return env.ASSETS.fetch(new Request(u, req));
        }
        const email = await owner(req, env);
        if (!email) return json({ error: "Owner sign-in required" }, 401);
        const response = await admin(req, env, email, path);
        const headers = new Headers(response.headers);
        headers.set("Cache-Control", "no-store");
        headers.set("X-Robots-Tag", "noindex,nofollow");
        return new Response(response.body, {
          status: response.status,
          headers,
        });
      }
      if (path === "/api/session" && req.method === "POST") {
        if (req.headers.get("Origin") !== url.origin)
          return json({ error: "Invalid origin" }, 403);
        if (
          env.RATE_LIMITER &&
          !(
            await env.RATE_LIMITER.limit({
              key: req.headers.get("CF-Connecting-IP") || "unknown",
            })
          ).success
        )
          return json({ error: "Try later" }, 429);
        const b = await readBody(req, 1000);
        const ref = typeof b.ref === "string" ? b.ref.slice(0, 100) : "";
        const link = ref
          ? await env.DB.prepare(
              "SELECT id,active FROM agency_links WHERE id=?",
            )
              .bind(ref)
              .first<{ id: string; active: number }>()
          : null;
        if (link && !link.active)
          return json({ error: "Tracking disabled for this link" }, 410);
        const id = crypto.randomUUID(),
          expires = Date.now() + 30 * 60 * 1000;
        const sig = await sign(env, `${id}.${expires}`);
        await env.DB.prepare(
          "INSERT INTO sessions(id,link_id,created_at) VALUES(?,?,?)",
        )
          .bind(id, link?.id || null, now())
          .run();
        return json({
          token: `${id}.${expires}.${sig}`,
          sessionId: id,
          expires,
        });
      }
      if (path === "/api/events" && req.method === "POST") {
        if (req.headers.get("Origin") !== url.origin)
          return json({ error: "Invalid origin" }, 403);
        if (
          env.RATE_LIMITER &&
          !(
            await env.RATE_LIMITER.limit({
              key: req.headers.get("CF-Connecting-IP") || "unknown",
            })
          ).success
        )
          return json({ error: "Try later" }, 429);
        const b = await readBody(req, 4000),
          sessionId = await verifyTicket(env, b.token);
        if (!sessionId) return json({ error: "Invalid session" }, 401);
        if (
          ![
            "visit",
            "section",
            "photo_open",
            "video_play",
            "video_progress",
            "video_end",
            "contact",
            "cv",
          ].includes(b.type) ||
          !/^[-\w]{1,100}$/.test(b.id)
        )
          return json({ error: "Invalid event" }, 400);
        const details: Record<string, string | number> = {};
        for (const key of ["playback", "seconds", "coverage"])
          if (typeof b.details?.[key] === "string")
            details[key] = b.details[key].slice(0, 100);
          else if (
            typeof b.details?.[key] === "number" &&
            Number.isFinite(b.details[key])
          )
            details[key] = Math.max(
              0,
              Math.min(key === "coverage" ? 100 : 10800, b.details[key]),
            );
        await env.DB.prepare(
          "INSERT OR IGNORE INTO events(id,session_id,type,media,details,created_at) SELECT ?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM sessions s LEFT JOIN agency_links l ON l.id=s.link_id WHERE s.id=? AND (s.link_id IS NULL OR l.active=1)) AND (SELECT COUNT(*) FROM events WHERE session_id=?)<500",
        )
          .bind(
            b.id,
            sessionId,
            b.type,
            String(b.media || "").slice(0, 250),
            JSON.stringify(details),
            now(),
            sessionId,
            sessionId,
          )
          .run();
        return json({ ok: true });
      }
      if (path === "/" || path === "/index.html")
        return home(req, env, await published(env));
      if (path.startsWith("/media/") && ["GET", "HEAD"].includes(req.method)) {
        const key = path.slice(7);
        if (!/^[\w-]+\.(jpg|png|webp|pdf|mp4)$/.test(key))
          return new Response("Not found", { status: 404 });
        const object = await env.MEDIA.get(key, { range: req.headers });
        if (!object) return new Response("Not found", { status: 404 });
        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        headers.set("Cache-Control", "public,max-age=31536000,immutable");
        headers.set("X-Content-Type-Options", "nosniff");
        headers.set("Accept-Ranges", "bytes");
        let status = 200;
        if (
          req.headers.has("Range") &&
          object.range &&
          "offset" in object.range &&
          object.range.length
        ) {
          status = 206;
          headers.set(
            "Content-Range",
            `bytes ${object.range.offset || 0}-${(object.range.offset || 0) + object.range.length - 1}/${object.size}`,
          );
          headers.set("Content-Length", String(object.range.length));
        } else headers.set("Content-Length", String(object.size));
        return new Response(req.method === "HEAD" ? null : object.body, {
          status,
          headers,
        });
      }
      return env.ASSETS.fetch(req);
    } catch (e) {
      console.error(
        "Request failed",
        e instanceof Error ? e.message : "Unknown error",
      );
      return json(
        { error: e instanceof Error ? e.message : "Request failed" },
        400,
      );
    }
  },
  async scheduled(_controller: ScheduledController, env: Env) {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM sessions WHERE created_at<?").bind(
        new Date(Date.now() - 90 * 86400000).toISOString(),
      ),
      env.DB.prepare("DELETE FROM auth_attempts WHERE bucket<?").bind(
        Math.floor(Date.now() / 3600000) - 24,
      ),
    ]);
  },
};

export default worker;
