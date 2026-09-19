import HeroSplit from "@/components/site/HeroSplit";
import TaglineHeading from "@/components/site/TaglineHeading";
import FullBleedBanner from "@/components/site/FullBleedBanner";
import TileGrid from "@/components/site/TileGrid";
import { getHomePage } from "@/lib/data/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const home = await getHomePage();

  return (
    <div>
      <HeroSplit left={home.hero.left} right={home.hero.right} />
      <TaglineHeading
        lines={home.taglineHeading}
        ctaLabel={home.taglineCta.label}
        ctaHref={home.taglineCta.href}
      />
      <FullBleedBanner
        image={home.banner.image}
        heading={home.banner.heading}
        subheading={home.banner.subheading}
        ctaLabel={home.banner.ctaLabel}
        ctaHref={home.banner.ctaHref}
      />
      <TileGrid heading={home.tilesSection.heading} tiles={home.tilesSection.tiles} />
    </div>
  );
}
