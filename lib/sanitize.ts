import sanitizeHtmlLib from "sanitize-html";

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
 *
 * Uses `sanitize-html`, a pure-JS sanitizer with its own HTML parser,
 * rather than a jsdom-based one (e.g. isomorphic-dompurify) — we only
 * ever sanitize server-side, so a real jsdom-emulated DOM buys nothing
 * and jsdom's transitive dependency tree is fragile under serverless
 * bundlers (a real ERR_REQUIRE_ESM crash from one of its deps is what
 * broke this in production).
 */
export function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      "*": ALLOWED_ATTR,
    },
  });
}
