import Image from "next/image";

type CmsImageProps = {
  src?: string;
  alt: string;
  sizes: string;
  className?: string;
  eager?: boolean;
};

/**
 * Renders a Cloudinary-backed image with next/image, or a neutral
 * gradient placeholder when no image has been uploaded yet — so every
 * CMS-driven slot looks intentional before the admin fills it in.
 */
export default function CmsImage({
  src,
  alt,
  sizes,
  className,
  eager,
}: CmsImageProps) {
  if (!src) {
    return (
      <div
        className={`bg-gradient-to-br from-stone-200 via-stone-300 to-stone-400 ${className ?? ""}`}
        aria-hidden
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
    />
  );
}
