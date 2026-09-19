"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Category from "@/lib/models/Category";
import { requireAdmin } from "@/lib/dal";
import { categorySchema } from "@/lib/validation/category";
import { slugify } from "@/lib/utils/slugify";
import { firstZodMessage, type ActionState } from "@/lib/action-state";

export async function createCategory(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const raw = JSON.parse(String(formData.get("payload") ?? "{}"));
  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  await dbConnect();
  const slug = slugify(parsed.data.slug || parsed.data.name);

  const exists = await Category.findOne({ type: parsed.data.type, slug });
  if (exists) {
    return { error: "A category with that name already exists" };
  }

  await Category.create({ ...parsed.data, slug });

  revalidatePath("/", "layout");
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const raw = JSON.parse(String(formData.get("payload") ?? "{}"));
  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  await dbConnect();
  const slug = slugify(parsed.data.slug || parsed.data.name);
  await Category.findByIdAndUpdate(id, { ...parsed.data, slug });

  revalidatePath("/", "layout");
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await dbConnect();
  await Category.findByIdAndDelete(id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/categories");
}
