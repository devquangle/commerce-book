interface BadgeProps {
  title: string;
  className?: string;
}

export const Badge = ({ title, className = "" }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 caption-text font-medium ${className}`}
    >
      {title}
    </span>
  );
};
