import mongoose, { Schema } from "mongoose";
import { ImageSchema } from "./shared";

export type PostType = "journey" | "blog";
export type PostStatus = "draft" | "published";

const PostSchema = new Schema(
  {
    type: { type: String, enum: ["journey", "blog"], required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    coverImage: { type: ImageSchema, default: () => ({}) },
    excerpt: { type: String, default: "" },
    bodyHtml: { type: String, default: "" },
    categoryRef: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

PostSchema.index({ type: 1, slug: 1 }, { unique: true });
PostSchema.index({ type: 1, status: 1, publishedAt: -1 });

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
