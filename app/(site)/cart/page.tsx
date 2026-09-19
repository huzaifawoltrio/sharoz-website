"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore, itemKey } from "@/lib/cart-store";

function variantLabel(variant: { type: string; size?: string }) {
  return variant.type === "original" ? "Original" : `Print — ${variant.size}`;
}

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-stone-800">
          Your cart is empty
        </h1>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded bg-stone-900 px-6 py-3 text-sm font-medium text-white hover:bg-stone-800"
        >
          Browse the Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-stone-800">
        Your Cart
      </h1>

      <ul className="mt-8 divide-y divide-stone-200">
        {items.map((item) => (
          <li key={itemKey(item.artworkId, item.variant)} className="flex gap-4 py-5">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded bg-stone-100">
              {item.image && (
                <Image src={item.image} alt={item.title} fill sizes="96px" className="object-cover" />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="font-medium text-stone-800">{item.title}</p>
                <p className="text-sm text-stone-500">{variantLabel(item.variant)}</p>
              </div>
              <div className="flex items-center gap-3">
                {item.variant.type === "print" && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.artworkId, item.variant, item.quantity - 1)
                      }
                      className="rounded border border-stone-300 p-1"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.artworkId, item.variant, item.quantity + 1)
                      }
                      className="rounded border border-stone-300 p-1"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeItem(item.artworkId, item.variant)}
                  className="flex items-center gap-1 text-xs text-stone-500 hover:text-red-600"
                >
                  <X className="h-3 w-3" /> Remove
                </button>
              </div>
            </div>
            <p className="text-sm text-stone-700">
              ${(item.price * item.quantity).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-stone-200 pt-6">
        <span className="text-lg font-medium text-stone-800">Subtotal</span>
        <span className="text-lg text-stone-800">${subtotal.toLocaleString()}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block w-full rounded bg-stone-900 px-6 py-3 text-center text-sm font-medium text-white hover:bg-stone-800"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
