"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import ImageField from "@/components/ui/ImageField";
import RichTextEditor from "@/components/ui/RichTextEditor";
import SubmitButton from "@/components/ui/SubmitButton";
import type { ActionState } from "@/lib/action-state";
import type { ArtworkInput } from "@/lib/validation/artwork";
import type { CategoryLean } from "@/lib/types";

type ArtworkFormProps = {
  initial: ArtworkInput;
  categories: CategoryLean[];
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
};

export default function ArtworkForm({ initial, categories, action }: ArtworkFormProps) {
  const [data, setData] = useState(initial);
  const [tagsInput, setTagsInput] = useState(initial.tags.join(", "));
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <input
        type="hidden"
        name="payload"
        value={JSON.stringify({
          ...data,
          tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        })}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Title</label>
        <input
          value={data.title}
          onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">Images</label>
        <div className="grid grid-cols-3 gap-3">
          {data.images.map((img, i) => (
            <div key={i} className="relative">
              <ImageField
                value={img}
                onChange={(image) =>
                  setData((d) => ({
                    ...d,
                    images: d.images.map((im, idx) => (idx === i ? image : im)),
                  }))
                }
                aspect={4 / 5}
                folder="artworks"
              />
              <button
                type="button"
                onClick={() =>
                  setData((d) => ({ ...d, images: d.images.filter((_, idx) => idx !== i) }))
                }
                className="absolute -right-1 -top-1 rounded-full bg-white p-1 text-stone-500 shadow hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setData((d) => ({ ...d, images: [...d.images, { url: "", publicId: "" }] }))
            }
            className="flex h-40 items-center justify-center rounded border border-dashed border-stone-300 text-stone-400 hover:text-stone-600"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Description</label>
        <RichTextEditor
          value={data.descriptionHtml}
          onChange={(descriptionHtml) => setData((d) => ({ ...d, descriptionHtml }))}
          folder="artworks"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Medium</label>
          <input
            value={data.medium}
            onChange={(e) => setData((d) => ({ ...d, medium: e.target.value }))}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Dimensions</label>
          <input
            value={data.dimensions}
            onChange={(e) => setData((d) => ({ ...d, dimensions: e.target.value }))}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Year</label>
          <input
            type="number"
            value={data.year ?? ""}
            onChange={(e) =>
              setData((d) => ({ ...d, year: e.target.value ? Number(e.target.value) : null }))
            }
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {categories.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">Categories</label>
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <label key={c._id} className="flex items-center gap-1.5 text-sm text-stone-600">
                <input
                  type="checkbox"
                  checked={data.categoryRefs.includes(c._id)}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      categoryRefs: e.target.checked
                        ? [...d.categoryRefs, c._id]
                        : d.categoryRefs.filter((id) => id !== c._id),
                    }))
                  }
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Tags</label>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="comma, separated, tags"
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <fieldset className="rounded border border-stone-200 p-4">
        <legend className="px-1 text-sm font-medium text-stone-700">Original</legend>
        <label className="flex items-center gap-2 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={data.original.forSale}
            onChange={(e) =>
              setData((d) => ({ ...d, original: { ...d.original, forSale: e.target.checked } }))
            }
          />
          Sell the original (one of a kind)
        </label>
        {data.original.forSale && (
          <div className="mt-3 flex items-center gap-3">
            <label className="text-sm text-stone-600">Price ($)</label>
            <input
              type="number"
              value={data.original.price}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  original: { ...d.original, price: Number(e.target.value) },
                }))
              }
              className="w-32 rounded border border-stone-300 px-3 py-2 text-sm"
            />
            <label className="ml-4 flex items-center gap-1.5 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={data.original.sold}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    original: { ...d.original, sold: e.target.checked },
                  }))
                }
              />
              Sold
            </label>
          </div>
        )}
      </fieldset>

      <fieldset className="rounded border border-stone-200 p-4">
        <legend className="px-1 text-sm font-medium text-stone-700">Print Variants</legend>
        <div className="flex flex-col gap-2">
          {data.prints.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                placeholder="Size"
                value={p.size}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    prints: d.prints.map((pr, idx) =>
                      idx === i ? { ...pr, size: e.target.value } : pr
                    ),
                  }))
                }
                className="w-28 rounded border border-stone-300 px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Price"
                value={p.price}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    prints: d.prints.map((pr, idx) =>
                      idx === i ? { ...pr, price: Number(e.target.value) } : pr
                    ),
                  }))
                }
                className="w-24 rounded border border-stone-300 px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Stock"
                value={p.stock}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    prints: d.prints.map((pr, idx) =>
                      idx === i ? { ...pr, stock: Number(e.target.value) } : pr
                    ),
                  }))
                }
                className="w-24 rounded border border-stone-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setData((d) => ({ ...d, prints: d.prints.filter((_, idx) => idx !== i) }))
                }
                className="text-stone-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setData((d) => ({
                ...d,
                prints: [...d.prints, { size: "", price: 0, stock: 0 }],
              }))
            }
            className="mt-1 flex items-center gap-1 self-start text-sm text-stone-600 hover:text-stone-900"
          >
            <Plus className="h-3.5 w-3.5" /> Add print size
          </button>
        </div>
      </fieldset>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Status</label>
        <select
          value={data.status}
          onChange={(e) =>
            setData((d) => ({ ...d, status: e.target.value as "draft" | "published" }))
          }
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Save Artwork</SubmitButton>
    </form>
  );
}
