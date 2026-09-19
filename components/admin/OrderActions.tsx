"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus, cancelOrder, addOrderNote } from "@/actions/orders";

const STATUS_OPTIONS = ["new", "contacted", "confirmed", "fulfilled", "cancelled"];

export default function OrderActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(next: string) {
    setStatus(next);
    startTransition(() => updateOrderStatus(orderId, next));
  }

  function handleAddNote() {
    if (!note.trim()) return;
    startTransition(() => addOrderNote(orderId, note));
    setNote("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-stone-700">Status</label>
        <select
          value={status}
          disabled={isPending || status === "cancelled"}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded border border-stone-300 px-3 py-1.5 text-sm capitalize"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {status !== "cancelled" && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Cancel this order and restore stock?")) {
                setStatus("cancelled");
                startTransition(() => cancelOrder(orderId));
              }
            }}
            className="text-sm text-red-600 hover:underline"
          >
            Cancel &amp; Restore Stock
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add an internal note…"
          className="flex-1 rounded border border-stone-300 px-3 py-1.5 text-sm"
        />
        <button
          type="button"
          onClick={handleAddNote}
          className="rounded bg-stone-900 px-3 py-1.5 text-sm text-white hover:bg-stone-800"
        >
          Add Note
        </button>
      </div>
    </div>
  );
}
