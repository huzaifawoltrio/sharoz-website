"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Artwork from "@/lib/models/Artwork";
import { requireAdmin } from "@/lib/dal";
import { artworkSchema } from "@/lib/validation/artwork";
import { slugify } from "@/lib/utils/slugify";
import { sanitizeHtml } from "@/lib/sanitize";
import { firstZodMessage, type ActionState } from "@/lib/action-state";

function revalidateArtworkPaths(slug?: string) {
  revalidatePath("/paintings");
  revalidatePath("/shop");
  if (slug) {
    revalidatePath(`/paintings/${slug}`);
    revalidatePath(`/shop/${slug}`);
  }
}

export async function createArtwork(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const raw = JSON.parse(String(formData.get("payload") ?? "{}"));
  const parsed = artworkSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  await dbConnect();
  const slug = slugify(parsed.data.slug || parsed.data.title);
  const exists = await Artwork.findOne({ slug });
  if (exists) {
    return { error: "An artwork with that title/slug already exists" };
  }

  await Artwork.create({
    ...parsed.data,
    slug,
    descriptionHtml: sanitizeHtml(parsed.data.descriptionHtml),
  });

  revalidateArtworkPaths(slug);
  redirect("/admin/artworks");
}

export async function updateArtwork(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const raw = JSON.parse(String(formData.get("payload") ?? "{}"));
  const parsed = artworkSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  await dbConnect();
  const slug = slugify(parsed.data.slug || parsed.data.title);

  await Artwork.findByIdAndUpdate(id, {
    ...parsed.data,
    slug,
    descriptionHtml: sanitizeHtml(parsed.data.descriptionHtml),
  });

  revalidateArtworkPaths(slug);
  redirect("/admin/artworks");
}

export async function deleteArtwork(id: string) {
  await requireAdmin();
  await dbConnect();
  const artwork = await Artwork.findByIdAndDelete(id);
  revalidateArtworkPaths(artwork?.slug);
}
