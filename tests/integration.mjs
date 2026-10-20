import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
const mf = new Miniflare(
  convertV4MiniflareOptions({
    cf: false,
    workers: [
      {
        name: "actor-test",
        modules: true,
        scriptPath: "build/worker.js",
        compatibilityDate: "2026-10-20",
        d1Databases: { DB: "actor-test" },
        r2Buckets: ["MEDIA"],
        assets: {
          routerConfig: { has_user_worker: true },
          directory: "out",
          binding: "ASSETS",
          run_worker_first: ["/", "/admin", "/admin/*", "/api/*", "/media/*"],
        },
        bindings: {
          OWNER_EMAIL: "ibrahim.issa212@gmail.com",
          TRACKING_KEY: "integration-test-key",
          ADMIN_SETUP_HASH: createHash("sha256")
            .update("test-setup-token")
            .digest("hex"),
          ACCESS_AUD: "",
          ACCESS_DOMAIN: "",
        },
      },
    ],
  }),
);
const origin = "https://example.com";
let cookie = "";
async function call(path, method = "GET", body, auth = true) {
  return mf.dispatchFetch(origin + path, {
    method,
    headers: {
      Origin: origin,
      ...(auth && cookie ? { Cookie: cookie } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
try {
  const db = await mf.getD1Database("DB");
  for (const sql of (await readFile("worker/schema.sql", "utf8"))
    .split(";")
    .filter((s) => s.trim()))
    await db.prepare(sql).run();
  const unauthorized = await call("/admin/api/content");
  if (unauthorized.status !== 401) console.log(await unauthorized.text());
  assert.equal(unauthorized.status, 401);
  assert.equal((await call("/admin/preview")).status, 401);
  assert.equal(
    (
      await call("/admin/auth/setup", "POST", {
        token: "wrong",
        password: "a-secure-password-long",
      })
    ).status,
    403,
  );
  const setup = await call("/admin/auth/setup", "POST", {
    token: "test-setup-token",
    password: "a-secure-password-long",
  });
  assert.equal(setup.status, 200);
  cookie = setup.headers.get("Set-Cookie").split(";")[0];
  assert.match(
    setup.headers.get("Set-Cookie"),
    /HttpOnly; Secure; SameSite=Strict/,
  );
  assert.equal(
    (
      await call("/admin/auth/setup", "POST", {
        token: "test-setup-token",
        password: "a-secure-password-long",
      })
    ).status,
    409,
  );
  const initial = await (await call("/admin/api/content")).json();
  assert.equal(initial.revision, 0);
  const content = initial.content;
  content.profile.name.en = "Published Integration Actor";
  content.profile.name.he = "שחקן בדיקה";
  content.videoLayout = "custom";
  content.videos.reverse();
  const save = await call("/admin/api/content", "PUT", {
    revision: 0,
    content,
  });
  assert.equal(save.status, 200, await save.text());
  assert.equal(
    (await call("/admin/api/content", "PUT", { revision: 0, content })).status,
    409,
  );
  assert.ok(
    !(await (await call("/")).text()).includes("Published Integration Actor"),
  );
  const preview = await call("/admin/preview");
  assert.equal(preview.status, 200);
  assert.match(await preview.text(), /Published Integration Actor/);
  assert.equal(preview.headers.get("X-Robots-Tag"), "noindex,nofollow");
  const invalid = structuredClone(content);
  invalid.contact.socials[0].url = "javascript:alert(1)";
  assert.equal(
    (await call("/admin/api/content", "PUT", { revision: 1, content: invalid }))
      .status,
    400,
  );
  assert.equal(
    (await call("/admin/api/publish", "POST", { revision: 1 })).status,
    200,
  );
  const html = await (await call("/")).text();
  assert.match(html, /Published Integration Actor/);
  assert.match(html, /שחקן בדיקה/);
  assert.ok(
    html.indexOf('data-media-id="' + content.videos[0].id + '"') <
      html.indexOf('data-media-id="' + content.videos.at(-1).id + '"'),
  );
  const versions = await (await call("/admin/api/versions")).json();
  assert.equal(versions.length, 1);
  assert.equal(
    (await (await call("/admin/api/versions/" + versions[0].id)).json()).profile
      .name.en,
    content.profile.name.en,
  );
  const link = await (
    await call("/admin/api/links", "POST", {
      agency: "Agency Integration",
      contact: "Casting",
      notes: "Private test",
    })
  ).json();
  const ticket = await (
    await call("/api/session", "POST", { ref: link.id }, false)
  ).json();
  assert.ok(ticket.token);
  const event = {
    token: ticket.token,
    id: "integration-event-1",
    type: "video_play",
    media: content.videos[0].id,
    details: { playback: "test-playback" },
  };
  assert.equal((await call("/api/events", "POST", event, false)).status, 200);
  await call("/api/events", "POST", event, false);
  const events = await (await call("/admin/api/events?link=" + link.id)).json();
  assert.equal(events.length, 1);
  assert.equal(events[0].agency, "Agency Integration");
  const forged = { ...event, token: ticket.token + "x", id: "forged" };
  assert.equal((await call("/api/events", "POST", forged, false)).status, 401);
  const list = await (await call("/admin/api/links")).json();
  assert.equal(list[0].visits, 1);
  assert.equal(list[0].video_visits, 1);
  await call("/admin/api/links/" + link.id, "PATCH", { active: false });
  assert.equal(
    (await call("/api/session", "POST", { ref: link.id }, false)).status,
    410,
  );
  await call("/api/events", "POST", { ...event, id: "after-disable" }, false);
  assert.equal(
    (await (await call("/admin/api/events?link=" + link.id)).json()).length,
    1,
  );
  await call("/admin/api/events", "DELETE", { sessionId: ticket.sessionId });
  assert.equal(
    (await (await call("/admin/api/events?link=" + link.id)).json()).length,
    0,
  );
  const upload = await mf.dispatchFetch(origin + "/admin/api/upload", {
    method: "POST",
    headers: {
      Origin: origin,
      Cookie: cookie,
      "Content-Type": "application/pdf",
      "Content-Length": "9",
    },
    body: "%PDF-test",
  });
  assert.equal(upload.status, 200);
  const uploaded = await upload.json();
  assert.equal((await call(uploaded.url)).status, 200);
  assert.equal(
    (await call("/admin/auth/login", "POST", { password: "incorrect" })).status,
    401,
  );
  assert.equal(
    (
      await call("/admin/auth/login", "POST", {
        password: "a-secure-password-long",
      })
    ).status,
    200,
  );
  const cross = await mf.dispatchFetch(origin + "/admin/api/publish", {
    method: "POST",
    headers: {
      Origin: "https://evil.example",
      Cookie: cookie,
      "Content-Type": "application/json",
    },
    body: '{"revision":1}',
  });
  assert.equal(cross.status, 403);
  console.log(
    "PASS: owner setup/login, access protection, drafts, preview, publish, revisions, validation, history, agency attribution, deduplication, forged tokens, disabled links, deletion, uploads and CSRF.",
  );
} finally {
  await mf.dispose();
}
