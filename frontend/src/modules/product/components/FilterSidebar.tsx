import React, { useState, useMemo } from 'react';
import { Filter, RotateCcw, ChevronRight, ChevronDown, Building, Layers, Star, X, Search, LayoutGrid, Users } from 'lucide-react';
import type { SearchProductsFilter } from '../types/search-product';
import { useData } from '../hooks/useData';

interface FilterSidebarProps {
  filterOptions: SearchProductsFilter;
  handleUpdateField: <K extends keyof SearchProductsFilter>(key: K, value: SearchProductsFilter[K]) => void;
  resetFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterSection = ({
  title,
  icon,
  isOpen,
  onToggle,
  children,
  hideDivider
}: {
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  hideDivider?: boolean;
}) => {
  return (
    <div className="flex flex-col">
      <button 
        onClick={onToggle}
        className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg text-slate-700 font-bold text-xs tracking-wider transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-400">{icon}</span>}
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
      </button>
      {isOpen && (
        <div className="px-3 pb-3 flex flex-col gap-3">
          {children}
        </div>
      )}
      {!hideDivider && <div className="mx-3 border-b border-slate-50 my-1"></div>}
    </div>
  );
};

const FilterListSection = <T extends { name: string }>({

  title,
  icon,
  isOpen,
  onToggle,
  data,
  searchable = false,
  renderItem,
  emptyText = "Không có dữ liệu",
  hideDivider,
  children

}: {
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  data: T[];
  searchable?: boolean;
  limit?: number;
  renderItem: (item: T) => React.ReactNode;
  emptyText?: string;
  hideDivider?: boolean;
  children?: React.ReactNode;
}) => {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    return data.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <FilterSection title={title} icon={icon} isOpen={isOpen} onToggle={onToggle} hideDivider={hideDivider}>
      {searchable && data && data.length > 0 && (
        <div className="relative mb-2">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search size={14} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder={`Tìm ${title.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      )}
      
      {children}
      
      {filteredData.length > 0 ? (
        <div className="flex flex-col gap-3 max-h-40 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
          {filteredData.map(renderItem)}
        </div>
      ) : (
        <div className="text-[13px] text-slate-400 italic">{emptyText}</div>
      )}
    </FilterSection>
  );
};

const RadioOption = ({
  checked,
  onChange,
  label,
  icon,

}: {
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  icon?: React.ReactNode;

}) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input type="radio" className="hidden" checked={checked} onChange={onChange} />
      <div className={`w-4.5 h-4.5 shrink-0 rounded-full border flex items-center justify-center transition-colors ${checked ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
        {checked && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
      {icon && (
        <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
          {icon}
        </div>
      )}
      <div className={`flex-1 text-[13px] truncate ${checked ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>
        {label}
      </div>
    </label>
  );
};

const CheckboxOption = ({
  checked,
  onChange,
  label,
  icon,
}: {
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
      <div className={`w-4.5 h-4.5 shrink-0 rounded flex items-center justify-center transition-colors ${checked ? 'bg-blue-500 border-blue-500' : 'border border-slate-300'}`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      {icon && (
        <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
          {icon}
        </div>
      )}
      <div className={`flex-1 text-[13px] truncate ${checked ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>
        {label}
      </div>
    </label>
  );
};

const FilterSidebar = ({ filterOptions, handleUpdateField, resetFilters, isOpen, onClose }: FilterSidebarProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'THỂ LOẠI': true,
    'TÁC GIẢ': true,
    'NHÀ XUẤT BẢN': true,
    'SERIES': true,
    'ĐÁNH GIÁ': true,
    'KHOẢNG GIÁ': true,
  });

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const { genres, authors, publishers, series } = useData();

  const handleToggleArray = (key: 'genres' | 'authors', value: string) => {
    const current = filterOptions[key] || [];
    if (current.includes(value)) {
      handleUpdateField(key, current.filter(item => item !== value));
    } else {
      handleUpdateField(key, [...current, value]);
    }
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={14} 
            className={star <= count ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} 
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity" 
          onClick={onClose} 
        />
      )}
      
      <div className={`
        fixed inset-y-0 left-0 z-50 w-75 bg-white flex flex-col shrink-0 h-full
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:z-0 lg:w-70 lg:rounded-xl lg:shadow-sm lg:border lg:border-slate-100 lg:h-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white z-10 lg:rounded-t-xl shrink-0">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-[17px]">
            <Filter size={20} strokeWidth={2.5} />
            <span>Bộ lọc</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={resetFilters} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full bg-slate-50/80 transition-colors" title="Xóa bộ lọc">
              <RotateCcw size={16} />
            </button>
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600 p-1.5 rounded-full bg-slate-50/80 transition-colors" title="Đóng">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col px-2 py-3">
          {/* THỂ LOẠI */}
          <FilterListSection
            title="THỂ LOẠI"
            icon={<LayoutGrid size={16} />}
            isOpen={openSections['THỂ LOẠI']}
            onToggle={() => toggleSection('THỂ LOẠI')}
            data={genres || []}
            searchable={true}
            renderItem={(genre) => (
              <CheckboxOption
                key={genre.id}
                checked={(filterOptions.genres || []).includes(genre.slug)}
                onChange={() => handleToggleArray('genres', genre.slug)}
                label={genre.name}
                icon={<LayoutGrid size={14} />}
              />
            )}
          />

          {/* TÁC GIẢ */}
          <FilterListSection
            title="TÁC GIẢ"
            icon={<Users size={16} />}
            isOpen={openSections['TÁC GIẢ']}
            onToggle={() => toggleSection('TÁC GIẢ')}
            data={authors || []}
            searchable={true}
            renderItem={(author) => (
              <CheckboxOption
                key={author.id}
                checked={(filterOptions.authors || []).includes(author.slug)}
                onChange={() => handleToggleArray('authors', author.slug)}
                label={author.name}
                icon={<Users size={14} />}
              />
            )}
          />

          {/* NHÀ XUẤT BẢN */}
          <FilterListSection
            title="NHÀ XUẤT BẢN"
            icon={<Building size={16} />}
            isOpen={openSections['NHÀ XUẤT BẢN']}
            onToggle={() => toggleSection('NHÀ XUẤT BẢN')}
            data={publishers || []}
            searchable={true}
            renderItem={(pub) => (
              <RadioOption
                key={pub.id}
                checked={filterOptions.publisher === pub.slug}
                onChange={() => handleUpdateField('publisher', pub.slug)}
                label={pub.name}
                icon={<Building size={14} />}
              />
            )}
          >
            <RadioOption 
              checked={!filterOptions.publisher}
              onChange={() => handleUpdateField('publisher', undefined)}
              label="Tất cả"
              icon={<Building size={16} />}
            />
          </FilterListSection>

          {/* SERIES */}
          <FilterListSection
            title="SERIES"
            icon={<Layers size={16} />}
            isOpen={openSections['SERIES']}
            onToggle={() => toggleSection('SERIES')}
            data={series || []}
            searchable={true}
            renderItem={(s) => (
              <RadioOption
                key={s.id}
                checked={filterOptions.series === s.slug}
                onChange={() => handleUpdateField('series', s.slug)}
                label={s.name}
                icon={<Layers size={14} />}
              />
            )}
          >
            <RadioOption 
              checked={!filterOptions.series}
              onChange={() => handleUpdateField('series', undefined)}
              label="Tất cả"
              icon={<Layers size={16} />}
            />
          </FilterListSection>

          {/* ĐÁNH GIÁ */}
          <FilterSection 
            title="ĐÁNH GIÁ" 
            isOpen={openSections['ĐÁNH GIÁ']} 
            onToggle={() => toggleSection('ĐÁNH GIÁ')}
          >
            <RadioOption 
              checked={!filterOptions.rating}
              onChange={() => handleUpdateField('rating', undefined)}
              label="Tất cả"
            />
            {[5, 4, 3, 2, 1].map(rating => (
              <RadioOption
                key={rating}
                checked={filterOptions.rating === rating}
                onChange={() => handleUpdateField('rating', rating)}
                label={
                  <div className="flex items-center gap-2">
                    {renderStars(rating)}
                    {rating < 5 && <span className="text-slate-500">trở lên</span>}
                  </div>
                }
              />
            ))}
          </FilterSection>

          {/* KHOẢNG GIÁ */}
          <FilterSection 
            title="KHOẢNG GIÁ" 
            isOpen={openSections['KHOẢNG GIÁ']} 
            onToggle={() => toggleSection('KHOẢNG GIÁ')}
            hideDivider
          >
            <div className="flex flex-col gap-4 py-2">
              <div>
                <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                  Dưới {(filterOptions.maxPrice ?? 500000).toLocaleString('vi-VN')} đ
                </span>
              </div>
              
              <div className="relative mt-2">
                <input 
                  type="range" 
                  min="0" 
                  max="500000" 
                  step="10000"
                  value={filterOptions.maxPrice ?? 500000}
                  onChange={(e) => handleUpdateField('maxPrice', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer outline-none 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-sm
                    [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-sm"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 ${((filterOptions.maxPrice ?? 500000) / 500000) * 100}%, #f1f5f9 ${((filterOptions.maxPrice ?? 500000) / 500000) * 100}%)`
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>0đ</span>
                <span>500.000đ</span>
              </div>
            </div>
          </FilterSection>

        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 p-4 border-t border-slate-100 bg-white z-10 rounded-b-xl lg:shadow-none shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button 
              onClick={resetFilters}
              className="flex-1 py-2.5 px-4 text-slate-600 font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm"
            >
              Xóa bộ lọc
            </button>
            <button 
              onClick={onClose}
              className="lg:hidden flex-1 py-2.5 px-4 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm shadow-sm"
            >
              Áp dụng
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default FilterSidebar;
