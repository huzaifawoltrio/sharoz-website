"use server";

import { z } from "zod";
import dbConnect from "@/lib/db";
import SiteSettings from "@/lib/models/SiteSettings";
import { requireAdmin } from "@/lib/dal";
import { firstZodMessage } from "@/lib/action-state";
import { MAX_ASPECT_SIDE, type AspectRatioOption } from "@/lib/aspect-ratios";

const aspectSide = z
  .number({ error: "Width and height must be numbers" })
  .positive("Width and height must be greater than 0")
  .max(MAX_ASPECT_SIDE, `Width and height must be at most ${MAX_ASPECT_SIDE}`);

const customAspectRatioSchema = z.object({
  label: z.string().trim().max(40, "Name must be 40 characters or fewer"),
  width: aspectSide,
  height: aspectSide,
});

type StoredRatio = { _id: unknown; label?: string; width: number; height: number };

function toOptions(ratios: StoredRatio[] | undefined): AspectRatioOption[] {
  return (ratios ?? []).map((r) => ({
    id: String(r._id),
    label: r.label ?? "",
    width: r.width,
    height: r.height,
  }));
}

async function readCustomRatios() {
  const doc = await SiteSettings.findOne({})
    .select("customAspectRatios")
    .lean<{ customAspectRatios?: StoredRatio[] }>()
    .exec();
  return toOptions(doc?.customAspectRatios);
}

export async function getCustomAspectRatios(): Promise<AspectRatioOption[]> {
  await requireAdmin();
  await dbConnect();
  return readCustomRatios();
}

export async function addCustomAspectRatio(input: {
  label: string;
  width: number;
  height: number;
}): Promise<{ error?: string; ratios?: AspectRatioOption[] }> {
  await requireAdmin();

  const parsed = customAspectRatioSchema.safeParse(input);
  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  await dbConnect();
  await SiteSettings.findOneAndUpdate(
    {},
    { $push: { customAspectRatios: parsed.data } },
    { upsert: true, setDefaultsOnInsert: true }
  ).exec();

  return { ratios: await readCustomRatios() };
}

export async function removeCustomAspectRatio(
  id: string
): Promise<{ error?: string; ratios?: AspectRatioOption[] }> {
  await requireAdmin();

  if (!/^[a-f0-9]{24}$/i.test(id)) {
    return { error: "Invalid aspect ratio" };
  }

  await dbConnect();
  await SiteSettings.updateOne(
    {},
    { $pull: { customAspectRatios: { _id: id } } }
  ).exec();

  return { ratios: await readCustomRatios() };
}
