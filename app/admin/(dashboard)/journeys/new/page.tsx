import { getCategories } from "@/lib/data/site";
import { createPost } from "@/actions/posts";
import PostForm from "@/components/admin/forms/PostForm";

const EMPTY: import("@/lib/validation/post").PostInput = {
  type: "journey",
  title: "",
  coverImage: { url: "", publicId: "" },
  excerpt: "",
  bodyHtml: "",
  categoryRef: null,
  status: "draft",
};

export default async function NewJourneyPage() {
  const categories = await getCategories("journey");

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-stone-800">
        New Journey Post
      </h1>
      <PostForm initial={EMPTY} categories={categories} action={createPost} />
    </div>
  );
}
