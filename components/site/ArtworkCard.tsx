import Link from "next/link";
import { Images } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import type { ArtworkLean } from "@/lib/types";

function lowestPrice(artwork: ArtworkLean): number | null {
  const prices = [
    ...(artwork.original.forSale && !artwork.original.sold
      ? [artwork.original.price]
      : []),
    ...artwork.prints.filter((p) => p.stock > 0).map((p) => p.price),
  ];
  return prices.length ? Math.min(...prices) : null;
}

export default function ArtworkCard({
  artwork,
  basePath = "/paintings",
}: {
  artwork: ArtworkLean;
  basePath?: string;
}) {
  const price = lowestPrice(artwork);
  const imageCount = artwork.images.filter((img) => img.url).length;
  return (
    <Link
      href={`${basePath}/${artwork.slug}`}
      className="group block"
      aria-label={`View ${artwork.title}`}
    >
      {/* Fixed frame so the grid stays aligned; the painting is fitted
          inside it (object-contain) so it is never cropped or stretched,
          whatever its proportions. */}
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <div className="absolute inset-3 sm:inset-4">
          <CmsImage
            src={artwork.images[0]?.url}
            alt={artwork.title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain transition-opacity duration-300 group-hover:opacity-90"
          />
        </div>
        {imageCount > 1 && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[11px] text-white">
            <Images className="h-3 w-3" aria-hidden />
            {imageCount}
          </span>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium text-foreground group-hover:underline">
          {artwork.title}
        </h3>
        {artwork.medium && (
          <p className="text-xs text-muted">{artwork.medium}</p>
        )}
        {price !== null && (
          <p className="mt-1 text-sm text-muted">from ${price.toLocaleString()}</p>
        )}
      </div>
    </Link>
  );
}
