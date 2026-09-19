import mongoose, { Schema } from "mongoose";
import { ImageSchema } from "./shared";

const AboutPageSchema = new Schema(
  {
    heading: { type: String, default: "About" },
    bodyHtml: { type: String, default: "" },
    portrait: { type: ImageSchema, default: () => ({}) },
    gallery: { type: [ImageSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.AboutPage ||
  mongoose.model("AboutPage", AboutPageSchema);
