import Link from "next/link";
import { getAllPostsAdmin } from "@/lib/data/posts";
import PostTable from "@/components/admin/PostTable";

export default async function AdminJourneysPage() {
  const posts = await getAllPostsAdmin("journey");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-stone-800">
          Journeys
        </h1>
        <Link
          href="/admin/journeys/new"
          className="rounded bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-800"
        >
          New Journey Post
        </Link>
      </div>
      <PostTable posts={posts} type="journey" />
    </div>
  );
}
