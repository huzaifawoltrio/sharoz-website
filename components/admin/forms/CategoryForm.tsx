"use client";

import { useActionState, useState } from "react";
import SubmitButton from "@/components/ui/SubmitButton";
import type { ActionState } from "@/lib/action-state";
import type { CategoryType } from "@/lib/models/Category";

type CategoryFormProps = {
  type: CategoryType;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  initialName?: string;
};

export default function CategoryForm({ type, action, initialName = "" }: CategoryFormProps) {
  const [name, setName] = useState(initialName);
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex gap-2">
      <input type="hidden" name="payload" value={JSON.stringify({ type, name })} />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
        className="flex-1 rounded border border-stone-300 px-3 py-1.5 text-sm"
      />
      <SubmitButton className="rounded bg-stone-900 px-3 py-1.5 text-sm text-white hover:bg-stone-800 disabled:opacity-50">
        {initialName ? "Save" : "Add"}
      </SubmitButton>
      {state?.error && <p className="ml-2 self-center text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
