import React from "react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <AdminHeader />
      <AdminSidebar />
      <main className="p-4 sm:ml-64 mt-14">
        {children}
      </main>
    </div>
  );
}