import Link from "next/link";
import dbConnect from "@/lib/db";
import Artwork from "@/lib/models/Artwork";
import Post from "@/lib/models/Post";
import { countOrdersByStatus } from "@/lib/data/orders";
import { countUnreadMessages } from "@/lib/data/messages";

export default async function AdminDashboardPage() {
  await dbConnect();
  const [newOrders, unreadMessages, publishedArtworks, publishedPosts] =
    await Promise.all([
      countOrdersByStatus("new"),
      countUnreadMessages(),
      Artwork.countDocuments({ status: "published" }),
      Post.countDocuments({ status: "published" }),
    ]);

  const stats = [
    { label: "New Orders", value: newOrders, href: "/admin/orders?status=new" },
    { label: "Unread Messages", value: unreadMessages, href: "/admin/messages" },
    { label: "Published Artworks", value: publishedArtworks, href: "/admin/artworks" },
    { label: "Published Posts", value: publishedPosts, href: "/admin/journeys" },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl text-stone-800">
        Dashboard
      </h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-lg border border-stone-200 p-5 hover:border-stone-400"
          >
            <p className="text-3xl font-semibold text-stone-800">{s.value}</p>
            <p className="mt-1 text-sm text-stone-500">{s.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
