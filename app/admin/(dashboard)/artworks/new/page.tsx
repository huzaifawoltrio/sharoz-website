import { getCategories } from "@/lib/data/site";
import { createArtwork } from "@/actions/artworks";
import ArtworkForm from "@/components/admin/forms/ArtworkForm";

const EMPTY: import("@/lib/validation/artwork").ArtworkInput = {
  title: "",
  images: [],
  descriptionHtml: "",
  medium: "",
  dimensions: "",
  year: null,
  categoryRefs: [],
  original: { forSale: false, price: 0, sold: false },
  prints: [],
  tags: [],
  status: "draft",
};

export default async function NewArtworkPage() {
  const categories = await getCategories("painting");

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-stone-800">
        New Artwork
      </h1>
      <ArtworkForm initial={EMPTY} categories={categories} action={createArtwork} />
    </div>
  );
}
