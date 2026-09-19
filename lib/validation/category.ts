import { z } from "zod";

export const categorySchema = z.object({
  type: z.enum(["journey", "painting"]),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1).optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
