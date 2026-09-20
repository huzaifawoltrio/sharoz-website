"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import SiteSettings from "@/lib/models/SiteSettings";
import { requireAdmin } from "@/lib/dal";
import { themeSchema } from "@/lib/validation/theme";
import { upsertSingleton } from "@/lib/utils/singleton";
import { firstZodMessage, type ActionState } from "@/lib/action-state";

export async function updateTheme(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const raw = JSON.parse(String(formData.get("payload") ?? "{}"));
  const parsed = themeSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  await dbConnect();
  // Partial update — upsertSingleton wraps this in $set, so siteName,
  // logo, socials, etc. on the same document are left untouched.
  await upsertSingleton(SiteSettings, { theme: parsed.data });

  revalidatePath("/", "layout");
  return { success: true };
}
