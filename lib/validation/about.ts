import { z } from "zod";
import { imageRefSchema } from "./shared";

export const aboutPageSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  bodyHtml: z.string().default(""),
  portrait: imageRefSchema,
  gallery: z.array(imageRefSchema).default([]),
});

export type AboutPageInput = z.infer<typeof aboutPageSchema>;
