"use client";

import { useActionState, useState } from "react";
import ImageField from "@/components/ui/ImageField";
import RichTextEditor from "@/components/ui/RichTextEditor";
import SubmitButton from "@/components/ui/SubmitButton";
import type { ActionState } from "@/lib/action-state";
import type { PostInput } from "@/lib/validation/post";
import type { CategoryLean } from "@/lib/types";

type PostFormProps = {
  initial: PostInput;
  categories: CategoryLean[];
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
};

export default function PostForm({ initial, categories, action }: PostFormProps) {
  const [data, setData] = useState(initial);
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <input type="hidden" name="payload" value={JSON.stringify(data)} />

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Title</label>
        <input
          value={data.title}
          onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <ImageField
        label="Cover Image"
        value={data.coverImage}
        onChange={(coverImage) => setData((d) => ({ ...d, coverImage }))}
        aspect={16 / 9}
        folder={`${data.type}s`}
      />

      {data.type === "journey" && categories.length > 0 && (
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Category</label>
          <select
            value={data.categoryRef ?? ""}
            onChange={(e) =>
              setData((d) => ({ ...d, categoryRef: e.target.value || null }))
            }
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Excerpt</label>
        <textarea
          rows={2}
          value={data.excerpt}
          onChange={(e) => setData((d) => ({ ...d, excerpt: e.target.value }))}
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Body</label>
        <RichTextEditor
          value={data.bodyHtml}
          onChange={(bodyHtml) => setData((d) => ({ ...d, bodyHtml }))}
          folder={`${data.type}s`}
        />
      </div>

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
      <SubmitButton>Save</SubmitButton>
    </form>
  );
}
