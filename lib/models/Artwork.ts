import mongoose, { Schema } from "mongoose";
import { ImageSchema } from "./shared";

export type ArtworkStatus = "draft" | "published";

const PrintVariantSchema = new Schema(
  {
    size: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }
);

const ArtworkSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    images: { type: [ImageSchema], default: [] },
    descriptionHtml: { type: String, default: "" },
    medium: { type: String, default: "" },
    dimensions: { type: String, default: "" },
    year: { type: Number, default: null },
    categoryRefs: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    original: {
      forSale: { type: Boolean, default: false },
      price: { type: Number, default: 0, min: 0 },
      sold: { type: Boolean, default: false },
    },
    prints: { type: [PrintVariantSchema], default: [] },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true }
);

ArtworkSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Artwork ||
  mongoose.model("Artwork", ArtworkSchema);
