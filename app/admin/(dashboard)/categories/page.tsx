import Link from "next/link";
import { getCategories } from "@/lib/data/site";
import { createCategory, deleteCategory } from "@/actions/categories";
import CategoryForm from "@/components/admin/forms/CategoryForm";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminCategoriesPage() {
  const [journeyCategories, paintingCategories] = await Promise.all([
    getCategories("journey"),
    getCategories("painting"),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-stone-800">
        Categories
      </h1>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        {(
          [
            { type: "journey" as const, items: journeyCategories, title: "Journey Categories" },
            { type: "painting" as const, items: paintingCategories, title: "Painting Categories" },
          ]
        ).map(({ type, items, title }) => (
          <div key={type}>
            <h2 className="mb-3 text-lg font-medium text-stone-800">{title}</h2>
            <ul className="mb-4 divide-y divide-stone-200 rounded border border-stone-200">
              {items.map((c) => (
                <li key={c._id} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span>{c.name}</span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/categories/${c._id}/edit`}
                      className="text-xs text-stone-500 hover:text-stone-900"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteCategory.bind(null, c._id)} />
                  </div>
                </li>
              ))}
              {items.length === 0 && (
                <li className="px-3 py-2 text-sm text-stone-400">No categories yet.</li>
              )}
            </ul>
            <CategoryForm type={type} action={createCategory} />
          </div>
        ))}
      </div>
    </div>
  );
}
