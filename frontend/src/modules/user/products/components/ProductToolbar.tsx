import React, { useState } from 'react';
import { Flame, Star, Clock, Gift, Filter, Search, X, Check, TrendingUp, TrendingDown } from 'lucide-react';
import { useSearchProductsFilter } from '../hooks/useSearchProductsFilter';
import { SORT_OPTIONS} from '../types/search-product';
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

  if (filterOptions.sort) {
    const sortOption = SORT_OPTIONS.find(s => s.value === filterOptions.sort);
    if (sortOption && sortOption.value !== "") {
      activeFilters.push({ label: sortOption.label, onRemove: () => handleUpdateField('sort', undefined) });
    }
  }

  return (
    <div className="card-custom flex flex-col gap-4 w-full min-w-0">
      {/* 1. Quick Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
        <div className="w-full overflow-x-auto pb-1.5 [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-blue-400 hover:[&::-webkit-scrollbar-thumb]:bg-blue-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full">
          <div className="flex flex-nowrap items-center gap-2.5 w-max">
            <button 
              onClick={onOpenFilter}
              className="lg:hidden flex shrink-0 items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 rounded-full transition-colors text-sm font-bold shadow-sm whitespace-nowrap bg-white text-slate-800"
            >
              <Filter size={16} />
              <span>Bộ lọc</span>
            </button>
            <button 
              onClick={() => handleUpdateField('sort', filterOptions.sort === 'soldCount' ? '' : 'soldCount')}
              className={`flex shrink-0 items-center gap-1.5 px-3.5 py-1.5 border rounded-full transition-colors text-sm font-medium shadow-sm whitespace-nowrap ${
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
              className={`flex shrink-0 items-center gap-1.5 px-3.5 py-1.5 border rounded-full transition-colors text-sm font-medium shadow-sm whitespace-nowrap ${
                filterOptions.rating === 4 
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-700' 
                  : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span>4 sao+</span>
            </button>
            <button 
              onClick={() => handleUpdateField('sort', filterOptions.sort === 'newest' ? '' : 'newest')}
              className={`flex shrink-0 items-center gap-1.5 px-3.5 py-1.5 border rounded-full transition-colors text-sm font-medium shadow-sm whitespace-nowrap ${
                filterOptions.sort === 'newest' 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Clock size={16} className={filterOptions.sort === 'newest' ? "text-blue-500" : "text-blue-400"} />
              <span>Mới nhất</span>
            </button>
            <button 
              onClick={() => handleUpdateField('sort', filterOptions.sort === 'hasPromotion' ? '' : 'hasPromotion')}
              className={`flex shrink-0 items-center gap-1.5 px-3.5 py-1.5 border rounded-full transition-colors text-sm font-medium shadow-sm whitespace-nowrap ${
                filterOptions.sort === 'hasPromotion' 
                  ? 'bg-red-50 border-red-200 text-red-700' 
                  : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Gift size={16} className="text-red-500" />
              <span>Khuyến mãi</span>
            </button>
            <button 
              onClick={() => handleUpdateField('sort', filterOptions.sort === 'priceAsc' ? '' : 'priceAsc')}
              className={`flex shrink-0 items-center gap-1.5 px-3.5 py-1.5 border rounded-full transition-colors text-sm font-medium shadow-sm whitespace-nowrap ${
                filterOptions.sort === 'priceAsc' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <TrendingUp size={16} className="text-emerald-500" />
              <span>Giá thấp - cao</span>
            </button>
            <button 
              onClick={() => handleUpdateField('sort', filterOptions.sort === 'priceDesc' ? '' : 'priceDesc')}
              className={`flex shrink-0 items-center gap-1.5 px-3.5 py-1.5 border rounded-full transition-colors text-sm font-medium shadow-sm whitespace-nowrap ${
                filterOptions.sort === 'priceDesc' 
                  ? 'bg-purple-50 border-purple-200 text-purple-700' 
                  : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <TrendingDown size={16} className="text-purple-500" />
              <span>Giá cao - thấp</span>
            </button>
          </div>
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

      {/* 3. Results count */}
      <div className="border-t border-slate-100 pt-4 mt-1">
        <div className="text-slate-500 text-sm">
          <span className="hidden md:inline">Hiển thị </span>
          <span className="font-bold text-slate-800">{totalElements > 0 ? (filterOptions.page! - 1) * filterOptions.size! + 1 : 0}</span>-<span className="font-bold text-slate-800">{Math.min(filterOptions.page! * filterOptions.size!, totalElements)}</span>
          <span className="hidden md:inline"> trong </span>
          <span className="md:hidden">/</span>
          <span className="font-bold text-slate-800">{totalElements}</span>
          <span className="hidden md:inline"> kết quả</span>
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;
