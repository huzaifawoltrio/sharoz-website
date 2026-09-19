"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Post from "@/lib/models/Post";
import { requireAdmin } from "@/lib/dal";
import { postSchema } from "@/lib/validation/post";
import { slugify } from "@/lib/utils/slugify";
import { sanitizeHtml } from "@/lib/sanitize";
import { firstZodMessage, type ActionState } from "@/lib/action-state";

function listPath(type: string) {
  return type === "journey" ? "/journeys" : "/blog";
}
function adminListPath(type: string) {
  return type === "journey" ? "/admin/journeys" : "/admin/blog";
}

export async function createPost(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const raw = JSON.parse(String(formData.get("payload") ?? "{}"));
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  await dbConnect();
  const slug = slugify(parsed.data.slug || parsed.data.title);
  const exists = await Post.findOne({ type: parsed.data.type, slug });
  if (exists) {
    return { error: "A post with that title/slug already exists" };
  }

  await Post.create({
    ...parsed.data,
    slug,
    bodyHtml: sanitizeHtml(parsed.data.bodyHtml),
    publishedAt: parsed.data.status === "published" ? new Date() : null,
  });

  revalidatePath(listPath(parsed.data.type));
  redirect(adminListPath(parsed.data.type));
}

export async function updatePost(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const raw = JSON.parse(String(formData.get("payload") ?? "{}"));
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  await dbConnect();
  const slug = slugify(parsed.data.slug || parsed.data.title);

  const existing = await Post.findById(id);
  const publishedAt =
    parsed.data.status === "published"
      ? existing?.publishedAt ?? new Date()
      : null;

  await Post.findByIdAndUpdate(id, {
    ...parsed.data,
    slug,
    bodyHtml: sanitizeHtml(parsed.data.bodyHtml),
    publishedAt,
  });

  revalidatePath(listPath(parsed.data.type));
  revalidatePath(`${listPath(parsed.data.type)}/${slug}`);
  redirect(adminListPath(parsed.data.type));
}

export async function deletePost(id: string, type: "journey" | "blog") {
  await requireAdmin();
  await dbConnect();
  await Post.findByIdAndDelete(id);
  revalidatePath(listPath(type));
  revalidatePath(adminListPath(type));
}
