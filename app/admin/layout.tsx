import { redirect } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

import { requireRole } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole([
    "OWNER",
    "CO-OWNER",
    "MANAGER",
    "ADMIN",
    "SUPPORT",
  ]);

  // Support users only have access to the support panel
  if (user.role === "SUPPORT") {
    redirect("/admin/support");
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">

      {/* Desktop + Mobile Sidebar */}
      <AdminSidebar role={user.role} />

      {/* Top Navigation */}
      <AdminTopbar />

      {/* Content */}
      <main className="md:ml-72 pt-20">
        {children}
      </main>

    </div>
  );
}