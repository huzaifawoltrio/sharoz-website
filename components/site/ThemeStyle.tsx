import { getPalette } from "@/lib/theme-presets";

const DEFAULT_DISPLAY_FONT = "playfair display";
const DEFAULT_BODY_FONT = "inter";
const FONT_WEIGHTS = "400;500;600;700";

function googleFontsHref(names: string[]) {
  const families = names
    .map((name) => `family=${encodeURIComponent(name).replace(/%20/g, "+")}:wght@${FONT_WEIGHTS}`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export default function ThemeStyle({
  paletteId,
  fonts,
}: {
  paletteId: string;
  fonts: { display: string; body: string };
}) {
  const { colors } = getPalette(paletteId);

  const displayCustom = fonts.display.trim().toLowerCase() !== DEFAULT_DISPLAY_FONT;
  const bodyCustom = fonts.body.trim().toLowerCase() !== DEFAULT_BODY_FONT;
  const namesToLoad = [
    ...(displayCustom ? [fonts.display] : []),
    ...(bodyCustom ? [fonts.body] : []),
  ];

  const displayFamily = displayCustom
    ? `'${fonts.display}', serif`
    : "var(--font-display)";
  const bodyFamily = bodyCustom ? `'${fonts.body}', sans-serif` : "var(--font-sans)";

  // html:root (specificity 0,0,1,1) deliberately beats both globals.css's
  // plain :root rule and next/font's class-based variable rule (each
  // 0,0,1,0), so this override always wins regardless of stream order —
  // and because it only renders inside the (site) layout, it never
  // affects /admin, which has no equivalent tag.
  const css = `html:root{
    --background:${colors.background};
    --foreground:${colors.foreground};
    --surface:${colors.surface};
    --border:${colors.border};
    --muted:${colors.muted};
    --accent:${colors.accent};
    --accent-foreground:${colors.accentForeground};
    --font-display:${displayFamily};
    --font-sans:${bodyFamily};
  }`;

  return (
    <>
      {namesToLoad.length > 0 && (
        <link rel="stylesheet" href={googleFontsHref(namesToLoad)} />
      )}
      <style>{css}</style>
    </>
  );
}
