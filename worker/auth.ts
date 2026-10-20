export type AuthEnv = {
  DB: D1Database;
  TRACKING_KEY: string;
  AUTH_LIMITER?: RateLimit;
  ADMIN_SETUP_HASH?: string;
};
const encoder = new TextEncoder();
const hex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer), (v) =>
    v.toString(16).padStart(2, "0"),
  ).join("");
export async function digest(value: string) {
  return hex(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}
async function mac(env: AuthEnv, value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(env.TRACKING_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return hex(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}
function equal(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
async function passwordHash(env: AuthEnv, password: string, salt: string) {
  // Pepper prevents an isolated database export from becoming an offline password oracle.
  const peppered = await mac(env, password),
    key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(peppered),
      "PBKDF2",
      false,
      ["deriveBits"],
    );
  return hex(
    await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: encoder.encode(salt),
        iterations: 100000,
      },
      key,
      256,
    ),
  );
}
export async function passwordOwner(req: Request, env: AuthEnv) {
  const token = req.headers
    .get("Cookie")
    ?.match(/(?:^|;\s*)portfolio_owner=([^;]+)/)?.[1];
  if (!token) return false;
  const [version, expires, signature] = token.split(".");
  if (!version || !expires || !signature || Number(expires) < Date.now())
    return false;
  const row = await env.DB.prepare(
    "SELECT version FROM owner_auth WHERE id=1",
  ).first<{ version: string }>();
  if (!row || row.version !== version) return false;
  return equal(signature, await mac(env, version + "." + expires));
}
export async function authAction(
  req: Request,
  env: AuthEnv,
  path: string,
  body: Record<string, unknown>,
) {
  const headers = {
    "Cache-Control": "no-store",
    "Content-Type": "application/json",
  };
  const response = (data: unknown, status = 200, cookie?: string) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...headers, ...(cookie ? { "Set-Cookie": cookie } : {}) },
    });
  if (path !== "status" && req.method !== "POST")
    return response({ error: "Method not allowed" }, 405);
  if (path === "status")
    return response({
      configured: !!(await env.DB.prepare(
        "SELECT id FROM owner_auth WHERE id=1",
      ).first()),
    });
  if (req.headers.get("Origin") !== new URL(req.url).origin)
    return response({ error: "Invalid origin" }, 403);
  if (path === "logout")
    return response(
      { ok: true },
      200,
      "portfolio_owner=; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
    );
  const ip = req.headers.get("CF-Connecting-IP") || "unknown";
  if (env.AUTH_LIMITER && !(await env.AUTH_LIMITER.limit({ key: ip })).success)
    return response(
      { error: "Too many attempts. Please wait one minute." },
      429,
    );
  const bucket = Math.floor(Date.now() / 3600000);
  const counter = await env.DB.prepare(
    "INSERT INTO auth_attempts(bucket,count) VALUES(?,1) ON CONFLICT(bucket) DO UPDATE SET count=count+1 RETURNING count",
  )
    .bind(bucket)
    .first<{ count: number }>();
  if ((counter?.count || 0) > 100)
    return response(
      { error: "Sign-in temporarily limited. Try again later." },
      429,
    );
  const password = body.password;
  if (typeof password !== "string" || password.length > 256)
    return response({ error: "Invalid credentials" }, 400);
  let row = await env.DB.prepare("SELECT * FROM owner_auth WHERE id=1").first<{
    salt: string;
    hash: string;
    version: string;
  }>();
  if (path === "setup") {
    if (row)
      return response(
        { error: "The owner account is already configured. Sign in instead." },
        409,
      );
    if (
      !env.ADMIN_SETUP_HASH ||
      typeof body.token !== "string" ||
      !equal(await digest(body.token), env.ADMIN_SETUP_HASH)
    )
      return response({ error: "Invalid setup link" }, 403);
    if (password.length < 16)
      return response(
        {
          error: "Choose a password or passphrase with at least 16 characters.",
        },
        400,
      );
    const salt = crypto.randomUUID(),
      version = crypto.randomUUID(),
      hash = await passwordHash(env, password, salt);
    const result = await env.DB.prepare(
      "INSERT OR IGNORE INTO owner_auth(id,salt,hash,version) VALUES(1,?,?,?)",
    )
      .bind(salt, hash, version)
      .run();
    if (!result.meta.changes)
      return response({ error: "Account already configured" }, 409);
    row = { salt, hash, version };
  } else if (path === "login") {
    const hash = await passwordHash(env, password, row?.salt || "unconfigured");
    if (!row || !equal(hash, row.hash))
      return response({ error: "Invalid password" }, 401);
  } else return response({ error: "Not found" }, 404);
  const expires = Date.now() + 24 * 60 * 60 * 1000,
    token =
      row.version +
      "." +
      expires +
      "." +
      (await mac(env, row.version + "." + expires));
  return response(
    { ok: true },
    200,
    `portfolio_owner=${token}; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
  );
}
