import { notFound } from "next/navigation";
import { getPostByIdAdmin } from "@/lib/data/posts";
import { getCategories } from "@/lib/data/site";
import { updatePost } from "@/actions/posts";
import PostForm from "@/components/admin/forms/PostForm";

export default async function EditJourneyPage({
  params,
}: PageProps<"/admin/journeys/[id]/edit">) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getPostByIdAdmin(id),
    getCategories("journey"),
  ]);
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-stone-800">
        Edit Journey Post
      </h1>
      <PostForm
        initial={{ ...post, slug: post.slug }}
        categories={categories}
        action={updatePost.bind(null, id)}
      />
    </div>
  );
}
