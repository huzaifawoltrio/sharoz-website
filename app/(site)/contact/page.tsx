"use client";

import { useActionState } from "react";
import { createContactMessage } from "@/actions/contact";
import SubmitButton from "@/components/ui/SubmitButton";

export default function ContactPage() {
  const [state, action] = useActionState(createContactMessage, undefined);

  if (state?.success) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-stone-800">
          Thank you
        </h1>
        <p className="mt-4 text-stone-600">
          Your message has been received. We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-stone-800">
        Get in Touch
      </h1>
      <form action={action} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Name</label>
          <input
            name="name"
            required
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Message</label>
          <textarea
            name="message"
            required
            rows={5}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <SubmitButton>Send Message</SubmitButton>
      </form>
    </div>
  );
}
