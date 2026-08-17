import React from 'react';
import FilterSidebar from '../components/FilterSidebar';
import ProductToolbar from '../components/ProductToolbar';

const SearchProductsPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-6 flex justify-center font-sans">
      <div className="max-w-[1300px] w-full flex gap-8">
        {/* Left Sidebar */}
        <FilterSidebar />

        {/* Right Content */}
        <div className="flex-1 flex flex-col gap-6">
          <ProductToolbar />

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