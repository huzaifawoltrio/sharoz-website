import Link from "next/link";
import CmsImage from "@/components/ui/CmsImage";

export default function FullBleedBanner({
  image,
  heading,
  subheading,
  ctaLabel,
  ctaHref,
}: {
  image?: { url: string };
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="relative flex h-[70vh] min-h-96 items-center justify-center overflow-hidden">
      <CmsImage
        src={image?.url}
        alt={heading}
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative mx-auto max-w-2xl px-6 text-center text-white">
        <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
          {heading}
        </h2>
        {subheading && (
          <p className="mt-4 text-sm text-white/90 sm:text-base">
            {subheading}
          </p>
        )}
        {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="mt-8 inline-block rounded bg-stone-900/90 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-900"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
