import { requireAdmin } from "@/lib/dal";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The real authorization boundary — proxy.ts is only a UX fast path.
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />
      <div className="flex-1 overflow-x-auto p-8">{children}</div>
    </div>
  );
}
