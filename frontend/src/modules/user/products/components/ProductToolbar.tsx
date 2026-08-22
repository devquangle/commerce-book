import React, { useState } from 'react';
import { Flame, Star, Clock, Gift, Filter, Search, X, Check } from 'lucide-react';
import { useSearchProductsFilter } from '../hooks/useSearchProductsFilter';
import { SORT_OPTIONS, type SortType } from '../types/search-product';
import { SelectBox } from '../../../../components/common/SelectBox';
import { useData } from '../hooks/useData';

interface ProductToolbarProps {
  onOpenFilter: () => void;
  totalElements: number;
  resetFilters: () => void;
}

const ProductToolbar = ({ onOpenFilter, totalElements, resetFilters }: ProductToolbarProps) => {
  const { filterOptions, handleUpdateField } = useSearchProductsFilter();
  const [keywordStr, setKeywordStr] = useState(filterOptions.keyword || '');
  const [prevKeyword, setPrevKeyword] = useState(filterOptions.keyword);
  const { genres, authors, publishers, series } = useData();

  // Sync state if URL changes externally (without useEffect to avoid cascading renders)
  if (filterOptions.keyword !== prevKeyword) {
    setPrevKeyword(filterOptions.keyword);
    setKeywordStr(filterOptions.keyword || '');
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateField('keyword', keywordStr || undefined);
  };

  const activeFilters = [];
  
  if (filterOptions.keyword) {
    activeFilters.push({ label: `Từ khóa: ${filterOptions.keyword}`, onRemove: () => handleUpdateField('keyword', undefined) });
  }

  if (filterOptions.genres && filterOptions.genres.length > 0) {
    filterOptions.genres.forEach(slug => {
      const genre = genres?.find(g => g.slug === slug);
      if (genre) {
        activeFilters.push({ label: genre.name, onRemove: () => handleUpdateField('genres', filterOptions.genres!.filter(g => g !== slug)) });
      }
    });
  }

  if (filterOptions.authors && filterOptions.authors.length > 0) {
    filterOptions.authors.forEach(slug => {
      const author = authors?.find(a => a.slug === slug);
      if (author) {
        activeFilters.push({ label: author.name, onRemove: () => handleUpdateField('authors', filterOptions.authors!.filter(a => a !== slug)) });
      }
    });
  }

  if (filterOptions.publisher) {
    const pub = publishers?.find(p => p.slug === filterOptions.publisher);
    if (pub) {
      activeFilters.push({ label: pub.name, onRemove: () => handleUpdateField('publisher', undefined) });
    }
  }

  if (filterOptions.series) {
    const s = series?.find(s => s.slug === filterOptions.series);
    if (s) {
      activeFilters.push({ label: s.name, onRemove: () => handleUpdateField('series', undefined) });
    }
  }
  
  if (filterOptions.rating) {
    activeFilters.push({ label: `Từ ${filterOptions.rating} sao`, onRemove: () => handleUpdateField('rating', undefined) });
  }

  if (filterOptions.maxPrice && filterOptions.maxPrice < 500000) {
    activeFilters.push({ label: `Dưới ${filterOptions.maxPrice.toLocaleString('vi-VN')} đ`, onRemove: () => handleUpdateField('maxPrice', undefined) });
  }

  return (
    <div className="card-custom flex flex-col gap-4">
      {/* 1. Quick Filters */}
      <div className="flex items-center gap-3 w-full max-w-full overflow-hidden">
        <span className="font-bold text-slate-700 text-sm shrink-0 hidden md:block">Bộ lọc nhanh:</span>
        <div className="flex-1 min-w-0 flex items-center gap-2.5 overflow-x-auto py-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
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
            <Check size={14} className={`transition-opacity ${filterOptions.sort === 'soldCount' ? 'opacity-100 text-orange-500' : 'opacity-0'}`} />
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
            <Check size={14} className={`transition-opacity ${filterOptions.rating === 4 ? 'opacity-100 text-yellow-600' : 'opacity-0'}`} />
          </button>
          <button 
            onClick={() => handleUpdateField('sort', filterOptions.sort === 'newest' ? '' : 'newest')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 border rounded-full transition-colors text-sm font-medium shadow-sm whitespace-nowrap ${
              filterOptions.sort === 'newest' 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Clock size={16} className={filterOptions.sort === 'newest' ? "text-blue-500" : "text-blue-400"} />
            <span>Mới nhất</span>
            <Check size={14} className={`transition-opacity ${filterOptions.sort === 'newest' ? 'opacity-100 text-blue-500' : 'opacity-0'}`} />
          </button>
          <button 
            onClick={() => handleUpdateField('sort', filterOptions.sort === 'hasPromotion' ? '' : 'hasPromotion')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 border rounded-full transition-colors text-sm font-medium shadow-sm whitespace-nowrap ${
              filterOptions.sort === 'hasPromotion' 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Gift size={16} className="text-red-500" />
            <span>Khuyến mãi</span>
            <Check size={14} className={`transition-opacity ${filterOptions.sort === 'hasPromotion' ? 'opacity-100 text-red-500' : 'opacity-0'}`} />
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

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 pb-1">
          {activeFilters.map((filter, index) => (
            <div key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-xs font-medium text-slate-700">
              <span>{filter.label}</span>
              <button 
                onClick={filter.onRemove}
                className="hover:bg-slate-200 p-0.5 rounded-full transition-colors text-slate-500 hover:text-slate-800"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </div>
          ))}
          <button 
            onClick={resetFilters}
            className="text-xs text-blue-600 font-medium hover:text-blue-700 underline underline-offset-2 ml-1"
          >
            Xóa tất cả
          </button>
        </div>
      )}

      {/* 3. Results count and Sort Dropdown */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-1">
        <div className="text-slate-500 text-sm">
          Hiển thị <span className="font-bold text-slate-800">{totalElements > 0 ? (filterOptions.page! - 1) * filterOptions.size! + 1 : 0}</span>–<span className="font-bold text-slate-800">{Math.min(filterOptions.page! * filterOptions.size!, totalElements)}</span> trong <span className="font-bold text-slate-800">{totalElements}</span> kết quả
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
