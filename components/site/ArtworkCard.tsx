import Link from "next/link";
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
  return (
    <Link href={`${basePath}/${artwork.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <CmsImage
          src={artwork.images[0]?.url}
          alt={artwork.title}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium text-foreground">{artwork.title}</h3>
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
