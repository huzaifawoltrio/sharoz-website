import dbConnect from "@/lib/db";
import Post from "@/lib/models/Post";
import Category from "@/lib/models/Category";
import { serialize } from "./serialize";
import type { PostLean } from "@/lib/types";
import type { PostType } from "@/lib/models/Post";

export async function getPosts(opts: { type: PostType; categorySlug?: string }) {
  await dbConnect();
  const query: Record<string, unknown> = {
    type: opts.type,
    status: "published",
  };

  if (opts.categorySlug) {
    const category = await Category.findOne({
      type: opts.type,
      slug: opts.categorySlug,
    }).lean<{ _id: string }>();
    if (category) query.categoryRef = category._id;
    else return [];
  }

  const docs = await Post.find(query).sort({ publishedAt: -1 }).lean();
  return serialize<PostLean[]>(docs);
}

export async function getPostBySlug(type: PostType, slug: string) {
  await dbConnect();
  const doc = await Post.findOne({ type, slug, status: "published" }).lean();
  return doc ? serialize<PostLean>(doc) : null;
}

export async function getAllPostsAdmin(type: PostType) {
  await dbConnect();
  const docs = await Post.find({ type }).sort({ createdAt: -1 }).lean();
  return serialize<PostLean[]>(docs);
}

export async function getPostByIdAdmin(id: string) {
  await dbConnect();
  const doc = await Post.findById(id).lean();
  return doc ? serialize<PostLean>(doc) : null;
}
