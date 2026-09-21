import React from "react";
import { Store, ShieldCheck } from "lucide-react";

interface StoreHeaderProps {
  totalStores?: number;
  pendingStores?: number;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  totalStores = 0,
  pendingStores = 0,
}) => {
  return (
    <div className="card-custom flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-sm border border-blue-100 dark:border-blue-900/50">
          <Store className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Quản lý cửa hàng
            </h1>
            {pendingStores > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse">
                <ShieldCheck className="w-3.5 h-3.5" />
                {pendingStores} chờ duyệt
              </span>
            )}
          </div>
          <p className="body-text text-zinc-500 dark:text-zinc-400 mt-0.5">
            Kiểm tra hồ sơ định danh eKYC, đối soát tài khoản ngân hàng và kiểm duyệt gian hàng trên sàn.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-300 font-medium">
          Tổng cộng: <span className="font-bold text-zinc-900 dark:text-white">{totalStores}</span> gian hàng
        </div>
      </div>
    </div>
  );
};
