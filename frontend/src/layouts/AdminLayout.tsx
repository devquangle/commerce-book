import React from "react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <AdminHeader />
      <AdminSidebar />
      <main className="h-[calc(100vh-3.5rem)] mt-14 p-4 sm:p-6 sm:ml-64 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}