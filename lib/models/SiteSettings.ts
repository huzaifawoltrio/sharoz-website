import mongoose, { Schema } from "mongoose";
import { ImageSchema } from "./shared";

const SocialLinkSchema = new Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const ThemeSchema = new Schema(
  {
    paletteId: { type: String, default: "warm-neutral" },
    fonts: {
      display: { type: String, default: "Playfair Display" },
      body: { type: String, default: "Inter" },
    },
  },
  { _id: false }
);

const SiteSettingsSchema = new Schema(
  {
    siteName: { type: String, default: "Untitled Studio" },
    tagline: { type: String, default: "" },
    logo: { type: ImageSchema, default: () => ({}) },
    favicon: { type: ImageSchema, default: () => ({}) },
    contactEmail: { type: String, default: "" },
    socials: { type: [SocialLinkSchema], default: [] },
    footerNote: { type: String, default: "" },
    theme: { type: ThemeSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", SiteSettingsSchema);
