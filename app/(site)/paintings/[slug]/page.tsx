import { notFound } from "next/navigation";
import { getArtworkBySlug } from "@/lib/data/artworks";
import ArtworkDetail from "@/components/site/ArtworkDetail";

export const dynamic = "force-dynamic";

export default async function ArtworkDetailPage({
  params,
}: PageProps<"/paintings/[slug]">) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  if (!artwork) notFound();
  return <ArtworkDetail artwork={artwork} />;
}
