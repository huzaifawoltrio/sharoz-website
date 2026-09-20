import CmsImage from "@/components/ui/CmsImage";
import RichTextView from "@/components/ui/RichTextView";
import AddToCartButton from "@/components/site/AddToCartButton";
import type { ArtworkLean } from "@/lib/types";

export default function ArtworkDetail({ artwork }: { artwork: ArtworkLean }) {
  const isForSale =
    (artwork.original.forSale && !artwork.original.sold) ||
    artwork.prints.some((p) => p.stock > 0);

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2">
      <div className="flex flex-col gap-3">
        <div className="relative aspect-[4/5] overflow-hidden bg-surface">
          <CmsImage
            src={artwork.images[0]?.url}
            alt={artwork.title}
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
            eager
          />
        </div>
        {artwork.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {artwork.images.slice(1).map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden bg-surface">
                <CmsImage src={img.url} alt="" sizes="120px" className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-foreground">
          {artwork.title}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {[artwork.medium, artwork.dimensions, artwork.year].filter(Boolean).join(" · ")}
        </p>

        {artwork.descriptionHtml && (
          <RichTextView html={artwork.descriptionHtml} className="mt-6" />
        )}

        <div className="mt-8">
          {isForSale ? (
            <AddToCartButton artwork={artwork} />
          ) : (
            <p className="rounded bg-surface px-4 py-3 text-sm text-muted">
              Not currently for sale.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
