import Link from "next/link";
import CmsImage from "@/components/ui/CmsImage";
import type { PostLean } from "@/lib/types";

export default function PostCard({ post }: { post: PostLean }) {
  const basePath = post.type === "journey" ? "/journeys" : "/blog";
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Link href={`${basePath}/${post.slug}`} className="group block">
      <div className="relative aspect-[3/2] overflow-hidden bg-surface">
        <CmsImage
          src={post.coverImage?.url}
          alt={post.title}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3">
        {date && <p className="text-xs text-muted">{date}</p>}
        <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg text-foreground">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-1 line-clamp-2 text-sm text-muted">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
