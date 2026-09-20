import { sanitizeHtml } from "@/lib/sanitize";

/**
 * Renders admin-authored HTML on the public site. The content is
 * sanitized again here (defense-in-depth) even though it was already
 * sanitized when the Server Action saved it.
 */
export default function RichTextView({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={`prose max-w-none ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
