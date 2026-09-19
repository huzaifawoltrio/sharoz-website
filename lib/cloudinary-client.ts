"use client";

export type CropPixels = { x: number; y: number; width: number; height: number };

/**
 * Draws the cropped region of an image onto an offscreen canvas and
 * returns it as a JPEG Blob. Standard react-easy-crop recipe.
 */
export function getCroppedBlob(
  imageSrc: string,
  cropPixels: CropPixels
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cropPixels.width;
      canvas.height = cropPixels.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(
        image,
        cropPixels.x,
        cropPixels.y,
        cropPixels.width,
        cropPixels.height,
        0,
        0,
        cropPixels.width,
        cropPixels.height
      );
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create image blob"));
        },
        "image/jpeg",
        0.92
      );
    };
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = imageSrc;
  });
}

export type CloudinaryUploadResult = { url: string; publicId: string };

/**
 * Uploads a blob directly to Cloudinary's REST API using a signature
 * fetched from our own backend. The blob never passes through a Next.js
 * Server Action, so its size is not limited by serverActions.bodySizeLimit.
 */
export async function uploadToCloudinary(
  blob: Blob,
  folder: string
): Promise<CloudinaryUploadResult> {
  const signRes = await fetch("/api/admin/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });

  if (!signRes.ok) {
    const body = await signRes.json().catch(() => ({}));
    throw new Error(body.error || "Could not get an upload signature");
  }

  const { signature, timestamp, apiKey, cloudName } = await signRes.json();

  const formData = new FormData();
  formData.append("file", blob);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!uploadRes.ok) {
    throw new Error("Image upload to Cloudinary failed");
  }

  const data = await uploadRes.json();
  return { url: data.secure_url as string, publicId: data.public_id as string };
}
