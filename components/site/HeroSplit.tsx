import Link from "next/link";
import CmsImage from "@/components/ui/CmsImage";

type Side = { image?: { url: string }; label: string; href: string };

export default function HeroSplit({
  left,
  right,
}: {
  left: Side;
  right: Side;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      {[left, right].map((side, i) => (
        <Link
          key={i}
          href={side.href}
          className="group relative block h-[45vh] min-h-72 overflow-hidden sm:h-[70vh]"
        >
          <CmsImage
            src={side.image?.url}
            alt={side.label}
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            eager
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
            <span className="font-[family-name:var(--font-display)] text-4xl text-white drop-shadow sm:text-6xl">
              {side.label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
