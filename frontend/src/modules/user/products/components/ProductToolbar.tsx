import React, { useState } from 'react';
import { Flame, Star, ArrowDown, Gift, Filter, Search } from 'lucide-react';
import { useSearchProductsFilter } from '../hooks/useSearchProductsFilter';
import { SORT_OPTIONS, type SortType } from '../types/search-product';
import { SelectBox } from '../../../../components/common/SelectBox';

const ProductToolbar = ({ onOpenFilter }: { onOpenFilter: () => void }) => {
  const { filterOptions, handleUpdateField } = useSearchProductsFilter();
  const [keywordStr, setKeywordStr] = useState(filterOptions.keyword || '');
  const [prevKeyword, setPrevKeyword] = useState(filterOptions.keyword);

  // Sync state if URL changes externally (without useEffect to avoid cascading renders)
  if (filterOptions.keyword !== prevKeyword) {
    setPrevKeyword(filterOptions.keyword);
    setKeywordStr(filterOptions.keyword || '');
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateField('keyword', keywordStr || undefined);
  };

  return (
    <div className="card-custom p-4 md:p-5 flex flex-col gap-4">
      {/* 1. Quick Filters */}
      <div className="flex items-center gap-3">
        <span className="font-bold text-slate-700 text-sm shrink-0 hidden md:block">Bộ lọc nhanh:</span>
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar w-full max-w-full py-1">
          <button 
            onClick={onOpenFilter}
            className="lg:hidden flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 rounded-full transition-colors text-sm font-bold shadow-sm whitespace-nowrap bg-white text-slate-800"
          >
            <Filter size={16} />
            <span>Bộ lọc</span>
          </button>
          <button 
            onClick={() => handleUpdateField('sort', filterOptions.sort === 'soldCount' ? '' : 'soldCount')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 border rounded-full transition-colors text-sm font-medium shadow-sm whitespace-nowrap ${
              filterOptions.sort === 'soldCount' 
                ? 'bg-orange-50 border-orange-200 text-orange-700' 
                : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Flame size={16} className="text-orange-500 fill-orange-500/20" />
            <span>Bán chạy</span>
          </button>
          <button 
            onClick={() => handleUpdateField('rating', filterOptions.rating === 4 ? undefined : 4)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 border rounded-full transition-colors text-sm font-medium shadow-sm whitespace-nowrap ${
              filterOptions.rating === 4 
                ? 'bg-yellow-50 border-yellow-200 text-yellow-700' 
                : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span>4 sao+</span>
          </button>
          <button 
            onClick={() => handleUpdateField('maxPrice', filterOptions.maxPrice === 100000 ? undefined : 100000)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 border rounded-full transition-colors text-sm font-medium shadow-sm whitespace-nowrap ${
              filterOptions.maxPrice === 100000 
                ? 'bg-orange-50 border-orange-200 text-orange-700' 
                : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <ArrowDown size={16} className="text-orange-400" />
            <span>Giá tốt</span>
          </button>
          <button 
            onClick={() => handleUpdateField('hasPromotion', filterOptions.hasPromotion === 'true' ? undefined : 'true')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 border rounded-full transition-colors text-sm font-medium shadow-sm whitespace-nowrap ${
              filterOptions.hasPromotion === 'true' 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Gift size={16} className="text-red-500" />
            <span>Khuyến mãi</span>
          </button>
        </div>
      </div>

      {/* 2. Search Box (Only on mobile) */}
      <form onSubmit={handleSearchSubmit} className="relative w-full lg:hidden">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input 
          type="text" 
          placeholder="Tìm kiếm sách..."
          value={keywordStr}
          onChange={(e) => setKeywordStr(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
        />
        <button type="submit" className="hidden">Tìm</button>
      </form>

      {/* 3. Results count and Sort Dropdown */}
      <div className="flex items-center justify-between">
        <div className="text-slate-500 text-sm">
          <span className="font-semibold text-slate-800">24</span> sản phẩm
        </div>
        
        <div className="w-45">
          <SelectBox 
            value={filterOptions.sort || ''}
            onChange={(e) => handleUpdateField('sort', e.target.value as SortType)}
            options={SORT_OPTIONS.map(opt => ({
              value: opt.value,
              label: opt.label === "Tất cả" ? "Phổ biến nhất" : opt.label
            }))}
            className="bg-white border-slate-200 text-slate-700 font-medium h-10.5! shadow-sm hover:bg-slate-50/50"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;
