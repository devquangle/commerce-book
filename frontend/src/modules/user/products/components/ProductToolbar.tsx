import React from 'react';
import { Flame, Star, BookOpen, ArrowDown, Gift } from 'lucide-react';

const ProductToolbar = () => {
  return (
    <div className="flex flex-col gap-5">
      {/* Quick Filters */}
      <div className="flex items-center gap-4">
        <span className="font-bold text-slate-700 text-sm">Bộ lọc nhanh:</span>
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-100 rounded-full hover:bg-slate-50 transition-colors text-slate-700 shadow-sm text-sm font-medium">
            <Flame size={16} className="text-orange-500 fill-orange-500/20" />
            <span>Bán chạy</span>
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-100 rounded-full hover:bg-slate-50 transition-colors text-slate-700 shadow-sm text-sm font-medium">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span>4 sao+</span>
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-100 rounded-full hover:bg-slate-50 transition-colors text-slate-700 shadow-sm text-sm font-medium">
            <BookOpen size={16} className="text-emerald-500" />
            <span>Sách mới</span>
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-100 rounded-full hover:bg-slate-50 transition-colors text-slate-700 shadow-sm text-sm font-medium">
            <ArrowDown size={16} className="text-orange-400" />
            <span>Dưới 100k</span>
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-100 rounded-full hover:bg-slate-50 transition-colors text-slate-700 shadow-sm text-sm font-medium">
            <Gift size={16} className="text-red-500" />
            <span>Khuyến mãi</span>
          </button>
        </div>
      </div>

      {/* Main Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="text-slate-500 text-sm">
          Tìm thấy <span className="font-semibold text-slate-800">0</span> sản phẩm
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Sắp xếp:</span>
          <div className="flex items-center gap-1">
            <button className="px-4 py-2 bg-slate-100/80 font-bold text-slate-700 rounded-full text-sm">
              Mới nhất
            </button>
            <button className="px-4 py-2 hover:bg-slate-50 font-semibold text-slate-500 rounded-full transition-colors text-sm">
              Bán chạy
            </button>
            <button className="px-4 py-2 hover:bg-slate-50 font-semibold text-slate-500 rounded-full transition-colors text-sm">
              Giá ↑
            </button>
            <button className="px-4 py-2 hover:bg-slate-50 font-semibold text-slate-500 rounded-full transition-colors text-sm">
              Giá ↓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;
