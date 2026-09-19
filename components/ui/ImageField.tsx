"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import CropModal from "./CropModal";
import { uploadToCloudinary, type CloudinaryUploadResult } from "@/lib/cloudinary-client";

export type ImageValue = { url: string; publicId: string };

type ImageFieldProps = {
  label?: string;
  value: ImageValue;
  onChange: (value: ImageValue) => void;
  /** Crop aspect ratio, e.g. 16/9, 1, 4/5. Omit for free-form cropping. */
  aspect?: number;
  /** Cloudinary folder this image should be uploaded into. */
  folder: string;
  className?: string;
};

/**
 * A reusable "picture resizer" field: pick a file, crop/zoom it to the
 * right aspect ratio, upload straight to Cloudinary, and hand the parent
 * form the resulting {url, publicId}. The parent form persists that value
 * to Mongo when it saves — this component never talks to the database.
 */
export default function ImageField({
  label,
  value,
  onChange,
  aspect,
  folder,
  className,
}: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingSrc, setPendingSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setPendingSrc(URL.createObjectURL(file));
    e.target.value = "";
  }

  async function handleCropConfirm(blob: Blob) {
    setPendingSrc(null);
    setUploading(true);
    setError(null);
    try {
      const result: CloudinaryUploadResult = await uploadToCloudinary(
        blob,
        folder
      );
      onChange(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-md border border-dashed border-stone-300 bg-stone-50">
        {value.url ? (
          <Image
            src={value.url}
            alt=""
            fill
            sizes="400px"
            className="object-cover"
          />
        ) : (
          <ImageIcon className="h-8 w-8 text-stone-300" />
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-100"
        >
          <Upload className="h-3.5 w-3.5" />
          {value.url ? "Change image" : "Upload image"}
        </button>
        {value.url && (
          <button
            type="button"
            onClick={() => onChange({ url: "", publicId: "" })}
            className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-red-600"
          >
            <X className="h-3.5 w-3.5" />
            Remove
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {pendingSrc && (
        <CropModal
          imageSrc={pendingSrc}
          aspect={aspect ?? 1}
          onCancel={() => setPendingSrc(null)}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  );
}
