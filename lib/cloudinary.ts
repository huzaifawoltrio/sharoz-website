import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Signs the parameters an admin's browser needs to upload an image blob
 * directly to Cloudinary's REST API, bypassing Next.js Server Actions
 * (and their body-size limit) entirely.
 */
export function getUploadSignature(params: Record<string, string | number>) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    throw new Error(
      "CLOUDINARY_API_SECRET is not set. Add it to .env.local (see .env.example)."
    );
  }
  const signature = cloudinary.utils.api_sign_request(params, apiSecret);
  return signature;
}

/**
 * Best-effort delete of a Cloudinary asset when an admin replaces an
 * image. Never throws — an orphaned asset is a minor cost, a failed save
 * because Cloudinary hiccupped is not acceptable.
 */
export async function destroyImage(publicId: string | undefined | null) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Failed to delete Cloudinary asset", publicId, err);
  }
}

export default cloudinary;
