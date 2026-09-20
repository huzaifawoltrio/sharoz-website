import Link from "next/link";
import CmsImage from "@/components/ui/CmsImage";

type Tile = { image?: { url: string }; label: string; href: string };

export default function TileGrid({
  heading,
  tiles,
}: {
  heading: string;
  tiles: Tile[];
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {heading && (
        <h2 className="mb-8 font-[family-name:var(--font-display)] text-2xl text-foreground sm:text-3xl">
          {heading}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
        {tiles.map((tile, i) => (
          <Link
            key={i}
            href={tile.href}
            className="group relative block aspect-[4/5] overflow-hidden"
          >
            <CmsImage
              src={tile.image?.url}
              alt={tile.label}
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
              <span className="text-sm font-medium text-white">
                {tile.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
