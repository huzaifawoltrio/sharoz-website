import Link from "next/link";

export default function TaglineHeading({
  lines,
  ctaLabel,
  ctaHref,
}: {
  lines: string[];
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-3xl leading-tight text-stone-800 sm:text-4xl">
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h1>
      {ctaLabel && (
        <Link
          href={ctaHref}
          className="mt-8 inline-block rounded bg-stone-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
