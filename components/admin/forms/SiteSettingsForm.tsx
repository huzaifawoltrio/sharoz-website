"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { updateSiteSettings } from "@/actions/site-settings";
import ImageField from "@/components/ui/ImageField";
import SubmitButton from "@/components/ui/SubmitButton";
import type { SiteSettingsInput } from "@/lib/validation/site-settings";

export default function SiteSettingsForm({
  initial,
}: {
  initial: SiteSettingsInput;
}) {
  const [data, setData] = useState(initial);
  const [state, action] = useActionState(updateSiteSettings, undefined);

  function updateSocial(index: number, field: "platform" | "url", value: string) {
    setData((d) => ({
      ...d,
      socials: d.socials.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  }

  return (
    <form action={action} className="flex max-w-xl flex-col gap-6">
      <input type="hidden" name="payload" value={JSON.stringify(data)} />

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Site Name</label>
        <input
          value={data.siteName}
          onChange={(e) => setData((d) => ({ ...d, siteName: e.target.value }))}
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Tagline</label>
        <input
          value={data.tagline}
          onChange={(e) => setData((d) => ({ ...d, tagline: e.target.value }))}
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <ImageField
        label="Logo"
        value={data.logo}
        onChange={(logo) => setData((d) => ({ ...d, logo }))}
        aspect={3}
        folder="site"
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Contact Email</label>
        <input
          type="email"
          value={data.contactEmail}
          onChange={(e) => setData((d) => ({ ...d, contactEmail: e.target.value }))}
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">Social Links</label>
        <div className="flex flex-col gap-2">
          {data.socials.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="instagram"
                value={s.platform}
                onChange={(e) => updateSocial(i, "platform", e.target.value)}
                className="w-32 rounded border border-stone-300 px-3 py-2 text-sm"
              />
              <input
                placeholder="https://..."
                value={s.url}
                onChange={(e) => updateSocial(i, "url", e.target.value)}
                className="flex-1 rounded border border-stone-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setData((d) => ({
                    ...d,
                    socials: d.socials.filter((_, idx) => idx !== i),
                  }))
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
                socials: [...d.socials, { platform: "", url: "" }],
              }))
            }
            className="mt-1 flex items-center gap-1 self-start text-sm text-stone-600 hover:text-stone-900"
          >
            <Plus className="h-3.5 w-3.5" /> Add social link
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Footer Note</label>
        <input
          value={data.footerNote}
          onChange={(e) => setData((d) => ({ ...d, footerNote: e.target.value }))}
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">Saved.</p>}
      <SubmitButton>Save Settings</SubmitButton>
    </form>
  );
}
