"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartVariant =
  | { type: "original" }
  | { type: "print"; size: string };

export type CartItem = {
  artworkId: string;
  slug: string;
  title: string;
  image: string;
  variant: CartVariant;
  price: number;
  quantity: number;
};

function variantKey(variant: CartVariant): string {
  return variant.type === "original" ? "original" : `print:${variant.size}`;
}

export function itemKey(artworkId: string, variant: CartVariant): string {
  return `${artworkId}:${variantKey(variant)}`;
}

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (artworkId: string, variant: CartVariant) => void;
  updateQuantity: (
    artworkId: string,
    variant: CartVariant,
    quantity: number
  ) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const key = itemKey(item.artworkId, item.variant);
          const existing = state.items.find(
            (i) => itemKey(i.artworkId, i.variant) === key
          );
          // Originals are one-of-a-kind: adding again just keeps qty at 1.
          if (existing) {
            if (item.variant.type === "original") return state;
            return {
              items: state.items.map((i) =>
                itemKey(i.artworkId, i.variant) === key
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (artworkId, variant) =>
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.artworkId, i.variant) !== itemKey(artworkId, variant)
          ),
        })),
      updateQuantity: (artworkId, variant, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.artworkId, i.variant) === itemKey(artworkId, variant)
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "artist-site-cart" }
  )
);
