import { Pagination } from "@/components/common/Pagination";
import { ProductHeader } from "../components/ProductHeader";
import { ProductFilter } from "../components/ProductFilter";
import { ProductTable } from "../components/ProductTable";
import {
  ProductSkeleton,
  ProductMobileSkeleton,
} from "@/modules/shop/products/components/ProductSkeleton";
import { ProductMobileCard } from "../components/ProductMobileCard";
import type {
  ProductResponse,
  SuperAdminProductResponse,
} from "@/modules/shop/products/types/product.type";
import { useNavigate } from "react-router-dom";

import { useSuperAdminFilter } from "@/modules/shop/products/hooks/useSuperAdminFilter";
import { useSearchProductsForAdmin } from "@/modules/shop/products/hooks/useProduct";

const AdminProductListPage = () => {
  const navigate = useNavigate();
  const {
    keyword,
    status,
    page,
    size,
    shopId,
    filterParams,
    handleKeywordChange,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    handleResetFilter,
    handleShopIdChange,
  } = useSuperAdminFilter();

  const { data, isLoading } = useSearchProductsForAdmin({...filterParams,});

  const products = data?.items || [];
  const totalElements = data?.totalItems || 0;

  const handleView = (product: SuperAdminProductResponse | ProductResponse) => {
    const slug =
      (product as SuperAdminProductResponse).productSlug ||
      (product as ProductResponse).slug;
    navigate(`/admin/products/detail?slug=${slug}`);
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-full pb-6">
      {/* Header không có nút thêm mới */}
      <ProductHeader mode="list" />

      {/* Filter có keyword, status, shop selectbox */}
      <ProductFilter
        keyword={keyword}
        status={status}
        shopId={shopId}
        onKeywordChange={handleKeywordChange}
        onStatusChange={handleStatusChange}
        onShopChange={handleShopIdChange}
        onReset={handleResetFilter}
      />

      {isLoading ? (
        <>
          <div className="hidden md:block">
            <ProductSkeleton />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            <ProductMobileSkeleton />
            <ProductMobileSkeleton />
            <ProductMobileSkeleton />
          </div>
        </>
      ) : (
        <>
          {/* Giao diện Table cho Desktop — modal approve/reject được quản lý bên trong */}
          <div className="hidden md:block">
            <ProductTable
              products={products}
              page={page}
              pageSize={size}
              totalElements={totalElements}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onView={handleView}
            />
          </div>

          {/* Giao diện Card cho Mobile/Tablet */}
          <div className="flex flex-col gap-4 md:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product, index) => (
                <ProductMobileCard
                  key={
                    product.productId
                      ? `product-mobile-${product.productId}-${index}`
                      : index
                  }
                  product={product}
                  onView={handleView}
                />
              ))}
              {products.length === 0 && (
                <div className="col-span-full py-24 text-center text-zinc-500 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  Không tìm thấy sản phẩm nào
                </div>
              )}
            </div>

            {products.length > 0 && (
              <div className="card-custom">
                <Pagination
                  currentPage={page}
                  totalPages={Math.ceil(totalElements / size) || 1}
                  totalElements={totalElements}
                  pageSize={size}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProductListPage;