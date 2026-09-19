import mongoose, { Schema } from "mongoose";
import { ImageSchema } from "./shared";

const HeroSideSchema = new Schema(
  {
    image: { type: ImageSchema, default: () => ({}) },
    label: { type: String, default: "" },
    href: { type: String, default: "/" },
  },
  { _id: false }
);

const TileSchema = new Schema(
  {
    image: { type: ImageSchema, default: () => ({}) },
    label: { type: String, default: "" },
    href: { type: String, default: "/" },
  },
  { _id: false }
);

const HomePageSchema = new Schema(
  {
    hero: {
      left: { type: HeroSideSchema, default: () => ({}) },
      right: { type: HeroSideSchema, default: () => ({}) },
    },
    taglineHeading: { type: [String], default: [] },
    taglineCta: {
      label: { type: String, default: "Get in Touch" },
      href: { type: String, default: "/contact" },
    },
    banner: {
      image: { type: ImageSchema, default: () => ({}) },
      heading: { type: String, default: "" },
      subheading: { type: String, default: "" },
      ctaLabel: { type: String, default: "" },
      ctaHref: { type: String, default: "/" },
    },
    tilesSection: {
      heading: { type: String, default: "" },
      tiles: { type: [TileSchema], default: [] },
    },
  },
  { timestamps: true }
);

export default mongoose.models.HomePage ||
  mongoose.model("HomePage", HomePageSchema);
