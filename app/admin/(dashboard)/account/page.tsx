"use client";

import { useActionState } from "react";
import { changePassword } from "@/actions/account";
import SubmitButton from "@/components/ui/SubmitButton";

export default function AdminAccountPage() {
  const [state, action] = useActionState(changePassword, undefined);

  return (
    <div className="max-w-sm">
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-stone-800">
        Account
      </h1>
      <form action={action} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            required
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            required
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state?.success && <p className="text-sm text-green-700">Password updated.</p>}
        <SubmitButton>Change Password</SubmitButton>
      </form>
    </div>
  );
}
