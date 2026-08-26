import React, { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  variant?: "dark" | "indigo" | "rose" | "amber" | "slate" | "emerald";
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  variant = "dark",
  className = "",
}) => {
  const variantStyles = {
    dark: "bg-slate-900/95 dark:bg-zinc-800/95 text-white border border-slate-700/60 dark:border-zinc-700 shadow-slate-900/20",
    indigo: "bg-indigo-600 text-white border border-indigo-500/50 shadow-indigo-500/25",
    rose: "bg-rose-600 text-white border border-rose-500/50 shadow-rose-500/25",
    amber: "bg-amber-600 text-white border border-amber-500/50 shadow-amber-500/25",
    slate: "bg-slate-800 text-slate-100 border border-slate-700 shadow-md",
    emerald: "bg-emerald-600 text-white border border-emerald-500/50 shadow-emerald-500/25",
  };

  const positionStyles = {
    top: "bottom-full mb-1.5 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-1.5 left-1/2 -translate-x-1/2",
    left: "right-full mr-1.5 top-1/2 -translate-y-1/2",
    right: "left-full ml-1.5 top-1/2 -translate-y-1/2",
  };

  return (
    <div className={`relative group/tooltip inline-flex items-center ${className}`}>
      {children}
      <div
        className={`absolute z-30 hidden group-hover/tooltip:flex items-center px-2 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap shadow-md pointer-events-none animate-in fade-in duration-150 ${positionStyles[position]} ${variantStyles[variant]}`}
      >
        {content}
      </div>
    </div>
  );
};
