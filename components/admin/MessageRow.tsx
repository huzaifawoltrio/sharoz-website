"use client";

import { useTransition } from "react";
import { markMessageRead, deleteMessage } from "@/actions/contact";

type Message = {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function MessageRow({ message }: { message: Message }) {
  const [isPending, startTransition] = useTransition();

  return (
    <li
      className={`rounded border p-4 ${
        message.read ? "border-stone-200" : "border-stone-400 bg-stone-50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-800">{message.name}</p>
          <p className="text-xs text-stone-500">{message.email}</p>
          <p className="mt-2 text-sm text-stone-700">{message.message}</p>
          <p className="mt-2 text-xs text-stone-400">
            {new Date(message.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-col gap-2 text-xs">
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => markMessageRead(message._id, !message.read))}
            className="text-stone-500 hover:text-stone-900"
          >
            Mark {message.read ? "unread" : "read"}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (confirm("Delete this message?")) {
                startTransition(() => deleteMessage(message._id));
              }
            }}
            className="text-stone-500 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
