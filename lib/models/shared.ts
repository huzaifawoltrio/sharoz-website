import { Schema } from "mongoose";

/** Reusable image reference sub-schema: a Cloudinary URL + public ID. */
export const ImageSchema = new Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  { _id: false }
);

export type ImageRef = {
  url: string;
  publicId: string;
};

export const emptyImage: ImageRef = { url: "", publicId: "" };
