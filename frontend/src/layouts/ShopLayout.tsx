import React from "react";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopSidebar } from "@/components/shop/ShopSidebar";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <ShopHeader />
      <ShopSidebar />
      <main className="h-[calc(100vh-4rem)] mt-16 p-4 sm:p-6 sm:ml-64 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
