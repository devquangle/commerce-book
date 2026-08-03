import React from "react";
import { Clock, Activity } from "lucide-react";
import type { ActivityItem } from "../types/dashboard.types";

interface RecentActivitiesProps {
  activities: ActivityItem[];
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  return (
    <div className="card-custom">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="heading-2 text-slate-800 dark:text-zinc-100 text-base md:text-lg">
            Hoạt động gần đây
          </h2>
        </div>
        <span className="caption-text flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Mới nhất
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 py-3 px-2 hover:bg-slate-50 dark:hover:bg-zinc-800/40 rounded-lg transition-colors"
          >
            <span className="font-mono text-xs font-semibold text-slate-500 dark:text-zinc-400 min-w-[3.5rem]">
              {item.time}
            </span>
            <span className="text-base select-none">{item.iconSymbol}</span>
            <span className="body-text text-slate-800 dark:text-zinc-200 font-medium">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
