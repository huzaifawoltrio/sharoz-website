import Link from "next/link";
import { deletePost } from "@/actions/posts";
import DeleteButton from "@/components/admin/DeleteButton";
import type { PostLean, PostType } from "@/lib/types";

export default function PostTable({
  posts,
  type,
}: {
  posts: PostLean[];
  type: PostType;
}) {
  const basePath = type === "journey" ? "/admin/journeys" : "/admin/blog";

  return (
    <div className="overflow-x-auto rounded border border-stone-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Published</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {posts.map((p) => (
            <tr key={p._id}>
              <td className="px-4 py-2">{p.title}</td>
              <td className="px-4 py-2 capitalize">{p.status}</td>
              <td className="px-4 py-2 text-stone-500">
                {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "—"}
              </td>
              <td className="px-4 py-2 text-right">
                <div className="flex justify-end gap-3">
                  <Link
                    href={`${basePath}/${p._id}/edit`}
                    className="text-xs text-stone-500 hover:text-stone-900"
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deletePost.bind(null, p._id, type)} />
                </div>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-stone-400">
                Nothing here yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
