import Link from "next/link";
import SocialIcon from "@/components/site/SocialIcon";

export default function SiteFooter({
  siteName,
  socials,
  footerNote,
}: {
  siteName: string;
  socials: { platform: string; url: string }[];
  footerNote?: string;
}) {
  return (
    <footer className="border-t border-stone-200 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex gap-4">
          {socials.map((s) => (
            <Link
              key={s.platform}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-500 hover:text-stone-900"
            >
              <SocialIcon platform={s.platform} className="h-4 w-4" />
            </Link>
          ))}
        </div>
        <p className="text-sm text-stone-500">
          {footerNote || `© ${new Date().getFullYear()} ${siteName}`}
        </p>
      </div>
    </footer>
  );
}
