import { Pagination } from "@/components/common/Pagination";
import { useState } from "react";
import { ProductHeader } from "../components/ProductHeader";
import { ProductFilter } from "../components/ProductFilter";
import { ProductTable } from "../components/ProductTable";
import { ProductMobileCard } from "../components/ProductMobileCard";
import {
  ProductSkeleton,
  ProductMobileSkeleton,
} from "../components/ProductSkeleton";
import { ProductDeleteModal } from "../components/ProductDeleteModal";
import { useProductShopFilter } from "../hooks/useProductShopFilter";
import { useProductShop, useDeleteProductShop } from "../hooks/useProductShop";
import type { ProductResponse } from "../types/product.type";

const ShopProducts = () => {
  const {
    keyword,
    status,
    page,
    size,
    filterParams,
    handleKeywordChange,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    handleResetFilter,
  } = useProductShopFilter();

  const { data, isLoading } = useProductShop(filterParams);
  const deleteProductMutation = useDeleteProductShop();

  const products = data?.items || [];
  const totalElements = data?.totalItems || 0;

  // Trạng thái cho Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductResponse | null>(null);

  const handleDeleteClick = (product: ProductResponse) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const id = productToDelete?.productId || productToDelete?.id;
    if (!id) return;

    deleteProductMutation.mutate(id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-full pb-6">
      <ProductHeader />
      <ProductFilter
        keyword={keyword}
        status={status}
        onKeywordChange={handleKeywordChange}
        onStatusChange={handleStatusChange}
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
          {/* Giao diện Table cho Desktop */}
          <div className="hidden md:block">
            <ProductTable
              products={products}
              page={page}
              pageSize={size}
              totalElements={totalElements}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onDelete={handleDeleteClick}
            />
          </div>

          {/* Giao diện Card cho Mobile/Tablet */}
          <div className="flex flex-col gap-4 md:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product, index) => (
                <ProductMobileCard
                  key={
                    product.id
                      ? `product-mobile-${product.id}-${index}`
                      : index
                  }
                  product={product}
                  onDelete={handleDeleteClick}
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

      {/* Modal xác nhận xóa */}
      <ProductDeleteModal
        isOpen={isDeleteModalOpen}
        item={productToDelete}
        isDeleting={deleteProductMutation.isPending}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ShopProducts;
