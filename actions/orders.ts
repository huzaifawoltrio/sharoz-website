"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Artwork from "@/lib/models/Artwork";
import Order from "@/lib/models/Order";
import { requireAdmin } from "@/lib/dal";
import { createOrderSchema, orderStatusSchema } from "@/lib/validation/order";
import { firstZodMessage, type ActionState } from "@/lib/action-state";

/** Atomically reserves one order item's stock. Returns true on success. */
async function reserveItem(item: {
  artworkId: string;
  variant: { type: "original" } | { type: "print"; size: string };
  quantity: number;
}) {
  if (item.variant.type === "original") {
    const res = await Artwork.updateOne(
      { _id: item.artworkId, "original.forSale": true, "original.sold": false },
      { $set: { "original.sold": true } }
    );
    return res.modifiedCount === 1;
  }

  const res = await Artwork.updateOne(
    {
      _id: item.artworkId,
      prints: { $elemMatch: { size: item.variant.size, stock: { $gte: item.quantity } } },
    },
    { $inc: { "prints.$.stock": -item.quantity } }
  );
  return res.modifiedCount === 1;
}

/** Reverses a reservation (used on rollback and on admin cancellation). */
async function releaseItem(item: {
  artworkId: string;
  variant: { type: "original" } | { type: "print"; size: string };
  quantity: number;
}) {
  if (item.variant.type === "original") {
    await Artwork.updateOne(
      { _id: item.artworkId },
      { $set: { "original.sold": false } }
    );
    return;
  }
  await Artwork.updateOne(
    { _id: item.artworkId, "prints.size": item.variant.size },
    { $inc: { "prints.$.stock": item.quantity } }
  );
}

export async function createOrder(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = JSON.parse(String(formData.get("payload") ?? "{}"));
  const parsed = createOrderSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  await dbConnect();

  const reserved: typeof parsed.data.items = [];
  for (const item of parsed.data.items) {
    const ok = await reserveItem(item);
    if (!ok) {
      // Roll back everything reserved so far in this checkout attempt.
      for (const done of reserved) await releaseItem(done);
      return {
        error: `"${item.title}" (${
          item.variant.type === "print" ? item.variant.size : "original"
        }) just sold out. Please update your cart.`,
      };
    }
    reserved.push(item);
  }

  const order = await Order.create({
    buyer: parsed.data.buyer,
    items: parsed.data.items.map((i) => ({
      artworkId: i.artworkId,
      artworkTitle: i.title,
      artworkSlug: i.slug,
      image: i.image,
      variant: i.variant,
      price: i.price,
      quantity: i.quantity,
    })),
    status: "new",
  });

  redirect(`/checkout/thank-you?order=${order._id.toString()}`);
}

export async function updateOrderStatus(
  id: string,
  status: string
) {
  await requireAdmin();
  const parsed = orderStatusSchema.safeParse(status);
  if (!parsed.success) return;

  await dbConnect();
  await Order.findByIdAndUpdate(id, { status: parsed.data });
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
}

export async function cancelOrder(id: string) {
  await requireAdmin();
  await dbConnect();

  const order = await Order.findById(id);
  if (!order || order.status === "cancelled") return;

  for (const item of order.items) {
    await releaseItem({
      artworkId: item.artworkId.toString(),
      variant:
        item.variant.type === "original"
          ? { type: "original" }
          : { type: "print", size: item.variant.size as string },
      quantity: item.quantity,
    });
  }

  order.status = "cancelled";
  await order.save();

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
  revalidatePath("/shop");
}

export async function addOrderNote(id: string, text: string) {
  await requireAdmin();
  if (!text.trim()) return;
  await dbConnect();
  await Order.findByIdAndUpdate(id, {
    $push: { notes: { text: text.trim(), createdAt: new Date() } },
  });
  revalidatePath(`/admin/orders/${id}`);
}
