import React, { useEffect } from "react";


import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopSidebar } from "@/components/shop/ShopSidebar";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <ShopHeader />
      <ShopSidebar />
      <main className="flex-1 mt-16 sm:ml-64 overflow-y-auto">
        <div className="p-4 sm:p-6 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
