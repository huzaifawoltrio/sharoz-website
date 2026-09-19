import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
  "hr",
  "code",
  "pre",
];

const ALLOWED_ATTR = ["href", "src", "alt", "title", "target", "rel", "class"];

/**
 * Sanitizes Tiptap-authored HTML before it is written to Mongo. Called
 * inside every Server Action that persists rich text — never trust HTML
 * coming from the client, even from an authenticated admin session.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}
