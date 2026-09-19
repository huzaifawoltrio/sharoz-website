import { createPost } from "@/actions/posts";
import PostForm from "@/components/admin/forms/PostForm";

const EMPTY: import("@/lib/validation/post").PostInput = {
  type: "blog",
  title: "",
  coverImage: { url: "", publicId: "" },
  excerpt: "",
  bodyHtml: "",
  categoryRef: null,
  status: "draft",
};

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-stone-800">
        New Blog Post
      </h1>
      <PostForm initial={EMPTY} categories={[]} action={createPost} />
    </div>
  );
}
