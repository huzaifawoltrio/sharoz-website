"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import HomePage from "@/lib/models/HomePage";
import { requireAdmin } from "@/lib/dal";
import { homePageSchema } from "@/lib/validation/homepage";
import { upsertSingleton } from "@/lib/utils/singleton";
import { firstZodMessage, type ActionState } from "@/lib/action-state";

export async function updateHomePage(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const raw = JSON.parse(String(formData.get("payload") ?? "{}"));
  const parsed = homePageSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  await dbConnect();
  await upsertSingleton(HomePage, parsed.data);

  revalidatePath("/");
  return { success: true };
}
