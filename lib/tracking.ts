"use client";

type Ticket = {
  token: string;
  sessionId: string;
  expires: number;
  ref: string;
};
let ticket: Ticket | null = null;
let pending: Promise<Ticket | null> | null = null;
export function measurementDisabled() {
  try {
    return (
      localStorage.getItem("portfolio.tracking.disabled") === "1" ||
      navigator.globalPrivacyControl === true
    );
  } catch {
    return true;
  }
}
export function disableMeasurement(disabled: boolean) {
  try {
    localStorage.setItem("portfolio.tracking.disabled", disabled ? "1" : "0");
  } catch {}
  ticket = null;
}
async function session(): Promise<Ticket | null> {
  if (
    measurementDisabled() ||
    location.pathname.startsWith("/admin") ||
    location.search.includes("preview=")
  )
    return null;
  const ref = new URLSearchParams(location.search).get("ref") || "";
  if (ticket && ticket.expires > Date.now() && ticket.ref === ref)
    return ticket;
  if (pending) return pending;
  pending = (async () => {
    try {
      const cached = JSON.parse(
        sessionStorage.getItem("portfolio.session") || "null",
      ) as Ticket | null;
      if (cached && cached.expires > Date.now() && cached.ref === ref)
        return (ticket = cached);
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref }),
      });
      if (!response.ok) return null;
      ticket = { ...((await response.json()) as Ticket), ref };
      sessionStorage.setItem("portfolio.session", JSON.stringify(ticket));
      return ticket;
    } catch {
      return null;
    }
  })();
  const result = await pending;
  pending = null;
  return result;
}
export async function track(
  type: string,
  media = "",
  details: Record<string, string | number> = {},
) {
  const active = await session();
  if (!active || measurementDisabled()) return;
  const data = JSON.stringify({
    token: active.token,
    id: crypto.randomUUID(),
    type,
    media,
    details,
  });
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
    keepalive: true,
  }).catch(() => {});
}

declare global {
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}
