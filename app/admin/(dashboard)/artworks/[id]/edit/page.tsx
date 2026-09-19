import { notFound } from "next/navigation";
import { getArtworkByIdAdmin } from "@/lib/data/artworks";
import { getCategories } from "@/lib/data/site";
import { updateArtwork } from "@/actions/artworks";
import ArtworkForm from "@/components/admin/forms/ArtworkForm";

export default async function EditArtworkPage({
  params,
}: PageProps<"/admin/artworks/[id]/edit">) {
  const { id } = await params;
  const [artwork, categories] = await Promise.all([
    getArtworkByIdAdmin(id),
    getCategories("painting"),
  ]);
  if (!artwork) notFound();

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-stone-800">
        Edit Artwork
      </h1>
      <ArtworkForm
        initial={artwork}
        categories={categories}
        action={updateArtwork.bind(null, id)}
      />
    </div>
  );
}
