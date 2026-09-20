import { getAboutPage } from "@/lib/data/site";
import CmsImage from "@/components/ui/CmsImage";
import RichTextView from "@/components/ui/RichTextView";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-foreground">
        {about.heading}
      </h1>

      {about.portrait?.url && (
        <div className="relative mt-8 aspect-[4/5] max-w-sm overflow-hidden rounded">
          <CmsImage
            src={about.portrait.url}
            alt={about.heading}
            sizes="384px"
            className="object-cover"
          />
        </div>
      )}

      <RichTextView html={about.bodyHtml} className="mt-8" />

      {about.gallery.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {about.gallery.map((img, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded bg-surface">
              <CmsImage src={img.url} alt="" sizes="240px" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
