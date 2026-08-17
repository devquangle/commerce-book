import React from 'react';
import { Filter, RotateCcw, ChevronRight } from 'lucide-react';

const FilterSidebar = () => {
  const sections = [
    'THỂ LOẠI',
    'TÁC GIẢ',
    'NHÀ XUẤT BẢN',
    'SERIES',
    'ĐÁNH GIÁ',
    'KHOẢNG GIÁ',
  ];

  return (
    <div className="w-[280px] bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col shrink-0">
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-[17px]">
          <Filter size={20} strokeWidth={2.5} />
          <span>Bộ Lọc Tìm Kiếm</span>
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full bg-slate-50/80 transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex flex-col px-2 py-3">
        {sections.map((section, idx) => (
          <div key={idx} className="flex flex-col">
            <button className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg text-slate-500 font-bold text-xs tracking-wider transition-colors">
              <span>{section}</span>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
            {idx < sections.length - 1 && (
              <div className="mx-3 border-b border-slate-50 my-1"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;
