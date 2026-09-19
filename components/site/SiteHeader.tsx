"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
}: {
  label: string;
  basePath: string;
  categories: CategoryLean[];
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
        className="flex items-center gap-1 py-2 text-sm text-stone-700 hover:text-stone-950"
      >
        {label}
        {categories.length > 0 && <ChevronDown className="h-3 w-3" />}
      </Link>
      {open && categories.length > 0 && (
        <div className="absolute left-0 top-full min-w-40 border border-stone-200 bg-white py-2 shadow-lg">
          {categories.map((c) => (
            <Link
              key={c._id}
              href={`${basePath}?category=${c.slug}`}
              className="block px-4 py-1.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-950"
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  const navLinks = (
    <>
      <Dropdown label="Journeys" basePath="/journeys" categories={journeyCategories} />
      <Dropdown label="Paintings" basePath="/paintings" categories={paintingCategories} />
      <Link href="/about" className="py-2 text-sm text-stone-700 hover:text-stone-950">
        About
      </Link>
      <Link href="/blog" className="py-2 text-sm text-stone-700 hover:text-stone-950">
        Blog
      </Link>
      <Link href="/shop" className="py-2 text-sm text-stone-700 hover:text-stone-950">
        Shop
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image src={logoUrl} alt={siteName} width={140} height={40} className="h-8 w-auto" />
          ) : (
            <span className="font-[family-name:var(--font-display)] text-xl text-stone-900">
              {siteName}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">{navLinks}</nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingBag className="h-5 w-5 text-stone-700" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 text-[10px] text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="sm:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-stone-200 px-6 py-4 sm:hidden">
          {navLinks}
        </nav>
      )}
    </header>
  );
}
