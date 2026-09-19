import { notFound } from "next/navigation";
import { getPostByIdAdmin } from "@/lib/data/posts";
import { updatePost } from "@/actions/posts";
import PostForm from "@/components/admin/forms/PostForm";

export default async function EditBlogPostPage({
  params,
}: PageProps<"/admin/blog/[id]/edit">) {
  const { id } = await params;
  const post = await getPostByIdAdmin(id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-stone-800">
        Edit Blog Post
      </h1>
      <PostForm initial={post} categories={[]} action={updatePost.bind(null, id)} />
    </div>
  );
}
