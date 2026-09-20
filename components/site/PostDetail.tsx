import CmsImage from "@/components/ui/CmsImage";
import RichTextView from "@/components/ui/RichTextView";
import type { PostLean } from "@/lib/types";

export default function PostDetail({ post }: { post: PostLean }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {post.coverImage?.url && (
        <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded">
          <CmsImage
            src={post.coverImage.url}
            alt={post.title}
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            eager
          />
        </div>
      )}
      {date && <p className="text-sm text-muted">{date}</p>}
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-foreground">
        {post.title}
      </h1>
      <RichTextView html={post.bodyHtml} className="mt-8" />
    </article>
  );
}
