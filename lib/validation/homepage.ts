import { z } from "zod";
import { imageRefSchema, relativeHrefSchema } from "./shared";

const heroSideSchema = z.object({
  image: imageRefSchema,
  label: z.string().min(1, "Label is required"),
  href: relativeHrefSchema,
});

const tileSchema = z.object({
  image: imageRefSchema,
  label: z.string().min(1, "Label is required"),
  href: relativeHrefSchema,
});

export const homePageSchema = z.object({
  hero: z.object({
    left: heroSideSchema,
    right: heroSideSchema,
  }),
  taglineHeading: z.array(z.string()).default([]),
  taglineCta: z.object({
    label: z.string().min(1),
    href: relativeHrefSchema,
  }),
  banner: z.object({
    image: imageRefSchema,
    heading: z.string().min(1, "Heading is required"),
    subheading: z.string().default(""),
    ctaLabel: z.string().default(""),
    ctaHref: relativeHrefSchema,
  }),
  tilesSection: z.object({
    heading: z.string().default(""),
    tiles: z.array(tileSchema).length(3, "Exactly 3 tiles are required"),
  }),
});

export type HomePageInput = z.infer<typeof homePageSchema>;
