import { useState } from 'react';

import { Pagination } from '@/components/ui/Pagination';
import { useSearchProductsFilter } from '../../hooks/useSearchProductsFilter';
import { useSearchProducts } from '../../hooks/useSearchProducts';
import FilterSidebar from '../../components/FilterSidebar';

import ProductToolbar from '../../components/ProductToolbar';
import ProductCard from '../../components/ProductCard';
import Container from '@/components/ui/Container';

const SearchProductPage = () => {
  const { filterOptions, handleUpdateField, resetFilters } = useSearchProductsFilter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { data, isLoading, isError, error } = useSearchProducts(filterOptions);
  const products = data?.items || [];
  const totalElements = data?.totalItems || 0;
  return (
    <div className="min-h-screen mx-auto w-full space-y-16 py-4">
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
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <ProductToolbar onOpenFilter={() => setIsFilterOpen(true)} totalElements={totalElements} resetFilters={resetFilters} />

          {/* Data Rendering */}
          {isError ? (
            <div className="bg-[#FFF5F5] border border-red-100 rounded-2xl py-12 px-6 flex items-center justify-center text-red-500 font-medium">
              Đã xảy ra lỗi khi tải dữ liệu. {error?.message}
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-12 text-zinc-500">
               Đang tải sản phẩm...
            </div>
          ) : products.length === 0 ? (
            <div className="flex justify-center items-center py-12 text-zinc-500">
               Không tìm thấy sản phẩm nào phù hợp.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map(product => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
              
              {products.length > 0 && (
                <div className="flex justify-center border-t border-zinc-100 dark:border-zinc-800 pt-6">
                  <Pagination 
                    currentPage={filterOptions.page || 1}
                    totalPages={Math.ceil(totalElements / (filterOptions.size || 20)) || 1}
                    totalElements={totalElements}
                    pageSize={filterOptions.size}
                    onPageChange={(page) => handleUpdateField('page', page)}
                    onPageSizeChange={(size) => handleUpdateField('size', size)}
                    pageSizeOptions={[20, 40, 60, 80]}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default SearchProductPage;