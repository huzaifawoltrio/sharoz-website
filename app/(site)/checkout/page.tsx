"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { createOrder } from "@/actions/orders";
import SubmitButton from "@/components/ui/SubmitButton";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const [buyer, setBuyer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [state, action] = useActionState(createOrder, undefined);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
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

  const payload = {
    buyer,
    items: items.map((i) => ({
      artworkId: i.artworkId,
      slug: i.slug,
      title: i.title,
      image: i.image,
      variant: i.variant,
      price: i.price,
      quantity: i.quantity,
    })),
  };

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2">
      <form action={action} className="flex flex-col gap-4">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-stone-800">
          Checkout
        </h1>
        <p className="text-sm text-stone-500">
          No payment is collected online — submit your details and we&apos;ll follow up
          to arrange payment and shipping.
        </p>

        <input type="hidden" name="payload" value={JSON.stringify(payload)} />

        {(["name", "email", "phone", "address"] as const).map((field) => (
          <div key={field}>
            <label className="mb-1 block text-sm font-medium capitalize text-stone-700">
              {field}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              value={buyer[field]}
              onChange={(e) => setBuyer((b) => ({ ...b, [field]: e.target.value }))}
              required={field === "name" || field === "email"}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </div>
        ))}
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Message (optional)
          </label>
          <textarea
            value={buyer.message}
            onChange={(e) => setBuyer((b) => ({ ...b, message: e.target.value }))}
            rows={3}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <SubmitButton>Submit Inquiry</SubmitButton>
      </form>

      <div>
        <h2 className="mb-4 text-lg font-medium text-stone-800">Order Summary</h2>
        <ul className="divide-y divide-stone-200">
          {items.map((item) => (
            <li key={item.artworkId + item.variant.type} className="flex justify-between py-3 text-sm">
              <span>
                {item.title}{" "}
                <span className="text-stone-500">
                  ({item.variant.type === "print" ? item.variant.size : "original"}) ×{" "}
                  {item.quantity}
                </span>
              </span>
              <span>${(item.price * item.quantity).toLocaleString()}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 text-base font-medium text-stone-800">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
