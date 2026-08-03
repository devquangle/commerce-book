import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Clock, ShieldAlert, FileText, PackageCheck } from "lucide-react";
import type { PendingItem } from "../types/dashboard.types";

interface PendingActionCardsProps {
  leftItems: PendingItem[];
  rightItems: PendingItem[];
}

export const PendingActionCards: React.FC<PendingActionCardsProps> = ({
  leftItems,
  rightItems,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left Card */}
      <div className="card-custom flex flex-col justify-between gap-3">
        <div className="flex flex-col divide-y divide-slate-100 dark:divide-zinc-800">
          {leftItems.map((item) => (
            <Link
              key={item.id}
              to={item.path || "#"}
              className="flex items-center justify-between py-3 px-1 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                {item.type === "warning" ? (
                  <Clock className="w-4 h-4 text-amber-500" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                )}
                <span className="body-text text-slate-700 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center justify-center min-w-[2rem] px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    item.type === "warning"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                      : "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300"
                  }`}
                >
                  {item.count}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Right Card */}
      <div className="card-custom flex flex-col justify-between gap-3">
        <div className="flex flex-col divide-y divide-slate-100 dark:divide-zinc-800">
          {rightItems.map((item) => (
            <Link
              key={item.id}
              to={item.path || "#"}
              className="flex items-center justify-between py-3 px-1 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                {item.type === "warning" ? (
                  <FileText className="w-4 h-4 text-amber-500" />
                ) : (
                  <PackageCheck className="w-4 h-4 text-blue-500" />
                )}
                <span className="body-text text-slate-700 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center justify-center min-w-[2rem] px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    item.type === "warning"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300"
                  }`}
                >
                  {item.count}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
