"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { updateTheme } from "@/actions/theme";
import SubmitButton from "@/components/ui/SubmitButton";
import {
  COLOR_PALETTES,
  DEFAULT_THEME,
  GOOGLE_FONT_SUGGESTIONS,
  getPalette,
} from "@/lib/theme-presets";
import type { ThemeInput } from "@/lib/validation/theme";

/** Injects (and cleans up) a Google Fonts stylesheet for the live preview
 * below — separate from the real site-wide <link> that ThemeStyle renders
 * for actual visitors. */
function usePreviewFontLink(fontNames: string[]) {
  const linkRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const families = fontNames
        .filter(Boolean)
        .map(
          (name) =>
            `family=${encodeURIComponent(name).replace(/%20/g, "+")}:wght@400;700`
        )
        .join("&");
      if (!families) return;

      const href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
      if (linkRef.current) {
        linkRef.current.href = href;
      } else {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
        linkRef.current = link;
      }
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontNames.join("|")]);

  useEffect(() => {
    return () => {
      linkRef.current?.remove();
    };
  }, []);
}

export default function ThemeForm({ initial }: { initial: ThemeInput }) {
  const [data, setData] = useState<ThemeInput>(initial);
  const [state, action] = useActionState(updateTheme, undefined);

  usePreviewFontLink([data.fonts.display, data.fonts.body]);

  const palette = getPalette(data.paletteId);

  return (
    <form action={action} className="flex max-w-3xl flex-col gap-10">
      <input type="hidden" name="payload" value={JSON.stringify(data)} />

      <section>
        <h2 className="mb-3 text-lg font-medium text-stone-800">Color Palette</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {COLOR_PALETTES.map((p) => {
            const active = p.id === data.paletteId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setData((d) => ({ ...d, paletteId: p.id }))}
                className={`relative flex flex-col items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                  active
                    ? "border-stone-900 ring-1 ring-stone-900"
                    : "border-stone-200 hover:border-stone-400"
                }`}
              >
                {active && (
                  <span className="absolute right-3 top-3 rounded-full bg-stone-900 p-1 text-white">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <div className="flex gap-1.5">
                  {[p.colors.background, p.colors.accent, p.colors.surface, p.colors.muted].map(
                    (c, i) => (
                      <span
                        key={i}
                        className="h-6 w-6 rounded-full border border-stone-200"
                        style={{ backgroundColor: c }}
                      />
                    )
                  )}
                </div>
                <span className="text-sm font-medium text-stone-800">{p.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium text-stone-800">Fonts</h2>
        <p className="mb-3 text-sm text-stone-500">
          Type the exact name of any Google Font. Start typing for suggestions.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Display font (headings)
            </label>
            <input
              list="font-suggestions"
              value={data.fonts.display}
              onChange={(e) =>
                setData((d) => ({ ...d, fonts: { ...d.fonts, display: e.target.value } }))
              }
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Body font
            </label>
            <input
              list="font-suggestions"
              value={data.fonts.body}
              onChange={(e) =>
                setData((d) => ({ ...d, fonts: { ...d.fonts, body: e.target.value } }))
              }
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <datalist id="font-suggestions">
          {GOOGLE_FONT_SUGGESTIONS.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium text-stone-800">Live Preview</h2>
        <div
          className="overflow-hidden rounded-lg border border-stone-200 p-8"
          style={{ backgroundColor: palette.colors.background }}
        >
          <p
            className="text-3xl"
            style={{
              color: palette.colors.foreground,
              fontFamily: `'${data.fonts.display}', serif`,
            }}
          >
            The Long Way Home
          </p>
          <p
            className="mt-3 max-w-md text-sm"
            style={{
              color: palette.colors.foreground,
              fontFamily: `'${data.fonts.body}', sans-serif`,
            }}
          >
            A sample paragraph showing your chosen body font, set in the
            palette&apos;s foreground color on its background color.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span
              className="inline-block rounded px-5 py-2.5 text-sm font-medium"
              style={{
                backgroundColor: palette.colors.accent,
                color: palette.colors.accentForeground,
                fontFamily: `'${data.fonts.body}', sans-serif`,
              }}
            >
              Get in Touch
            </span>
            <span
              className="inline-block rounded px-4 py-2 text-sm"
              style={{
                backgroundColor: palette.colors.surface,
                color: palette.colors.muted,
                border: `1px solid ${palette.colors.border}`,
                fontFamily: `'${data.fonts.body}', sans-serif`,
              }}
            >
              Secondary text
            </span>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-4">
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state?.success && <p className="text-sm text-green-700">Saved.</p>}
      </div>

      <div className="flex gap-3">
        <SubmitButton>Save Appearance</SubmitButton>
        <button
          type="button"
          onClick={() => setData(DEFAULT_THEME)}
          className="flex items-center gap-1.5 rounded border border-stone-300 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to defaults
        </button>
      </div>
    </form>
  );
}
