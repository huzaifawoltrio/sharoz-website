import { getArtworks } from "@/lib/data/artworks";
import ArtworkCard from "@/components/site/ArtworkCard";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const artworks = await getArtworks({ forSaleOnly: true });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-stone-800">
        Shop
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        Original paintings and fine-art prints, available now.
      </p>

      {artworks.length === 0 ? (
        <p className="mt-12 text-stone-500">Nothing available right now — check back soon.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((a) => (
            <ArtworkCard key={a._id} artwork={a} basePath="/shop" />
          ))}
        </div>
      )}
    </div>
  );
}
