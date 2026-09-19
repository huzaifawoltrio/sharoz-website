"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import SubmitButton from "@/components/ui/SubmitButton";

export default function AdminLoginPage() {
  const [state, action] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-stone-800">
          Admin Login
        </h1>
        <form action={action} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Email</label>
            <input
              type="email"
              name="email"
              required
              autoComplete="username"
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Password</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
            />
          </div>
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <SubmitButton className="mt-2 w-full rounded bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50">
            Sign In
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
