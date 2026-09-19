"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import SiteSettings from "@/lib/models/SiteSettings";
import { requireAdmin } from "@/lib/dal";
import { siteSettingsSchema } from "@/lib/validation/site-settings";
import { upsertSingleton } from "@/lib/utils/singleton";
import { firstZodMessage, type ActionState } from "@/lib/action-state";

export async function updateSiteSettings(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const raw = JSON.parse(String(formData.get("payload") ?? "{}"));
  const parsed = siteSettingsSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  await dbConnect();
  await upsertSingleton(SiteSettings, parsed.data);

  revalidatePath("/", "layout");
  return { success: true };
}
