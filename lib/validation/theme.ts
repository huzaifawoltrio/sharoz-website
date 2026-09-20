import { z } from "zod";
import { PALETTE_IDS } from "@/lib/theme-presets";

// Real Google Font family names are always letters/digits/spaces; this
// also guards against CSS/URL injection, since these strings get
// interpolated into both a <link href> URL and raw CSS text server-side.
const fontNameSchema = z
  .string()
  .min(1, "Font name is required")
  .max(60, "Font name is too long")
  .regex(/^[A-Za-z0-9 ]+$/, "Use only letters, numbers, and spaces");

export const themeSchema = z.object({
  paletteId: z.enum(PALETTE_IDS as [string, ...string[]]),
  fonts: z.object({
    display: fontNameSchema,
    body: fontNameSchema,
  }),
});

export type ThemeInput = z.infer<typeof themeSchema>;
