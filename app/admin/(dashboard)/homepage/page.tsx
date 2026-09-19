import { getHomePage } from "@/lib/data/site";
import HomePageForm from "@/components/admin/forms/HomePageForm";

const EMPTY_TILE = { image: { url: "", publicId: "" }, label: "", href: "/" };

export default async function AdminHomePagePage() {
  const home = await getHomePage();

  // Guarantee exactly 3 tile slots for the editor, regardless of seed state.
  const tiles = [...home.tilesSection.tiles];
  while (tiles.length < 3) tiles.push({ ...EMPTY_TILE });
  const initial = {
    ...home,
    tilesSection: { ...home.tilesSection, tiles: tiles.slice(0, 3) },
  };

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-stone-800">
        Homepage
      </h1>
      <HomePageForm initial={initial} />
    </div>
  );
}
