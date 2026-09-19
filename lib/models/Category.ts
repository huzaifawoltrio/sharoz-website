import mongoose, { Schema } from "mongoose";

export type CategoryType = "journey" | "painting";

const CategorySchema = new Schema(
  {
    type: { type: String, enum: ["journey", "painting"], required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
  },
  { timestamps: true }
);

CategorySchema.index({ type: 1, slug: 1 }, { unique: true });

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
