import { z } from "zod";

export const orderVariantSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("original") }),
  z.object({ type: z.literal("print"), size: z.string().min(1) }),
]);

export const orderItemSchema = z.object({
  artworkId: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  image: z.string().default(""),
  variant: orderVariantSchema,
  price: z.number().min(0),
  quantity: z.number().int().min(1),
});

export const createOrderSchema = z.object({
  buyer: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().default(""),
    address: z.string().default(""),
    message: z.string().default(""),
  }),
  items: z.array(orderItemSchema).min(1, "Your cart is empty"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const orderStatusSchema = z.enum([
  "new",
  "contacted",
  "confirmed",
  "fulfilled",
  "cancelled",
]);
