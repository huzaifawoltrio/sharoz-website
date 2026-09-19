import "server-only";
import { v2 as cloudinary } from "cloudinary";

// .trim() guards against the #1 real-world cause of Cloudinary "Invalid
// Signature" errors: a stray trailing newline or space picked up when an
// env var value is copy-pasted into a hosting dashboard (Vercel, etc.).
// A secret like "abc123\n" hashes to something completely different from
// "abc123", and the mismatch only ever shows up in production.
function cleanEnv(value: string | undefined) {
  return value?.trim() || undefined;
}

const cloudName = cleanEnv(process.env.CLOUDINARY_CLOUD_NAME);
const apiKey = cleanEnv(process.env.CLOUDINARY_API_KEY);
const apiSecret = cleanEnv(process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

/**
 * Signs the parameters an admin's browser needs to upload an image blob
 * directly to Cloudinary's REST API, bypassing Next.js Server Actions
 * (and their body-size limit) entirely.
 */
export function getUploadSignature(params: Record<string, string | number>) {
  if (!apiSecret) {
    throw new Error(
      "CLOUDINARY_API_SECRET is not set. Add it to .env.local (see .env.example)."
    );
  }
  return cloudinary.utils.api_sign_request(params, apiSecret);
}

export function getCloudinaryPublicConfig() {
  return { cloudName, apiKey, hasSecret: Boolean(apiSecret) };
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
