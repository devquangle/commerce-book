import React from "react";
import { SearchX, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = SearchX,
  title = "Không tìm thấy dữ liệu",
  description = "Vui lòng thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.",
  action,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center w-full h-full ${className}`}>
      <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4 border border-zinc-200 dark:border-zinc-700/50">
        <Icon className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{title}</h3>
      {description && <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};
