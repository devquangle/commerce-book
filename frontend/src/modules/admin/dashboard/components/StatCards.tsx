import React from "react";
import { DollarSign, Store, BookOpen, Flag, TrendingUp } from "lucide-react";
import type { StatMetric } from "../types/dashboard.types";

interface StatCardsProps {
  metrics: StatMetric[];
}

const getMetricIcon = (id: string) => {
  switch (id) {
    case "doanh-thu":
      return <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    case "shop":
      return <Store className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    case "san-pham":
      return <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
    case "bao-cao":
      return <Flag className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    default:
      return <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
  }
};

export const StatCards: React.FC<StatCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item) => (
        <div
          key={item.id}
          className="card-custom transition-all duration-200 hover:shadow-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="caption-text font-medium text-slate-600 dark:text-zinc-400">
              {item.title}
            </span>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800">
              {getMetricIcon(item.id)}
            </div>
          </div>

          <div className="mt-3">
            <div className="heading-2 font-bold text-slate-900 dark:text-white">
              {item.value}
            </div>
            {item.change && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <TrendingUp className="w-3 h-3" />
                  {item.change}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
