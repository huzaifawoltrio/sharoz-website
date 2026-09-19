import dbConnect from "@/lib/db";
import Artwork from "@/lib/models/Artwork";
import Category from "@/lib/models/Category";
import { serialize } from "./serialize";
import type { ArtworkLean } from "@/lib/types";

const FOR_SALE_FILTER = {
  $or: [
    { "original.forSale": true, "original.sold": false },
    { prints: { $elemMatch: { stock: { $gt: 0 } } } },
  ],
};

export async function getArtworks(opts?: {
  categorySlug?: string;
  forSaleOnly?: boolean;
}) {
  await dbConnect();
  const query: Record<string, unknown> = { status: "published" };

  if (opts?.forSaleOnly) Object.assign(query, FOR_SALE_FILTER);

  if (opts?.categorySlug) {
    const category = await Category.findOne({
      type: "painting",
      slug: opts.categorySlug,
    }).lean<{ _id: string }>();
    if (category) query.categoryRefs = category._id;
    else return [];
  }

  const docs = await Artwork.find(query).sort({ createdAt: -1 }).lean();
  return serialize<ArtworkLean[]>(docs);
}

export async function getArtworkBySlug(slug: string) {
  await dbConnect();
  const doc = await Artwork.findOne({ slug, status: "published" }).lean();
  return doc ? serialize<ArtworkLean>(doc) : null;
}

export async function getAllArtworksAdmin() {
  await dbConnect();
  const docs = await Artwork.find({}).sort({ createdAt: -1 }).lean();
  return serialize<ArtworkLean[]>(docs);
}

export async function getArtworkByIdAdmin(id: string) {
  await dbConnect();
  const doc = await Artwork.findById(id).lean();
  return doc ? serialize<ArtworkLean>(doc) : null;
}
