const statusColorMap: Record<string, string> = {
  success:
    "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
  secondary:
    "bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700",
  warning:
    "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
  danger:
    "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20",
  dark: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700",
};

interface BadgeProps {
  title: string;
  variant?: keyof typeof statusColorMap | string;
  className?: string;
}

export const Badge = ({ title, variant, className = "" }: BadgeProps) => {
  const variantClass = variant
    ? statusColorMap[variant] || statusColorMap.secondary
    : "";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 caption-text font-medium ${variantClass} ${className}`.trim()}
    >
      {title}
    </span>
  );
};
