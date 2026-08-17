import React, { useState } from 'react';
import FilterSidebar from '../components/FilterSidebar';
import ProductToolbar from '../components/ProductToolbar';
import { useSearchProductsFilter } from '../hooks/useSearchProductsFilter';
import Container from '@/components/common/Container';

const SearchProductsPage = () => {
  const { filterOptions, handleUpdateField, resetFilters } = useSearchProductsFilter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="min-h-screen mx-auto w-full space-y-16 py-6">
      <Container className="flex flex-col lg:flex-row gap-6">
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
      </Container>
    </div>
  );
};

export default SearchProductsPage;