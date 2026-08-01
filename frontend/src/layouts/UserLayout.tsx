import React from "react";
import { UserHeader } from "@/components/user/UserHeader";
import { UserFooter } from "@/components/user/UserFooter";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <UserHeader />
      
      {/* Main content takes remaining height pushing footer to bottom */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <UserFooter />
    </div>
  );
}
