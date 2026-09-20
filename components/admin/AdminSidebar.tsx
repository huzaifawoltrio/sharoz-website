import Link from "next/link";
import {
  LayoutDashboard,
  Settings,
  Home,
  User,
  Tags,
  Compass,
  Image as ImageIcon,
  Newspaper,
  ShoppingBag,
  Mail,
  KeyRound,
  LogOut,
  Palette,
} from "lucide-react";
import { logout } from "@/actions/auth";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/appearance", label: "Appearance", icon: Palette },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/about", label: "About Page", icon: User },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/journeys", label: "Journeys", icon: Compass },
  { href: "/admin/artworks", label: "Artworks", icon: ImageIcon },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/account", label: "Account", icon: KeyRound },
] as const;

export default function AdminSidebar() {
  return (
    <aside className="flex w-60 flex-shrink-0 flex-col border-r border-stone-200 bg-stone-50 p-4">
      <p className="mb-6 px-2 font-[family-name:var(--font-display)] text-lg text-stone-800">
        Admin
      </p>
      <nav className="flex flex-1 flex-col gap-1">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 rounded px-2.5 py-2 text-sm text-stone-600 hover:bg-stone-200/60 hover:text-stone-900"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <form action={logout}>
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-sm text-stone-600 hover:bg-stone-200/60 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </form>
    </aside>
  );
}
