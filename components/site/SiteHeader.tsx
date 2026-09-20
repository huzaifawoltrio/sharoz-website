"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import type { CategoryLean } from "@/lib/types";

type SiteHeaderProps = {
  siteName: string;
  logoUrl?: string;
  journeyCategories: CategoryLean[];
  paintingCategories: CategoryLean[];
};

function Dropdown({
  label,
  basePath,
  categories,
  light,
}: {
  label: string;
  basePath: string;
  categories: CategoryLean[];
  light: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={basePath}
        className={`flex items-center gap-1 py-2 text-sm transition-colors ${
          light
            ? "text-white/95 drop-shadow hover:text-white"
            : "text-foreground hover:text-accent"
        }`}
      >
        {label}
        {categories.length > 0 && <ChevronDown className="h-3 w-3" />}
      </Link>
      {open && categories.length > 0 && (
        <div className="absolute left-0 top-full min-w-40 border border-border bg-background py-2 shadow-lg">
          {categories.map((c) => (
            <Link
              key={c._id}
              href={`${basePath}?category=${c.slug}`}
              className="block px-4 py-1.5 text-sm text-muted hover:bg-surface hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SiteHeader({
  siteName,
  logoUrl,
  journeyCategories,
  paintingCategories,
}: SiteHeaderProps) {
  const pathname = usePathname();
  // Only the homepage has a full-bleed photo directly beneath the header,
  // so only there does a transparent, white-text header (matching the
  // reference design) stay readable. Every other page keeps a normal
  // solid header.
  const transparent = pathname === "/";

  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  const linkClass = transparent
    ? "py-2 text-sm text-white/95 drop-shadow transition-colors hover:text-white"
    : "py-2 text-sm text-foreground transition-colors hover:text-accent";

  const navLinks = (
    <>
      <Dropdown
        label="Journeys"
        basePath="/journeys"
        categories={journeyCategories}
        light={transparent}
      />
      <Dropdown
        label="Paintings"
        basePath="/paintings"
        categories={paintingCategories}
        light={transparent}
      />
      <Link href="/about" className={linkClass}>
        About
      </Link>
      <Link href="/blog" className={linkClass}>
        Blog
      </Link>
      <Link href="/shop" className={linkClass}>
        Shop
      </Link>
    </>
  );

  return (
    <header
      className={
        transparent
          ? "absolute inset-x-0 top-0 z-40 bg-transparent"
          : "sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image src={logoUrl} alt={siteName} width={140} height={40} className="h-8 w-auto" />
          ) : (
            <span
              className={`font-[family-name:var(--font-display)] text-xl ${
                transparent ? "text-white drop-shadow" : "text-foreground"
              }`}
            >
              {siteName}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">{navLinks}</nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingBag
              className={`h-5 w-5 ${transparent ? "text-white drop-shadow" : "text-foreground"}`}
            />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-accent-foreground">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="sm:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className={`h-5 w-5 ${transparent ? "text-white drop-shadow" : "text-foreground"}`} />
            ) : (
              <Menu className={`h-5 w-5 ${transparent ? "text-white drop-shadow" : "text-foreground"}`} />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className={`flex flex-col gap-1 px-6 py-4 sm:hidden ${
            transparent
              ? "bg-black/70 backdrop-blur"
              : "border-t border-border"
          }`}
        >
          {navLinks}
        </nav>
      )}
    </header>
  );
}
