"use client";

import { useActionState, useState } from "react";
import { updateHomePage } from "@/actions/homepage";
import ImageField from "@/components/ui/ImageField";
import SubmitButton from "@/components/ui/SubmitButton";
import type { HomePageInput } from "@/lib/validation/homepage";

export default function HomePageForm({ initial }: { initial: HomePageInput }) {
  const [data, setData] = useState(initial);
  const [state, action] = useActionState(updateHomePage, undefined);

  return (
    <form action={action} className="flex max-w-3xl flex-col gap-10">
      <input type="hidden" name="payload" value={JSON.stringify(data)} />

      <section>
        <h2 className="mb-3 text-lg font-medium text-stone-800">Split Hero</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {(["left", "right"] as const).map((side) => (
            <div key={side} className="rounded border border-stone-200 p-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-stone-400">
                {side}
              </p>
              <ImageField
                value={data.hero[side].image}
                onChange={(image) =>
                  setData((d) => ({
                    ...d,
                    hero: { ...d.hero, [side]: { ...d.hero[side], image } },
                  }))
                }
                aspect={3 / 4}
                folder="homepage/hero"
              />
              <input
                className="mt-2 w-full rounded border border-stone-300 px-3 py-2 text-sm"
                placeholder="Label"
                value={data.hero[side].label}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    hero: {
                      ...d.hero,
                      [side]: { ...d.hero[side], label: e.target.value },
                    },
                  }))
                }
              />
              <input
                className="mt-2 w-full rounded border border-stone-300 px-3 py-2 text-sm"
                placeholder="/paintings"
                value={data.hero[side].href}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    hero: {
                      ...d.hero,
                      [side]: { ...d.hero[side], href: e.target.value },
                    },
                  }))
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium text-stone-800">Tagline</h2>
        <textarea
          rows={3}
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          placeholder="One line per row"
          value={data.taglineHeading.join("\n")}
          onChange={(e) =>
            setData((d) => ({ ...d, taglineHeading: e.target.value.split("\n") }))
          }
        />
        <div className="mt-2 flex gap-2">
          <input
            className="flex-1 rounded border border-stone-300 px-3 py-2 text-sm"
            placeholder="Button label"
            value={data.taglineCta.label}
            onChange={(e) =>
              setData((d) => ({
                ...d,
                taglineCta: { ...d.taglineCta, label: e.target.value },
              }))
            }
          />
          <input
            className="flex-1 rounded border border-stone-300 px-3 py-2 text-sm"
            placeholder="/contact"
            value={data.taglineCta.href}
            onChange={(e) =>
              setData((d) => ({
                ...d,
                taglineCta: { ...d.taglineCta, href: e.target.value },
              }))
            }
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium text-stone-800">Full-Bleed Banner</h2>
        <ImageField
          value={data.banner.image}
          onChange={(image) => setData((d) => ({ ...d, banner: { ...d.banner, image } }))}
          aspect={16 / 9}
          folder="homepage/banner"
        />
        <input
          className="mt-2 w-full rounded border border-stone-300 px-3 py-2 text-sm"
          placeholder="Heading"
          value={data.banner.heading}
          onChange={(e) =>
            setData((d) => ({ ...d, banner: { ...d.banner, heading: e.target.value } }))
          }
        />
        <input
          className="mt-2 w-full rounded border border-stone-300 px-3 py-2 text-sm"
          placeholder="Subheading"
          value={data.banner.subheading}
          onChange={(e) =>
            setData((d) => ({ ...d, banner: { ...d.banner, subheading: e.target.value } }))
          }
        />
        <div className="mt-2 flex gap-2">
          <input
            className="flex-1 rounded border border-stone-300 px-3 py-2 text-sm"
            placeholder="Button label"
            value={data.banner.ctaLabel}
            onChange={(e) =>
              setData((d) => ({ ...d, banner: { ...d.banner, ctaLabel: e.target.value } }))
            }
          />
          <input
            className="flex-1 rounded border border-stone-300 px-3 py-2 text-sm"
            placeholder="/journeys"
            value={data.banner.ctaHref}
            onChange={(e) =>
              setData((d) => ({ ...d, banner: { ...d.banner, ctaHref: e.target.value } }))
            }
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium text-stone-800">Feature Tiles</h2>
        <input
          className="mb-4 w-full rounded border border-stone-300 px-3 py-2 text-sm"
          placeholder="Section heading"
          value={data.tilesSection.heading}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              tilesSection: { ...d.tilesSection, heading: e.target.value },
            }))
          }
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {data.tilesSection.tiles.map((tile, i) => (
            <div key={i} className="rounded border border-stone-200 p-3">
              <ImageField
                value={tile.image}
                onChange={(image) =>
                  setData((d) => ({
                    ...d,
                    tilesSection: {
                      ...d.tilesSection,
                      tiles: d.tilesSection.tiles.map((t, idx) =>
                        idx === i ? { ...t, image } : t
                      ),
                    },
                  }))
                }
                aspect={4 / 5}
                folder="homepage/tiles"
              />
              <input
                className="mt-2 w-full rounded border border-stone-300 px-3 py-2 text-sm"
                placeholder="Label"
                value={tile.label}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    tilesSection: {
                      ...d.tilesSection,
                      tiles: d.tilesSection.tiles.map((t, idx) =>
                        idx === i ? { ...t, label: e.target.value } : t
                      ),
                    },
                  }))
                }
              />
              <input
                className="mt-2 w-full rounded border border-stone-300 px-3 py-2 text-sm"
                placeholder="/paintings?category=..."
                value={tile.href}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    tilesSection: {
                      ...d.tilesSection,
                      tiles: d.tilesSection.tiles.map((t, idx) =>
                        idx === i ? { ...t, href: e.target.value } : t
                      ),
                    },
                  }))
                }
              />
            </div>
          ))}
        </div>
      </section>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">Saved.</p>}
      <SubmitButton>Save Homepage</SubmitButton>
    </form>
  );
}
