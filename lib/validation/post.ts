import { z } from "zod";
import { imageRefSchema } from "./shared";

export const postSchema = z.object({
  type: z.enum(["journey", "blog"]),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1).optional(),
  coverImage: imageRefSchema,
  excerpt: z.string().default(""),
  bodyHtml: z.string().default(""),
  categoryRef: z.string().nullable().default(null),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type PostInput = z.infer<typeof postSchema>;
