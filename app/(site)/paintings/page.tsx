import { getArtworks } from "@/lib/data/artworks";
import { getCategories } from "@/lib/data/site";
import ArtworkCard from "@/components/site/ArtworkCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PaintingsPage({
  searchParams,
}: PageProps<"/paintings">) {
  const { category } = await searchParams;
  const categorySlug = typeof category === "string" ? category : undefined;

  const [artworks, categories] = await Promise.all([
    getArtworks({ categorySlug }),
    getCategories("painting"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-foreground">
        Paintings
      </h1>

      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link
            href="/paintings"
            className={!categorySlug ? "font-medium text-foreground" : "text-muted"}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c._id}
              href={`/paintings?category=${c.slug}`}
              className={
                categorySlug === c.slug ? "font-medium text-foreground" : "text-muted"
              }
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {artworks.length === 0 ? (
        <p className="mt-12 text-muted">No paintings yet — check back soon.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((a) => (
            <ArtworkCard key={a._id} artwork={a} />
          ))}
        </div>
      )}
    </div>
  );
}
