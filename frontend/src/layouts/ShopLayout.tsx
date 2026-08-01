import React from "react";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopSidebar } from "@/components/shop/ShopSidebar";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <ShopHeader />
      <ShopSidebar />
      <main className="p-4 sm:ml-64 mt-14">
        {children}
      </main>
    </div>
  );
}
