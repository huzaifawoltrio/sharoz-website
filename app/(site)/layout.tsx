import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { getSiteSettings, getCategories } from "@/lib/data/site";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, journeyCategories, paintingCategories] = await Promise.all([
    getSiteSettings(),
    getCategories("journey"),
    getCategories("painting"),
  ]);

  return (
    <>
      <SiteHeader
        siteName={settings.siteName}
        logoUrl={settings.logo?.url}
        journeyCategories={journeyCategories}
        paintingCategories={paintingCategories}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        siteName={settings.siteName}
        socials={settings.socials}
        footerNote={settings.footerNote}
      />
    </>
  );
}
