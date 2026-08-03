import React from "react";
import { Trophy, Award } from "lucide-react";
import type { TopShopItem } from "../types/dashboard.types";

interface TopRevenueShopsProps {
  shops: TopShopItem[];
}

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return (
        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-300 dark:border-amber-700">
          1
        </span>
      );
    case 2:
      return (
        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 font-bold text-xs flex items-center justify-center border border-slate-300 dark:border-zinc-700">
          2
        </span>
      );
    case 3:
      return (
        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 font-bold text-xs flex items-center justify-center border border-orange-300 dark:border-orange-700">
          3
        </span>
      );
    default:
      return (
        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 font-bold text-xs flex items-center justify-center">
          {rank}
        </span>
      );
  }
};

export const TopRevenueShops: React.FC<TopRevenueShopsProps> = ({ shops }) => {
  return (
    <div className="card-custom">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h2 className="heading-2 text-slate-800 dark:text-zinc-100 text-base md:text-lg">
            Top 5 Shop doanh thu cao nhất
          </h2>
        </div>
        <Award className="w-4 h-4 text-amber-500 hidden sm:block" />
      </div>

      <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
        {shops.map((shop) => (
          <div
            key={shop.rank}
            className="flex items-center justify-between py-3 px-2 hover:bg-slate-50 dark:hover:bg-zinc-800/40 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              {getRankBadge(shop.rank)}
              <span className="body-text font-semibold text-slate-800 dark:text-zinc-100">
                {shop.name}
              </span>
            </div>
            {shop.revenue && (
              <span className="caption-text font-medium text-emerald-600 dark:text-emerald-400">
                {shop.revenue}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
