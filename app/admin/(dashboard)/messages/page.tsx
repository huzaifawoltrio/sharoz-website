import { getMessages } from "@/lib/data/messages";
import MessageRow from "@/components/admin/MessageRow";

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-stone-800">
        Messages
      </h1>
      <ul className="flex flex-col gap-3">
        {messages.map((m) => (
          <MessageRow key={m._id} message={m} />
        ))}
        {messages.length === 0 && (
          <li className="text-sm text-stone-400">No messages yet.</li>
        )}
      </ul>
    </div>
  );
}
