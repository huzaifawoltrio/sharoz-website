"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import ContactMessage from "@/lib/models/ContactMessage";
import { requireAdmin } from "@/lib/dal";
import { contactMessageSchema } from "@/lib/validation/contact";
import { firstZodMessage, type ActionState } from "@/lib/action-state";

export async function createContactMessage(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = contactMessageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  await dbConnect();
  await ContactMessage.create(parsed.data);

  return { success: true };
}

export async function markMessageRead(id: string, read: boolean) {
  await requireAdmin();
  await dbConnect();
  await ContactMessage.findByIdAndUpdate(id, { read });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await dbConnect();
  await ContactMessage.findByIdAndDelete(id);
  revalidatePath("/admin/messages");
}
