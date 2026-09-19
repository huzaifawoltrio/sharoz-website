"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, type CartVariant } from "@/lib/cart-store";
import type { ArtworkLean } from "@/lib/types";

export default function AddToCartButton({ artwork }: { artwork: ArtworkLean }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const printOptions = artwork.prints.filter((p) => p.stock > 0);
  const originalAvailable = artwork.original.forSale && !artwork.original.sold;

  type Option = { key: string; variant: CartVariant; price: number; label: string };
  const options: Option[] = [
    ...(originalAvailable
      ? [
          {
            key: "original",
            variant: { type: "original" as const },
            price: artwork.original.price,
            label: "Original (one of a kind)",
          },
        ]
      : []),
    ...printOptions.map((p) => ({
      key: `print:${p.size}`,
      variant: { type: "print" as const, size: p.size },
      price: p.price,
      label: `Print — ${p.size}`,
    })),
  ];

  const [selectedKey, setSelectedKey] = useState(options[0]?.key);
  const [added, setAdded] = useState(false);

  if (options.length === 0) {
    return (
      <p className="rounded bg-stone-100 px-4 py-3 text-sm text-stone-600">
        This piece isn&apos;t currently available.
      </p>
    );
  }

  const selected = options.find((o) => o.key === selectedKey) ?? options[0];

  function handleAdd() {
    addItem({
      artworkId: artwork._id,
      slug: artwork.slug,
      title: artwork.title,
      image: artwork.images[0]?.url ?? "",
      variant: selected.variant,
      price: selected.price,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-3">
      {options.length > 1 && (
        <select
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          className="rounded border border-stone-300 px-3 py-2 text-sm"
        >
          {options.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label} — ${o.price.toLocaleString()}
            </option>
          ))}
        </select>
      )}
      <p className="text-xl text-stone-800">${selected.price.toLocaleString()}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-800"
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={() => {
            handleAdd();
            router.push("/cart");
          }}
          className="flex-1 rounded border border-stone-300 px-5 py-3 text-sm font-medium text-stone-800 hover:bg-stone-100"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
