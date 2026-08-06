import { Pagination } from "@/components/common/Pagination";
import { useState } from "react";
import { ProductHeader } from "../components/ProductHeader";
import { ProductFilter } from "../components/ProductFilter";
import { ProductTable } from "../components/ProductTable";
import {
  ProductSkeleton,
  ProductMobileSkeleton,
} from "@/modules/shop/products/components/ProductSkeleton";
import { ProductMobileCard } from "../components/ProductMobileCard";
import { ProductApproveModal } from "../components/ProductApproveModal";
import { ProductRejectModal } from "../components/ProductRejectModal";
import { useProductShopFilter } from "@/modules/shop/products/hooks/useProductShopFilter";
import type { ProductResponse } from "@/modules/shop/products/types/product.type";
import { useNavigate } from "react-router-dom";
import { useProductShop } from "@/modules/shop/products/hooks/useProduct";

const AdminProductListPage = () => {
  const navigate = useNavigate();
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

  const [shopSlug, setShopSlug] = useState<string>("");

  const { data, isLoading } = useProductShop({
    ...filterParams,
  });

  const products = data?.items || [];
  const totalElements = data?.totalItems || 0;

  // State cho Approve Modal & Reject Modal
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);

  const handleApproveClick = (product: ProductResponse) => {
    setSelectedProduct(product);
    setIsApproveModalOpen(true);
  };

  const handleRejectClick = (product: ProductResponse) => {
    setSelectedProduct(product);
    setIsRejectModalOpen(true);
  };

  const handleConfirmApprove = () => {
    if (!selectedProduct) return;
    // TODO: Call API approve product here when backend hook is integrated
    setTimeout(() => {
      setIsApproveModalOpen(false);
      setSelectedProduct(null);
    }, 500);
  };

  const handleConfirmReject = (reason: string) => {
    if (!selectedProduct) return;
    // TODO: Call API reject product with reason here when backend hook is integrated
    console.log("Rejecting product:", selectedProduct.productId, "Reason:", reason);
    setTimeout(() => {
      setIsRejectModalOpen(false);
      setSelectedProduct(null);
    }, 500);
  };

  const handleView = (product: ProductResponse) => {
    navigate(`/admin/products/detail?slug=${product.slug}`);
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-full pb-6">
      {/* Header không có nút thêm mới */}
      <ProductHeader mode="list" />

      {/* Filter có keyword, status, shop selectbox */}
      <ProductFilter
        keyword={keyword}
        status={status}
        shopSlug={shopSlug}
        onKeywordChange={handleKeywordChange}
        onStatusChange={handleStatusChange}
        onShopChange={(slug) => setShopSlug(slug)}
        onReset={() => {
          handleResetFilter();
          setShopSlug("");
        }}
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
              onView={handleView}
              onApprove={handleApproveClick}
              onReject={handleRejectClick}
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
                  onApprove={handleApproveClick}
                  onReject={handleRejectClick}
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

      {/* Modal Phê duyệt sản phẩm */}
      <ProductApproveModal
        isOpen={isApproveModalOpen}
        item={selectedProduct}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={handleConfirmApprove}
      />

      {/* Modal Từ chối sản phẩm với gợi ý lý do */}
      <ProductRejectModal
        isOpen={isRejectModalOpen}
        item={selectedProduct}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
};

export default AdminProductListPage;