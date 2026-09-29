import ArtworkGallery from "@/components/site/ArtworkGallery";
import RichTextView from "@/components/ui/RichTextView";
import AddToCartButton from "@/components/site/AddToCartButton";
import type { ArtworkLean } from "@/lib/types";

export default function ArtworkDetail({ artwork }: { artwork: ArtworkLean }) {
  const isForSale =
    (artwork.original.forSale && !artwork.original.sold) ||
    artwork.prints.some((p) => p.stock > 0);

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-[3fr_2fr]">
      <ArtworkGallery images={artwork.images} title={artwork.title} />

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
