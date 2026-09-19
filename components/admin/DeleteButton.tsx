"use client";

export default function DeleteButton({
  action,
  confirmText = "Delete this item?",
}: {
  action: () => Promise<void>;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <button type="submit" className="text-xs text-stone-500 hover:text-red-600">
        Delete
      </button>
    </form>
  );
}
