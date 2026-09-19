"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { updateAboutPage } from "@/actions/about";
import ImageField from "@/components/ui/ImageField";
import RichTextEditor from "@/components/ui/RichTextEditor";
import SubmitButton from "@/components/ui/SubmitButton";
import type { AboutPageInput } from "@/lib/validation/about";

export default function AboutPageForm({ initial }: { initial: AboutPageInput }) {
  const [data, setData] = useState(initial);
  const [state, action] = useActionState(updateAboutPage, undefined);

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-6">
      <input type="hidden" name="payload" value={JSON.stringify(data)} />

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Heading</label>
        <input
          value={data.heading}
          onChange={(e) => setData((d) => ({ ...d, heading: e.target.value }))}
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <ImageField
        label="Portrait"
        value={data.portrait}
        onChange={(portrait) => setData((d) => ({ ...d, portrait }))}
        aspect={4 / 5}
        folder="about"
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Bio</label>
        <RichTextEditor
          value={data.bodyHtml}
          onChange={(bodyHtml) => setData((d) => ({ ...d, bodyHtml }))}
          folder="about"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">Gallery</label>
        <div className="grid grid-cols-3 gap-3">
          {data.gallery.map((img, i) => (
            <div key={i} className="relative">
              <ImageField
                value={img}
                onChange={(image) =>
                  setData((d) => ({
                    ...d,
                    gallery: d.gallery.map((g, idx) => (idx === i ? image : g)),
                  }))
                }
                aspect={1}
                folder="about/gallery"
              />
              <button
                type="button"
                onClick={() =>
                  setData((d) => ({
                    ...d,
                    gallery: d.gallery.filter((_, idx) => idx !== i),
                  }))
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
              setData((d) => ({
                ...d,
                gallery: [...d.gallery, { url: "", publicId: "" }],
              }))
            }
            className="flex h-40 items-center justify-center rounded border border-dashed border-stone-300 text-stone-400 hover:text-stone-600"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">Saved.</p>}
      <SubmitButton>Save About Page</SubmitButton>
    </form>
  );
}
