"use client";
/* eslint-disable @next/next/no-img-element, @next/next/no-html-link-for-pages */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ExternalLink,
  GripVertical,
  Link as LinkIcon,
  Plus,
  Save,
  Upload,
  X,
} from "lucide-react";
import { defaultContent, type SiteContent } from "@/lib/content";
import "./backoffice.css";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type LinkRow = {
  id: string;
  agency: string;
  contact: string;
  notes: string;
  active: number;
  visits: number;
  video_visits: number;
  last_activity: string | null;
};
type EventRow = {
  id: string;
  session_id: string;
  link_id: string | null;
  agency: string | null;
  type: string;
  media: string;
  details: string;
  created_at: string;
};
type Version = { id: string; created_at: string; author: string };
const sections = [
  ["profile", "Home"],
  ["about", "About & skills"],
  ["videos", "Videos"],
  ["photos", "Studio photos"],
  ["courseMedia", "Course gallery"],
  ["showreel", "Showreel"],
  ["contact", "Contact & CV"],
  ["ui", "Navigation & buttons"],
  ["labels", "Headings & footer"],
  ["seo", "Search & sharing"],
] as const;
const names: Record<string, string> = {
  heroLine: "Introduction",
  tagline: "Tagline",
  cvPath: "CV file URL",
  src: "Media URL",
  alt: "Image description",
  he: "Hebrew",
  en: "English",
  ar: "Arabic",
  vimeoId: "Vimeo showreel ID (empty hides section)",
  poster: "Poster image URL",
  hidden: "Hidden from website",
  categoryOrder: "Category order",
  videoLayout: "Video layout",
  courseMedia: "Course gallery",
};
const label = (key: string) =>
  names[key] ||
  key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
const time = (date: string | null) =>
  date
    ? new Date(date).toLocaleString("en-GB", {
        timeZone: "Asia/Jerusalem",
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch("/admin/api/" + path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!response.ok) {
    let message = "Request failed";
    try {
      message =
        ((await response.json()) as { error?: string }).error || message;
    } catch {}
    throw new Error(
      response.status === 401 || response.redirected
        ? "Your sign-in expired. Reload this page to sign in."
        : message,
    );
  }
  return (await response.json()) as T;
}
function move<T>(list: T[], index: number, to: number) {
  const copy = [...list];
  if (to < 0 || to >= copy.length) return copy;
  const [item] = copy.splice(index, 1);
  copy.splice(to, 0, item);
  return copy;
}
function caption(value: Json, index: number): string {
  if (typeof value === "string")
    return value.slice(0, 65) || `Item ${index + 1}`;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const title = value.title || value.alt || value.name;
    if (title && typeof title === "object" && !Array.isArray(title))
      return String(title.en || title.he || `Item ${index + 1}`);
    return String(
      value.label || value.id || value.en || value.he || `Item ${index + 1}`,
    );
  }
  return `Item ${index + 1}`;
}
function blankLike(v: Json): Json {
  if (typeof v === "string") return "";
  if (typeof v === "boolean") return false;
  if (Array.isArray(v)) return [];
  if (v && typeof v === "object")
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [
        k,
        k === "id"
          ? crypto.randomUUID()
          : k === "category"
            ? x
            : k === "kind"
              ? x
              : blankLike(x),
      ]),
    );
  return v;
}
function Editor({
  value,
  onChange,
  name,
  path = "",
}: {
  value: Json;
  onChange: (v: Json) => void;
  name: string;
  path?: string;
}) {
  const drag = useRef<number | null>(null);
  if (typeof value === "string") {
    if (name === "id" || name === "kind")
      return (
        <p className="bo-hint">
          {label(name)}: {value}
        </p>
      );
    if (name === "category")
      return (
        <label className="bo-field">
          Category
          <select value={value} onChange={(e) => onChange(e.target.value)}>
            {["commercial", "course", "professional"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      );
    return (
      <label className="bo-field">
        {label(name)}
        <textarea
          dir={name === "he" || name === "ar" ? "rtl" : "ltr"}
          rows={value.length > 160 ? 4 : 2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    );
  }
  if (typeof value === "boolean")
    return (
      <label className="bo-check">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        {label(name)}
      </label>
    );
  if (Array.isArray(value))
    return (
      <div className="bo-list">
        {value.map((item, i) => (
          <details
            key={
              typeof item === "object" &&
              item &&
              !Array.isArray(item) &&
              item.id
                ? String(item.id)
                : i
            }
            className="bo-item"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (drag.current !== null) onChange(move(value, drag.current, i));
              drag.current = null;
            }}
          >
            <summary>
              <span
                draggable
                onDragStart={(e) => {
                  drag.current = i;
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={() => (drag.current = null)}
                className="bo-grip"
                aria-label="Drag to reorder"
              >
                <GripVertical size={18} />
              </span>
              <span className="bo-item-name">
                {i + 1}. {caption(item, i)}
              </span>
              <span className="bo-order">
                <button
                  type="button"
                  title="Move up"
                  disabled={i === 0}
                  onClick={(e) => {
                    e.preventDefault();
                    onChange(move(value, i, i - 1));
                  }}
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  title="Move down"
                  disabled={i === value.length - 1}
                  onClick={(e) => {
                    e.preventDefault();
                    onChange(move(value, i, i + 1));
                  }}
                >
                  <ArrowDown size={16} />
                </button>
              </span>
            </summary>
            <div className="bo-item-body">
              {item &&
                typeof item === "object" &&
                !Array.isArray(item) &&
                typeof item.src === "string" && (
                  <div className="bo-media-preview">
                    {item.kind === "video" || name === "videos" ? (
                      <video src={item.src} controls preload="none" />
                    ) : (
                      <img src={item.src} alt="Media preview" loading="lazy" />
                    )}
                  </div>
                )}
              <Editor
                value={item}
                name={`Item ${i + 1}`}
                path={`${path}.${i}`}
                onChange={(next) =>
                  onChange(value.map((v, j) => (j === i ? next : v)))
                }
              />
              {item &&
                typeof item === "object" &&
                !Array.isArray(item) &&
                "src" in item && (
                  <label className="bo-check">
                    <input
                      type="checkbox"
                      checked={!!item.hidden}
                      onChange={(e) =>
                        onChange(
                          value.map((v, j) =>
                            j === i ? { ...item, hidden: e.target.checked } : v,
                          ),
                        )
                      }
                    />
                    Hidden from website
                  </label>
                )}
              <button
                className="bo-danger"
                onClick={() => {
                  if (confirm("Remove this item from the draft?"))
                    onChange(value.filter((_, j) => j !== i));
                }}
              >
                Remove item
              </button>
            </div>
          </details>
        ))}
        <button
          className="bo-secondary"
          onClick={() => {
            const defaults = path
              .split(".")
              .filter(Boolean)
              .reduce(
                (v, key) =>
                  v && typeof v === "object"
                    ? (v as Record<string, Json>)[key]
                    : null,
                defaultContent as unknown as Json,
              );
            const source =
              value[0] ||
              (Array.isArray(defaults) ? defaults[0] : null) ||
              ({ he: "", en: "", ar: "" } as Json);
            onChange([...value, blankLike(source)]);
          }}
        >
          <Plus size={16} />
          Add item
        </button>
        {name === "courseMedia" && (
          <button
            className="bo-secondary"
            onClick={() =>
              onChange([
                ...value,
                {
                  id: crypto.randomUUID(),
                  kind: "photo",
                  src: "",
                  alt: { he: "", en: "", ar: "" },
                },
              ])
            }
          >
            <Plus size={16} />
            Add course photo
          </button>
        )}
        {name === "courseMedia" && (
          <button
            className="bo-secondary"
            onClick={() =>
              onChange([
                ...value,
                {
                  id: crypto.randomUUID(),
                  kind: "video",
                  src: "",
                  title: { he: "", en: "", ar: "" },
                  alt: { he: "", en: "", ar: "" },
                },
              ])
            }
          >
            <Plus size={16} />
            Add course video
          </button>
        )}
      </div>
    );
  if (value && typeof value === "object") {
    const multilingual = "he" in value && "en" in value;
    const entries = multilingual
      ? ["he", "en", "ar"].map((k) => [k, value[k] || ""] as const)
      : Object.entries(value).filter(([k]) => k !== "hidden");
    return (
      <div className={multilingual ? "bo-translations" : "bo-fields"}>
        {entries.map(([key, item]) => (
          <div
            key={key}
            className={
              typeof item === "object" && !Array.isArray(item) && !multilingual
                ? "bo-field-group"
                : ""
            }
          >
            {typeof item === "object" && item && !multilingual && (
              <h3>{label(key)}</h3>
            )}
            {multilingual && key === "ar" && !item && (
              <span className="bo-hint">Arabic missing — Hebrew fallback</span>
            )}
            <Editor
              value={item}
              name={key}
              path={`${path}.${key}`}
              onChange={(v) => onChange({ ...value, [key]: v })}
            />
          </div>
        ))}
      </div>
    );
  }
  return null;
}
function EditorWorkspace() {
  const [content, setContent] = useState<SiteContent>(defaultContent),
    [revision, setRevision] = useState(0),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [dirty, setDirty] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const [tab, setTab] = useState("profile"),
    [links, setLinks] = useState<LinkRow[]>([]),
    [events, setEvents] = useState<EventRow[]>([]),
    [versions, setVersions] = useState<Version[]>([]),
    [filter, setFilter] = useState(""),
    [agency, setAgency] = useState(""),
    [contact, setContact] = useState(""),
    [notes, setNotes] = useState(""),
    [exclude, setExclude] = useState(true);
  const task = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  };
  const load = useCallback(async () => {
    const data = await api<{ content: SiteContent; revision: number }>(
      "content",
    );
    setContent(data.content);
    setRevision(data.revision);
    setDirty(false);
  }, []);
  useEffect(() => {
    void Promise.resolve()
      .then(load)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    try {
      localStorage.setItem("portfolio.tracking.disabled", "1");
    } catch {}
  }, [load]);
  useEffect(() => {
    const guard = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);
  const update = (key: string, value: Json) => {
    setContent((c) => ({ ...c, [key]: value }));
    setDirty(true);
    setMessage("");
  };
  const save = async () => {
    const result = await api<{ revision: number }>("content", {
      method: "PUT",
      body: JSON.stringify({ content, revision }),
    });
    setRevision(result.revision);
    setDirty(false);
    setMessage("Draft saved. The live website has not changed.");
    return result.revision;
  };
  const refreshEvents = useCallback(async (link: string) => {
    setEvents(
      await api<EventRow[]>(
        "events" + (link ? "?link=" + encodeURIComponent(link) : ""),
      ),
    );
  }, []);
  useEffect(() => {
    if (tab === "links" || tab === "activity")
      api<LinkRow[]>("links")
        .then(setLinks)
        .catch((e) => setError(e.message));
    if (tab === "activity")
      api<EventRow[]>(
        "events" + (filter ? "?link=" + encodeURIComponent(filter) : ""),
      )
        .then(setEvents)
        .catch((e) => setError(e.message));
    if (tab === "history")
      api<Version[]>("versions")
        .then(setVersions)
        .catch((e) => setError(e.message));
  }, [tab, filter, refreshEvents]);
  const preview = async () => {
    const popup = window.open("about:blank", "portfolio-preview");
    await task(async () => {
      try {
        if (dirty || revision === 0) await save();
        if (popup) popup.location.href = "/admin/preview?preview=1";
      } catch (e) {
        popup?.close();
        throw e;
      }
    });
  };
  const exportCSV = () => {
    const quote = (v: unknown) => {
      let text = String(v ?? "");
      if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
      return '"' + text.replaceAll('"', '""') + '"';
    };
    const csv = [
      ["Time (UTC)", "Agency", "Session", "Action", "Content", "Details"],
      ...events.map((e) => [
        e.created_at,
        e.agency,
        e.session_id,
        e.type,
        e.media,
        e.details,
      ]),
    ]
      .map((row) => row.map(quote).join(","))
      .join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv" }),
    );
    a.download = "portfolio-activity.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setMessage("Link copied.");
  };
  return (
    <div className="backoffice" dir="ltr">
      <aside className="bo-sidebar">
        <a className="bo-brand" href="/admin/">
          IBRAHIM ISSA<span>Portfolio studio</span>
        </a>
        <p className="bo-nav-label">CONTENT</p>
        <nav>
          {sections.map(([id, title]) => (
            <button
              className={tab === id ? "active" : ""}
              key={id}
              onClick={() => setTab(id)}
            >
              {title}
            </button>
          ))}
        </nav>
        <p className="bo-nav-label">OUTREACH</p>
        <nav>
          {[
            ["links", "Agency links"],
            ["activity", "Visitor activity"],
            ["history", "Published versions"],
          ].map(([id, title]) => (
            <button
              className={tab === id ? "active" : ""}
              key={id}
              onClick={() => setTab(id)}
            >
              {title}
            </button>
          ))}
        </nav>
        <a className="bo-live" href="/" target="_blank" rel="noreferrer">
          Open website <ExternalLink size={15} />
        </a>
        <a
          className="bo-live"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            void fetch("/admin/auth/logout", { method: "POST" }).then(() =>
              location.reload(),
            );
          }}
        >
          Sign out
        </a>
      </aside>
      <div className="bo-workspace">
        <header className="bo-toolbar">
          <span className={dirty ? "bo-status unsaved" : "bo-status"}>
            {dirty ? "Unsaved changes" : "Draft workspace"}
          </span>
          <div>
            <button
              disabled={busy || loading}
              className="bo-secondary"
              onClick={preview}
            >
              <ExternalLink size={16} />
              Preview
            </button>
            <button
              disabled={busy || loading}
              className="bo-secondary"
              onClick={() =>
                task(async () => {
                  await save();
                })
              }
            >
              <Save size={16} />
              Save draft
            </button>
            <button
              disabled={busy || loading}
              className="bo-primary"
              onClick={() =>
                task(async () => {
                  const rev = dirty || revision === 0 ? await save() : revision;
                  await api("publish", {
                    method: "POST",
                    body: JSON.stringify({ revision: rev }),
                  });
                  setMessage("Published. Your website now shows this content.");
                })
              }
            >
              <Check size={16} />
              Publish
            </button>
          </div>
        </header>
        <main className="bo-main">
          <p className="bo-kicker">YOUR PORTFOLIO, YOUR CONTROL</p>
          <h1>
            {sections.find(([id]) => id === tab)?.[1] ||
              {
                links: "Agency links",
                activity: "Visitor activity",
                history: "Published versions",
              }[tab]}
          </h1>
          <p className="bo-intro">
            {tab === "links"
              ? "Create a personal link for each agency or contact. Forwarded links remain attributed to the original outreach."
              : tab === "activity"
                ? "Recorded browser activity. Times are shown in Israel time. Playback and visits are signals of engagement, not proof of identity or an email read."
                : tab === "history"
                  ? "Restore a published version into your draft, preview it, then publish when ready."
                  : "Edit your content in Hebrew, English and Arabic. Save your draft, preview it, then publish."}
          </p>
          {error && (
            <div role="alert" className="bo-alert error">
              {error}
            </div>
          )}
          {message && (
            <div role="status" className="bo-alert">
              {message}
            </div>
          )}
          {loading ? (
            <p>Loading your portfolio…</p>
          ) : (
            <>
              {sections.some(([id]) => id === tab) && (
                <>
                  {tab === "videos" && (
                    <div className="bo-panel">
                      <label className="bo-field">
                        Layout
                        <select
                          value={content.videoLayout}
                          onChange={(e) =>
                            update("videoLayout", e.target.value)
                          }
                        >
                          <option value="grouped">Grouped by category</option>
                          <option value="custom">
                            Custom sequence — all videos
                          </option>
                        </select>
                      </label>
                      {content.videoLayout === "grouped" && (
                        <div>
                          <h3>Category order</h3>
                          {content.categoryOrder.map((c, i) => (
                            <div className="bo-category" key={c}>
                              <span>{c}</span>
                              <button
                                disabled={i === 0}
                                onClick={() =>
                                  update(
                                    "categoryOrder",
                                    move(content.categoryOrder, i, i - 1),
                                  )
                                }
                              >
                                <ArrowUp size={16} />
                              </button>
                              <button
                                disabled={i === 2}
                                onClick={() =>
                                  update(
                                    "categoryOrder",
                                    move(content.categoryOrder, i, i + 1),
                                  )
                                }
                              >
                                <ArrowDown size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="bo-hint">
                        Drag the grip or use arrows. In grouped mode, video
                        order applies within each category.
                      </p>
                    </div>
                  )}
                  <div className="bo-panel">
                    <fieldset disabled={busy}>
                      <Editor
                        name={tab}
                        path={tab}
                        value={
                          content[tab as keyof SiteContent] as unknown as Json
                        }
                        onChange={(v) => update(tab, v)}
                      />
                    </fieldset>
                  </div>
                  {[
                    "videos",
                    "photos",
                    "courseMedia",
                    "contact",
                    "seo",
                  ].includes(tab) && (
                    <div className="bo-panel">
                      <h2>Upload a file</h2>
                      <p className="bo-hint">
                        JPG, PNG, WebP or PDF up to 10 MB; MP4 up to 24 MB.
                        Upload, then paste the returned URL into the relevant
                        field above.
                      </p>
                      <label className="bo-upload">
                        <Upload size={18} />
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,application/pdf,video/mp4"
                          disabled={busy}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            void task(async () => {
                              const r = await fetch("/admin/api/upload", {
                                method: "POST",
                                headers: { "Content-Type": file.type },
                                body: file,
                              });
                              const result = (await r.json()) as {
                                error?: string;
                                url: string;
                              };
                              if (!r.ok) throw new Error(result.error);
                              setMessage("Uploaded file URL: " + result.url);
                              await navigator.clipboard
                                .writeText(result.url)
                                .catch(() => {});
                            });
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  )}
                </>
              )}
              {tab === "links" && (
                <>
                  <form
                    className="bo-panel bo-fields"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void task(async () => {
                        await api("links", {
                          method: "POST",
                          body: JSON.stringify({ agency, contact, notes }),
                        });
                        setAgency("");
                        setContact("");
                        setNotes("");
                        setLinks(await api("links"));
                        setMessage(
                          "Agency link created. Copy it from the list below.",
                        );
                      });
                    }}
                  >
                    <label className="bo-field">
                      Agency name
                      <input
                        required
                        value={agency}
                        maxLength={200}
                        onChange={(e) => setAgency(e.target.value)}
                      />
                    </label>
                    <label className="bo-field">
                      Contact (optional)
                      <input
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                      />
                    </label>
                    <label className="bo-field">
                      Private notes
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </label>
                    <button className="bo-primary" disabled={busy}>
                      <Plus size={16} />
                      Create link
                    </button>
                  </form>
                  <div className="bo-cards">
                    {links.map((l) => (
                      <article className="bo-panel" key={l.id}>
                        <div className="bo-card-heading">
                          <h2>{l.agency}</h2>
                          <span className="bo-pill">
                            {l.active ? "Active" : "Tracking disabled"}
                          </span>
                        </div>
                        <p>{l.contact}</p>
                        <p className="bo-hint">{l.notes}</p>
                        <div className="bo-stats">
                          <span>
                            <b>{l.visits}</b>browser sessions
                          </span>
                          <span>
                            <b>{l.video_visits}</b>sessions with playback
                          </span>
                        </div>
                        <p className="bo-hint">
                          Last activity: {time(l.last_activity)}
                        </p>
                        <code className="bo-url">
                          {typeof window !== "undefined"
                            ? window.location.origin
                            : ""}
                          /?ref={l.id}
                        </code>
                        <div className="bo-actions">
                          <button
                            className="bo-secondary"
                            onClick={() =>
                              task(() =>
                                copy(location.origin + "/?ref=" + l.id),
                              )
                            }
                          >
                            <LinkIcon size={16} />
                            Copy link
                          </button>
                          <button
                            className="bo-secondary"
                            onClick={() => {
                              setFilter(l.id);
                              setTab("activity");
                            }}
                          >
                            View activity
                          </button>
                          <button
                            className="bo-secondary"
                            onClick={() =>
                              task(async () => {
                                await api("links/" + l.id, {
                                  method: "PATCH",
                                  body: JSON.stringify({ active: !l.active }),
                                });
                                setLinks(await api("links"));
                              })
                            }
                          >
                            {l.active ? "Disable tracking" : "Enable tracking"}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
              {tab === "activity" && (
                <>
                  <div className="bo-panel bo-actions">
                    <label className="bo-field">
                      Agency
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      >
                        <option value="">
                          All visits, including unassigned
                        </option>
                        {links.map((l) => (
                          <option value={l.id} key={l.id}>
                            {l.agency}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      className="bo-secondary"
                      disabled={busy}
                      onClick={() => task(() => refreshEvents(filter))}
                    >
                      Refresh
                    </button>
                    <button className="bo-secondary" onClick={exportCSV}>
                      Export displayed events
                    </button>
                    <label className="bo-check">
                      <input
                        checked={exclude}
                        type="checkbox"
                        onChange={(e) => {
                          setExclude(e.target.checked);
                          localStorage.setItem(
                            "portfolio.tracking.disabled",
                            e.target.checked ? "1" : "0",
                          );
                        }}
                      />
                      Exclude this browser from tracking
                    </label>
                  </div>
                  <p className="bo-hint">
                    Newest 200 events. Events are retained for 90 days. Autoplay
                    card previews are excluded. Automated browser visits may
                    still appear.
                  </p>
                  <div className="bo-panel bo-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Time (Israel)</th>
                          <th>Agency / session</th>
                          <th>Action</th>
                          <th>Content</th>
                          <th>Details</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((e) => (
                          <tr key={e.id}>
                            <td>{time(e.created_at)}</td>
                            <td>
                              {e.agency || "Unassigned"}
                              <small>{e.session_id.slice(0, 8)}</small>
                            </td>
                            <td>{e.type.replaceAll("_", " ")}</td>
                            <td>
                              {[
                                ...content.videos,
                                ...content.photos,
                                ...content.courseMedia,
                              ].find((v) => v.id === e.media)?.id === e.media
                                ? caption(
                                    [
                                      ...content.videos,
                                      ...content.photos,
                                      ...content.courseMedia,
                                    ].find(
                                      (v) => v.id === e.media,
                                    ) as unknown as Json,
                                    0,
                                  )
                                : e.media}
                            </td>
                            <td>
                              {(() => {
                                const d = JSON.parse(e.details);
                                return d.seconds !== undefined
                                  ? `${d.seconds}s played · ${d.coverage}% covered`
                                  : "";
                              })()}
                            </td>
                            <td>
                              <button
                                title="Delete this session's activity"
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Delete all events from this browser session?",
                                    )
                                  )
                                    void task(async () => {
                                      await api("events", {
                                        method: "DELETE",
                                        body: JSON.stringify({
                                          sessionId: e.session_id,
                                        }),
                                      });
                                      await refreshEvents(filter);
                                    });
                                }}
                              >
                                <X size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!events.length && <p>No recorded activity yet.</p>}
                  </div>
                  {events.length === 200 && (
                    <button
                      className="bo-secondary"
                      onClick={() =>
                        task(async () => {
                          setEvents((previous) => [...previous]);
                          const older = await api<EventRow[]>(
                            "events?" +
                              new URLSearchParams({
                                ...(filter ? { link: filter } : {}),
                                before: events.at(-1)!.created_at,
                              }),
                          );
                          setEvents(older);
                        })
                      }
                    >
                      Older events
                    </button>
                  )}
                </>
              )}
              {tab === "history" && (
                <div className="bo-panel">
                  {versions.length ? (
                    versions.map((v) => (
                      <div className="bo-version" key={v.id}>
                        <div>
                          <strong>{time(v.created_at)}</strong>
                          <p className="bo-hint">{v.author}</p>
                        </div>
                        <button
                          className="bo-secondary"
                          disabled={busy}
                          onClick={() => {
                            if (
                              dirty &&
                              !confirm(
                                "Replace your unsaved changes with this version?",
                              )
                            )
                              return;
                            void task(async () => {
                              const snapshot = await api<SiteContent>(
                                "versions/" + v.id,
                              );
                              setContent(snapshot);
                              setDirty(true);
                              setTab("profile");
                              setMessage(
                                "Version loaded into your draft. Save and preview before publishing.",
                              );
                            });
                          }}
                        >
                          Load into draft
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>Your first published version will appear here.</p>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export function Backoffice() {
  const [authorized, setAuthorized] = useState(false),
    [configured, setConfigured] = useState(true),
    [password, setPassword] = useState(""),
    [repeat, setRepeat] = useState(""),
    [setupToken, setSetupToken] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [checking, setChecking] = useState(true);
  useEffect(() => {
    const token =
      new URLSearchParams(location.hash.slice(1)).get("setup") || "";
    void Promise.resolve().then(() => setSetupToken(token));
    if (token) history.replaceState(null, "", "/admin/");
    void fetch("/admin/api/content")
      .then(async (r) => {
        if (r.ok) setAuthorized(true);
        else {
          const state = (await fetch("/admin/auth/status").then((r) =>
            r.json(),
          )) as { configured: boolean };
          setConfigured(state.configured);
        }
      })
      .catch(() => setError("Could not connect. Please reload."))
      .finally(() => setChecking(false));
  }, []);
  if (authorized) return <EditorWorkspace />;
  return (
    <div className="bo-login backoffice" dir="ltr">
      <form
        className="bo-login-card"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!configured && password !== repeat) {
            setError("Passwords do not match.");
            return;
          }
          setBusy(true);
          setError("");
          try {
            const r = await fetch(
              "/admin/auth/" + (configured ? "login" : "setup"),
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, token: setupToken }),
              },
            );
            const result = (await r.json()) as { error?: string };
            if (!r.ok) throw new Error(result.error || "Sign-in failed");
            setPassword("");
            setRepeat("");
            setAuthorized(true);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Sign-in failed");
          } finally {
            setBusy(false);
          }
        }}
      >
        <p className="bo-kicker">IBRAHIM ISSA · PORTFOLIO STUDIO</p>
        <h1>
          {checking
            ? "Connecting…"
            : configured
              ? "Welcome back"
              : "Set up your backoffice"}
        </h1>
        <p className="bo-intro">
          {configured
            ? "Sign in to edit your portfolio and review agency activity."
            : "Use your private setup link and choose a password or passphrase with at least 16 characters."}
        </p>
        {error && (
          <div className="bo-alert error" role="alert">
            {error}
          </div>
        )}
        {!checking &&
          (!configured && !setupToken ? (
            <p>
              Your private setup link is required to create the owner account.
            </p>
          ) : (
            <>
              <label className="bo-field">
                {configured ? "Password" : "Choose password"}
                <input
                  type="password"
                  autoComplete={
                    configured ? "current-password" : "new-password"
                  }
                  minLength={configured ? 1 : 16}
                  maxLength={256}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              {!configured && (
                <label className="bo-field">
                  Repeat password
                  <input
                    type="password"
                    autoComplete="new-password"
                    minLength={16}
                    required
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value)}
                  />
                </label>
              )}
              <button className="bo-primary" disabled={busy}>
                {busy
                  ? "Please wait…"
                  : configured
                    ? "Sign in"
                    : "Create owner account"}
              </button>
            </>
          ))}
        <a className="bo-hint" href="/">
          Back to website
        </a>
      </form>
    </div>
  );
}
