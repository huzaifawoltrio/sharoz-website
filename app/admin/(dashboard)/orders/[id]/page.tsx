import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/data/orders";
import StatusBadge from "@/components/admin/StatusBadge";
import OrderActions from "@/components/admin/OrderActions";

export default async function AdminOrderDetailPage({
  params,
}: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-stone-800">
          Order
        </h1>
        <StatusBadge status={order.status} />
      </div>

      <section className="mb-6 rounded border border-stone-200 p-4">
        <h2 className="mb-2 text-sm font-medium text-stone-700">Buyer</h2>
        <p className="text-sm text-stone-800">{order.buyer.name}</p>
        <p className="text-sm text-stone-600">{order.buyer.email}</p>
        {order.buyer.phone && <p className="text-sm text-stone-600">{order.buyer.phone}</p>}
        {order.buyer.address && <p className="text-sm text-stone-600">{order.buyer.address}</p>}
        {order.buyer.message && (
          <p className="mt-2 text-sm italic text-stone-500">&ldquo;{order.buyer.message}&rdquo;</p>
        )}
      </section>

      <section className="mb-6 rounded border border-stone-200 p-4">
        <h2 className="mb-3 text-sm font-medium text-stone-700">Items</h2>
        <ul className="divide-y divide-stone-100">
          {order.items.map((item, i: number) => (
            <li key={i} className="flex justify-between py-2 text-sm">
              <span>
                {item.artworkTitle}{" "}
                <span className="text-stone-500">
                  ({item.variant.type === "print" ? item.variant.size : "original"}) ×{" "}
                  {item.quantity}
                </span>
              </span>
              <span>${(item.price * item.quantity).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6 rounded border border-stone-200 p-4">
        <h2 className="mb-3 text-sm font-medium text-stone-700">Manage</h2>
        <OrderActions orderId={order._id} currentStatus={order.status} />
      </section>

      {order.notes.length > 0 && (
        <section className="rounded border border-stone-200 p-4">
          <h2 className="mb-3 text-sm font-medium text-stone-700">Notes</h2>
          <ul className="flex flex-col gap-2">
            {order.notes.map((n: { text: string; createdAt: string }, i: number) => (
              <li key={i} className="text-sm text-stone-600">
                <span className="mr-2 text-xs text-stone-400">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
                {n.text}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
