import Link from "next/link";
import { getOrders } from "@/lib/data/orders";
import StatusBadge from "@/components/admin/StatusBadge";

const STATUSES = ["all", "new", "contacted", "confirmed", "fulfilled", "cancelled"];

export default async function AdminOrdersPage({
  searchParams,
}: PageProps<"/admin/orders">) {
  const { status } = await searchParams;
  const activeStatus = typeof status === "string" ? status : "all";
  const orders = await getOrders(activeStatus);

  return (
    <div>
      <h1 className="mb-4 font-[family-name:var(--font-display)] text-2xl text-stone-800">
        Orders
      </h1>
      <div className="mb-6 flex flex-wrap gap-3 text-sm">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`capitalize ${
              activeStatus === s ? "font-medium text-stone-900" : "text-stone-500"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded border border-stone-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-2">Buyer</th>
              <th className="px-4 py-2">Items</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.map((o) => (
              <tr key={o._id}>
                <td className="px-4 py-2">
                  <p>{o.buyer.name}</p>
                  <p className="text-xs text-stone-500">{o.buyer.email}</p>
                </td>
                <td className="px-4 py-2 text-stone-500">{o.items.length} item(s)</td>
                <td className="px-4 py-2">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-2 text-stone-500">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/orders/${o._id}`}
                    className="text-xs text-stone-500 hover:text-stone-900"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-stone-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
