import Link from "next/link";
import PostCard from "@/components/site/PostCard";
import type { PostLean, CategoryLean } from "@/lib/types";

export default function PostList({
  heading,
  posts,
  categories,
  basePath,
  activeCategorySlug,
}: {
  heading: string;
  posts: PostLean[];
  categories: CategoryLean[];
  basePath: string;
  activeCategorySlug?: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-stone-800">
        {heading}
      </h1>

      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link
            href={basePath}
            className={!activeCategorySlug ? "font-medium text-stone-900" : "text-stone-500"}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c._id}
              href={`${basePath}?category=${c.slug}`}
              className={
                activeCategorySlug === c.slug
                  ? "font-medium text-stone-900"
                  : "text-stone-500"
              }
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="mt-12 text-stone-500">Nothing published yet — check back soon.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p._id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
