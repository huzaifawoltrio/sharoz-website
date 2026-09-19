import Link from "next/link";
import { getAllPostsAdmin } from "@/lib/data/posts";
import PostTable from "@/components/admin/PostTable";

export default async function AdminBlogPage() {
  const posts = await getAllPostsAdmin("blog");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-stone-800">
          Blog
        </h1>
        <Link
          href="/admin/blog/new"
          className="rounded bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-800"
        >
          New Blog Post
        </Link>
      </div>
      <PostTable posts={posts} type="blog" />
    </div>
  );
}
