import React, { useState } from 'react';
import FilterSidebar from '../components/FilterSidebar';
import ProductToolbar from '../components/ProductToolbar';
import { useSearchProductsFilter } from '../hooks/useSearchProductsFilter';

const SearchProductsPage = () => {
  const { filterOptions, handleUpdateField, resetFilters } = useSearchProductsFilter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-4 px-4 md:py-8 md:px-6 flex justify-center font-sans">
      <div className="max-w-[1300px] w-full flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Sidebar */}
        <FilterSidebar 
          filterOptions={filterOptions} 
          handleUpdateField={handleUpdateField} 
          resetFilters={resetFilters} 
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />

        {/* Right Content */}
        <div className="flex-1 flex flex-col gap-6">
          <ProductToolbar onOpenFilter={() => setIsFilterOpen(true)} />

          {/* Error Message Box */}
          <div className="bg-[#FFF5F5] border border-red-100 rounded-2xl py-12 px-6 flex items-center justify-center text-red-500 font-medium">
            Network Error. Hiển thị dữ liệu mẫu.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProductsPage;