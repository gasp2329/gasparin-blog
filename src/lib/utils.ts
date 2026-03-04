/** Turn a title into a URL-safe slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Strip HTML tags for plain-text excerpts */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/** Estimate reading time from HTML content */
export function readingTime(html: string): string {
  const words = stripHtml(html).split(/\s+/).length;
  const minutes = Math.ceil(words / 250);
  return `${minutes} min read`;
}
