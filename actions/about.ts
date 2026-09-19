"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import AboutPage from "@/lib/models/AboutPage";
import { requireAdmin } from "@/lib/dal";
import { aboutPageSchema } from "@/lib/validation/about";
import { upsertSingleton } from "@/lib/utils/singleton";
import { sanitizeHtml } from "@/lib/sanitize";
import { firstZodMessage, type ActionState } from "@/lib/action-state";

export async function updateAboutPage(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const raw = JSON.parse(String(formData.get("payload") ?? "{}"));
  const parsed = aboutPageSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  await dbConnect();
  await upsertSingleton(AboutPage, {
    ...parsed.data,
    bodyHtml: sanitizeHtml(parsed.data.bodyHtml),
  });

  revalidatePath("/about");
  return { success: true };
}
