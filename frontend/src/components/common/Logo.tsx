import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
        <BookOpen className="w-5 h-5" />
      </div>
      <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
        BookShop
      </span>
    </Link>
  );
};
