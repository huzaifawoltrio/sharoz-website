import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Category from "@/lib/models/Category";
import { updateCategory } from "@/actions/categories";
import CategoryForm from "@/components/admin/forms/CategoryForm";

export default async function EditCategoryPage({
  params,
}: PageProps<"/admin/categories/[id]/edit">) {
  const { id } = await params;
  await dbConnect();
  const category = await Category.findById(id).lean<{
    name: string;
    type: "journey" | "painting";
  }>();
  if (!category) notFound();

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-stone-800">
        Edit Category
      </h1>
      <CategoryForm
        type={category.type}
        initialName={category.name}
        action={updateCategory.bind(null, id)}
      />
    </div>
  );
}
