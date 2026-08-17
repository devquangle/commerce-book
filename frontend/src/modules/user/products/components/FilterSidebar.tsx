import React, { useState } from 'react';
import { Filter, RotateCcw, ChevronRight, ChevronDown, Building, Layers, Star } from 'lucide-react';
import { useSearchProduct } from '../hooks/useSearchProduct';

const FilterSection = ({
  title,
  isOpen,
  onToggle,
  children,
  hideDivider
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  hideDivider?: boolean;
}) => {
  return (
    <div className="flex flex-col">
      <button 
        onClick={onToggle}
        className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg text-slate-500 font-bold text-xs tracking-wider transition-colors"
      >
        <span>{title}</span>
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

const RadioOption = ({
  checked,
  onChange,
  label,
  icon,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
}) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-colors ${checked ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
        {checked && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
      {icon && (
        <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500">
          {icon}
        </div>
      )}
      <div className={`flex-1 text-[13px] ${checked ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>
        {label}
      </div>
      {count !== undefined && (
        <div className="text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
          {count}
        </div>
      )}
    </label>
  );
};

const CheckboxOption = ({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  count?: number;
}) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className={`w-[18px] h-[18px] rounded flex items-center justify-center transition-colors ${checked ? 'bg-blue-500 border-blue-500' : 'border border-slate-300'}`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div className={`flex-1 text-[13px] ${checked ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>
        {label}
      </div>
      {count !== undefined && (
        <div className="text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
          {count}
        </div>
      )}
    </label>
  );
};

const FilterSidebar = () => {
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

  const { genres, authors, publishers, series } = useSearchProduct();

  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<number | null>(null);
  const [selectedPublisher, setSelectedPublisher] = useState<number | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

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
        {/* THỂ LOẠI */}
        <FilterSection 
          title="THỂ LOẠI" 
          isOpen={openSections['THỂ LOẠI']} 
          onToggle={() => toggleSection('THỂ LOẠI')}
        >
          {genres && genres.length > 0 ? (
            genres.map(genre => (
              <CheckboxOption
                key={genre.id}
                checked={selectedGenre === genre.id}
                onChange={() => setSelectedGenre(selectedGenre === genre.id ? null : genre.id)}
                label={genre.name}
                count={genre.bookCount}
              />
            ))
          ) : (
            <div className="text-[13px] text-slate-400 italic">Không có dữ liệu</div>
          )}
        </FilterSection>

        {/* TÁC GIẢ */}
        <FilterSection 
          title="TÁC GIẢ" 
          isOpen={openSections['TÁC GIẢ']} 
          onToggle={() => toggleSection('TÁC GIẢ')}
        >
          {authors && authors.length > 0 ? (
            authors.map(author => (
              <CheckboxOption
                key={author.id}
                checked={selectedAuthor === author.id}
                onChange={() => setSelectedAuthor(selectedAuthor === author.id ? null : author.id)}
                label={author.name}
                count={author.bookCount}
              />
            ))
          ) : (
            <div className="text-[13px] text-slate-400 italic">Không có dữ liệu</div>
          )}
        </FilterSection>

        {/* NHÀ XUẤT BẢN */}
        <FilterSection 
          title="NHÀ XUẤT BẢN" 
          isOpen={openSections['NHÀ XUẤT BẢN']} 
          onToggle={() => toggleSection('NHÀ XUẤT BẢN')}
        >
          <RadioOption 
            checked={selectedPublisher === null}
            onChange={() => setSelectedPublisher(null)}
            label="Tất cả"
            icon={<Building size={16} />}
          />
          {publishers && publishers.length > 0 ? (
            publishers.map(pub => (
              <RadioOption
                key={pub.id}
                checked={selectedPublisher === pub.id}
                onChange={() => setSelectedPublisher(pub.id)}
                label={pub.name}
                count={pub.bookCount}
              />
            ))
          ) : (
            <div className="text-[13px] text-slate-400 italic">Không có dữ liệu</div>
          )}
        </FilterSection>

        {/* SERIES */}
        <FilterSection 
          title="SERIES" 
          isOpen={openSections['SERIES']} 
          onToggle={() => toggleSection('SERIES')}
        >
          <RadioOption 
            checked={selectedSeries === null}
            onChange={() => setSelectedSeries(null)}
            label="Tất cả"
            icon={<Layers size={16} />}
          />
          {series && series.length > 0 ? (
            series.map(s => (
              <RadioOption
                key={s.id}
                checked={selectedSeries === s.id}
                onChange={() => setSelectedSeries(s.id)}
                label={s.name}
                count={s.bookCount}
              />
            ))
          ) : (
            <div className="text-[13px] text-slate-400 italic">Không có dữ liệu</div>
          )}
        </FilterSection>

        {/* ĐÁNH GIÁ */}
        <FilterSection 
          title="ĐÁNH GIÁ" 
          isOpen={openSections['ĐÁNH GIÁ']} 
          onToggle={() => toggleSection('ĐÁNH GIÁ')}
        >
          <RadioOption 
            checked={selectedRating === null}
            onChange={() => setSelectedRating(null)}
            label="Tất cả"
          />
          {[5, 4, 3, 2, 1].map(rating => (
            <RadioOption
              key={rating}
              checked={selectedRating === rating}
              onChange={() => setSelectedRating(rating)}
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
                Dưới 500.000 đ
              </span>
            </div>
            
            <div className="relative h-1.5 bg-slate-100 rounded-full mt-2">
              <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full w-full"></div>
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm cursor-pointer"></div>
            </div>
            
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>0đ</span>
              <span>500.000đ</span>
            </div>
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default FilterSidebar;
