import { z } from "zod";
import { imageRefSchema } from "./shared";

export const printVariantSchema = z.object({
  size: z.string().min(1, "Size is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or more"),
});

export const artworkSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1).optional(),
    images: z.array(imageRefSchema).default([]),
    descriptionHtml: z.string().default(""),
    medium: z.string().default(""),
    dimensions: z.string().default(""),
    year: z.coerce.number().int().nullable().optional(),
    categoryRefs: z.array(z.string()).default([]),
    original: z.object({
      forSale: z.boolean().default(false),
      price: z.coerce.number().min(0).default(0),
      sold: z.boolean().default(false),
    }),
    prints: z.array(printVariantSchema).default([]),
    tags: z.array(z.string()).default([]),
    status: z.enum(["draft", "published"]).default("draft"),
  })
  .refine(
    (data) =>
      data.status !== "published" ||
      data.original.forSale ||
      data.prints.length > 0,
    {
      message:
        "A published artwork must either be for sale as an original or have at least one print variant",
      path: ["status"],
    }
  );

export type ArtworkInput = z.infer<typeof artworkSchema>;
