import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const ProductHeader = () => {
  return (
    <div className="card-custom flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Sản phẩm</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Quản lý danh sách sản phẩm của cửa hàng</p>
      </div>
      <Link
        to="/shop/products/create"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
      >
        <Plus className="w-4 h-4" />
        Thêm sản phẩm
      </Link>
    </div>
  );
};
