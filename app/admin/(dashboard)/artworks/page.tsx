import Link from "next/link";
import { getAllArtworksAdmin } from "@/lib/data/artworks";
import { deleteArtwork } from "@/actions/artworks";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminArtworksPage() {
  const artworks = await getAllArtworksAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-stone-800">
          Artworks
        </h1>
        <Link
          href="/admin/artworks/new"
          className="rounded bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-800"
        >
          New Artwork
        </Link>
      </div>

      <div className="overflow-x-auto rounded border border-stone-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">For Sale</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {artworks.map((a) => (
              <tr key={a._id}>
                <td className="px-4 py-2">{a.title}</td>
                <td className="px-4 py-2 capitalize">{a.status}</td>
                <td className="px-4 py-2 text-stone-500">
                  {a.original.forSale || a.prints.length > 0 ? "Yes" : "No"}
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/artworks/${a._id}/edit`}
                      className="text-xs text-stone-500 hover:text-stone-900"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteArtwork.bind(null, a._id)} />
                  </div>
                </td>
              </tr>
            ))}
            {artworks.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-stone-400">
                  No artworks yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
