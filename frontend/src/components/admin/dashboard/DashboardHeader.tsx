import React from "react";
import { Calendar, UserCheck } from "lucide-react";

interface DashboardHeaderProps {
  dateText?: string;
  adminName?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  dateText = "03/08/2026",
  adminName = "Super Admin",
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
      <div>
        <h1 className="heading-1 text-slate-900 dark:text-white">Dashboard</h1>
        <div className="flex items-center gap-2 mt-1 caption-text text-slate-500 dark:text-zinc-400">
          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Hôm nay: <strong className="font-semibold text-slate-700 dark:text-zinc-200">{dateText}</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-2 card-custom py-2 px-4 shadow-xs self-start sm:self-auto">
        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <UserCheck className="w-4 h-4" />
        </div>
        <div className="body-text">
          <span className="text-slate-500 dark:text-zinc-400">Xin chào, </span>
          <span className="font-bold text-slate-800 dark:text-zinc-100">{adminName}</span>
        </div>
      </div>
    </div>
  );
};
