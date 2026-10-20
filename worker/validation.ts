import { defaultContent, type SiteContent } from "../lib/content";
export function validateContent(input: unknown): SiteContent {
  if (
    !input ||
    typeof input !== "object" ||
    JSON.stringify(input).length > 750000
  )
    throw new Error("Invalid or oversized content");
  function shape(value: unknown, example: unknown, path: string): void {
    if (typeof example === "string") {
      if (typeof value !== "string" || value.length > 20000)
        throw new Error(`Invalid text: ${path}`);
      if (
        ["src", "poster", "cvPath", "url", "image"].includes(
          path.split(".").at(-1)!,
        )
      ) {
        if (
          value &&
          !(value.startsWith("/") && !value.startsWith("//")) &&
          !/^https:\/\//.test(value)
        )
          throw new Error(`Use a site path or HTTPS URL: ${path}`);
        if (value) {
          try {
            const parsed = new URL(value, "https://portfolio.example");
            if (parsed.protocol !== "https:") throw new Error();
          } catch {
            throw new Error(`Invalid URL: ${path}`);
          }
        }
        if (/[\u0000-\u001f\\]/.test(value))
          throw new Error(`Invalid URL: ${path}`);
      }
      return;
    }
    if (Array.isArray(example)) {
      if (!Array.isArray(value) || value.length > 200)
        throw new Error(`Invalid list: ${path}`);
      value.forEach((v, i) => shape(v, example[0], `${path}.${i}`));
      return;
    }
    if (example && typeof example === "object") {
      if (!value || typeof value !== "object" || Array.isArray(value))
        throw new Error(`Invalid section: ${path}`);
      const o = value as Record<string, unknown>,
        e = example as Record<string, unknown>;
      for (const key of Object.keys(e)) {
        if (key === "ar" && o[key] === undefined) continue;
        shape(o[key], e[key], `${path}.${key}`);
      }
      for (const [key, v] of Object.entries(o)) {
        if (key === "ar") {
          if (typeof v !== "string")
            throw new Error("Invalid Arabic translation");
        } else if (key === "hidden") {
          if (typeof v !== "boolean") throw new Error("Invalid visibility");
        } else if (key === "poster") shape(v, "", path + ".poster");
        else if (!(key in e)) throw new Error(`Unknown field: ${path}.${key}`);
      }
    }
  }
  const c = input as SiteContent;
  const { courseMedia: _course, ...standard } = defaultContent;
  void _course;
  const { courseMedia: _inputCourse, ...other } = c;
  void _inputCourse;
  shape(other, standard, "content");
  if (!Array.isArray(c.courseMedia) || c.courseMedia.length > 200)
    throw new Error("Invalid course gallery");
  for (const item of c.courseMedia) {
    const sample = defaultContent.courseMedia.find((v) => v.kind === item.kind);
    if (!sample) throw new Error("Invalid media kind");
    shape(item, sample, "courseMedia");
  }
  if (!["grouped", "custom"].includes(c.videoLayout))
    throw new Error("Invalid video layout");
  const categories = ["commercial", "course", "professional"];
  if (
    c.categoryOrder.length !== 3 ||
    new Set(c.categoryOrder).size !== 3 ||
    c.categoryOrder.some((v) => !categories.includes(v))
  )
    throw new Error("Invalid category order");
  if (c.videos.some((v) => !categories.includes(v.category)))
    throw new Error("Invalid video category");
  for (const list of [c.videos, c.photos, c.courseMedia]) {
    if (
      new Set(list.map((v) => v.id)).size !== list.length ||
      list.some((v) => !/^[-\w]{1,100}$/.test(v.id))
    )
      throw new Error("Media IDs must be unique");
  }
  if (
    !c.contact.email.includes("@") ||
    !c.profile.name.he.trim() ||
    !c.seo.title.trim()
  )
    throw new Error("Name, title and email are required");
  return c;
}
