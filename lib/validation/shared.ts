import { z } from "zod";

export const imageRefSchema = z.object({
  url: z.string(),
  publicId: z.string(),
});

export const relativeHrefSchema = z
  .string()
  .min(1, "A link is required")
  .refine(
    (v) => v.startsWith("/") || v.startsWith("http"),
    "Must be a path starting with / or a full URL"
  );
