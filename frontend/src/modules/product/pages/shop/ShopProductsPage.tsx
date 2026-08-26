import ProductFlashSale from "@/components/product/ProductFlashSale";
import ShopBanner from "@/components/shop/ShopBanner";
import type { ShopInfo } from "@/modules/shop/types/shop.type";
import type { ProductCardResponse } from "../../types/product-card.type";
import FilterSidebar from "@/components/product/FilterSidebar";
import ProductToolbar from "@/components/product/ProductToolbar";
import { useSearchProductsFilter } from "../../hooks/useSearchProductsFilter";
import { useState } from "react";
import { useSearchProducts } from "../../hooks/useSearchProducts";
import ProductCard from "@/components/product/ProductCard";
import { Pagination } from "@/components/ui/Pagination";

// Dữ liệu mẫu (mock data) theo đúng thiết kế UI
const mockShopInfo: ShopInfo = {
  shopId: 1,
  shopName: "Nhà Sách Phương Nam",
  shopSlug: "nha-sach-phuong-nam",
  logo: "",
  banner: [
    "https://placehold.co/1200x300/2563eb/white?text=Banner+1",
    "https://placehold.co/1200x300/4f46e5/white?text=Banner+2",
    "https://placehold.co/1200x300/7c3aed/white?text=Banner+3",
  ],
  isVerified: true,
  streetFull: "TP. Hồ Chí Minh",
  description:
    "Nhà sách Phương Nam là hệ thống nhà sách uy tín hàng đầu Việt Nam, cung cấp đa dạng sách trong nước và quốc tế với chất lượng đảm bảo và dịch vụ chuyên nghiệp.",
  stats: {
    rating: 4.8,
    reviewCount: 7500,
    soldCount: 1500,
    joinedYear: "2018",
  },
  hotline: "1900 6656",
};
const mockFlashSaleProducts: ProductCardResponse[] = [
  {
    productId: 101,
    productName: "Sách Đắc Nhân Tâm (Tái Bản)",
    productSlug: "dac-nhan-tam",
    discountPercent: 15,
    price: 120000,
    salePrice: 102000,
    averageRating: 4.9,
    soldCount: 500,
    urlImageDefault: "https://picsum.photos/id/1015/300/400",
    shopId: 1,
    shopName: "BÌNH BÁN BOOK",
    shopSlug: "binh-ban-book",
    isFavorite: false,
  },
  {
    productId: 102,
    productName: "Nhà Giả Kim",
    productSlug: "nha-gia-kim",
    discountPercent: 10,
    price: 90000,
    salePrice: 81000,
    averageRating: 4.8,
    soldCount: 1200,
    urlImageDefault: "https://picsum.photos/id/1016/300/400",
    shopId: 1,
    shopName: "BÌNH BÁN BOOK",
    shopSlug: "binh-ban-book",
    isFavorite: true,
  },
  {
    productId: 103,
    productName: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
    productSlug: "tuoi-tre-dang-gia-bao-nhieu",
    discountPercent: 20,
    price: 150000,
    salePrice: 120000,
    averageRating: 4.7,
    soldCount: 800,
    urlImageDefault: "https://picsum.photos/id/1018/300/400",
    shopId: 1,
    shopName: "BÌNH BÁN BOOK",
    shopSlug: "binh-ban-book",
    isFavorite: false,
  },
  {
    productId: 104,
    productName: "Tâm Lý Học Tội Phạm",
    productSlug: "tam-ly-hoc-toi-pham",
    discountPercent: 5,
    price: 180000,
    salePrice: 171000,
    averageRating: 4.6,
    soldCount: 300,
    urlImageDefault: "https://picsum.photos/id/1019/300/400",
    shopId: 1,
    shopName: "BÌNH BÁN BOOK",
    shopSlug: "binh-ban-book",
    isFavorite: false,
  },
  {
    productId: 105,
    productName: "Suy Nghĩ Nhanh Và Chậm",
    productSlug: "suy-nghi-nhanh-va-cham",
    discountPercent: 25,
    price: 250000,
    salePrice: 187500,
    averageRating: 4.9,
    soldCount: 1500,
    urlImageDefault: "https://picsum.photos/id/1020/300/400",
    shopId: 1,
    shopName: "BÌNH BÁN BOOK",
    shopSlug: "binh-ban-book",
    isFavorite: true,
  },
  {
    productId: 106,
    productName: "Lược Sử Loài Người",
    productSlug: "luoc-su-loai-nguoi",
    discountPercent: 12,
    price: 200000,
    salePrice: 176000,
    averageRating: 4.8,
    soldCount: 950,
    urlImageDefault: "https://picsum.photos/id/1021/300/400",
    shopId: 1,
    shopName: "BÌNH BÁN BOOK",
    shopSlug: "binh-ban-book",
    isFavorite: false,
  },
  {
    productId: 107,
    productName: "Muôn Kiếp Nhân Sinh",
    productSlug: "muon-kiep-nhan-sinh",
    discountPercent: 20,
    price: 168000,
    salePrice: 134400,
    averageRating: 4.9,
    soldCount: 2000,
    urlImageDefault: "https://picsum.photos/id/1022/300/400",
    shopId: 1,
    shopName: "BÌNH BÁN BOOK",
    shopSlug: "binh-ban-book",
    isFavorite: true,
  },
  {
    productId: 108,
    productName: "Sapiens",
    productSlug: "sapiens",
    discountPercent: 10,
    price: 210000,
    salePrice: 189000,
    averageRating: 4.7,
    soldCount: 850,
    urlImageDefault: "https://picsum.photos/id/1023/300/400",
    shopId: 1,
    shopName: "BÌNH BÁN BOOK",
    shopSlug: "binh-ban-book",
    isFavorite: false,
  },
  {
    productId: 109,
    productName: "Hiểu Về Trái Tim",
    productSlug: "hieu-ve-trai-tim",
    discountPercent: 30,
    price: 135000,
    salePrice: 94500,
    averageRating: 4.8,
    soldCount: 3400,
    urlImageDefault: "https://picsum.photos/id/1024/300/400",
    shopId: 1,
    shopName: "BÌNH BÁN BOOK",
    shopSlug: "binh-ban-book",
    isFavorite: true,
  },
  {
    productId: 110,
    productName: "Lối Sống Tối Giản",
    productSlug: "loi-song-toi-gian",
    discountPercent: 0,
    price: 85000,
    salePrice: 85000,
    averageRating: 4.6,
    soldCount: 420,
    urlImageDefault: "https://picsum.photos/id/1025/300/400",
    shopId: 1,
    shopName: "BÌNH BÁN BOOK",
    shopSlug: "binh-ban-book",
    isFavorite: false,
  },
  {
    productId: 111,
    productName: "Nghệ Thuật Tinh Tế Của Việc Đếch Quan Tâm",
    productSlug: "nghe-thuat-tinh-te",
    discountPercent: 15,
    price: 150000,
    salePrice: 127500,
    averageRating: 4.8,
    soldCount: 600,
    urlImageDefault: "https://picsum.photos/id/1026/300/400",
    shopId: 1,
    shopName: "BÌNH BÁN BOOK",
    shopSlug: "binh-ban-book",
    isFavorite: true,
  },
  {
    productId: 112,
    productName: "Thói Quen Nguyên Tử",
    productSlug: "thoi-quen-nguyen-tu",
    discountPercent: 10,
    price: 180000,
    salePrice: 162000,
    averageRating: 4.9,
    soldCount: 1100,
    urlImageDefault: "https://picsum.photos/id/1027/300/400",
    shopId: 1,
    shopName: "BÌNH BÁN BOOK",
    shopSlug: "binh-ban-book",
    isFavorite: false,
  },
  {
    productId: 113,
    productName: "Tội Ác Và Hình Phạt",
    productSlug: "toi-ac-va-hinh-phat",
    discountPercent: 20,
    price: 220000,
    salePrice: 176000,
    averageRating: 4.7,
    soldCount: 400,
    urlImageDefault: "https://picsum.photos/id/1028/300/400",
    shopId: 1,
    shopName: "BÌNH BÁN BOOK",
    shopSlug: "binh-ban-book",
    isFavorite: false,
  },
  {
    productId: 114,
    productName: "Bắt Trẻ Đồng Xanh",
    productSlug: "bat-tre-dong-xanh",
    discountPercent: 5,
    price: 120000,
    salePrice: 114000,
    averageRating: 4.5,
    soldCount: 300,
    urlImageDefault: "https://picsum.photos/id/1029/300/400",
    shopId: 1,
    shopName: "BÌNH BÁN BOOK",
    shopSlug: "binh-ban-book",
    isFavorite: true,
  },
  {
    productId: 115,
    productName: "Giết Con Chim Nhại",
    productSlug: "giet-con-chim-nhai",
    discountPercent: 25,
    price: 160000,
    salePrice: 120000,
    averageRating: 4.9,
    soldCount: 2500,
    urlImageDefault: "https://picsum.photos/id/1031/300/400",
    shopId: 1,
    shopName: "BÌNH BÁN BOOK",
    shopSlug: "binh-ban-book",
    isFavorite: false,
  },
];
const ShopProductsPage = () => {
  const { filterOptions, handleUpdateField, resetFilters } =
    useSearchProductsFilter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, isLoading, isError, error } = useSearchProducts(filterOptions);
  const products = data?.items || [];
  const totalElements = data?.totalItems || 0;
  return (
    <div className="min-h-screen my-4 px-2">
      <ShopBanner shopInfo={mockShopInfo} />

      {/* Phần dành cho Flash sale */}
      <ProductFlashSale products={mockFlashSaleProducts} />
      {/* Phần dành cho danh sách sản phẩm */}
      <div className="flex flex-col lg:flex-row gap-6 my-4">
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
          <ProductToolbar
            onOpenFilter={() => setIsFilterOpen(true)}
            totalElements={totalElements}
            resetFilters={resetFilters}
          />

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
                {products.map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    hideShop
                  />
                ))}
              </div>

              {products.length > 0 && (
                <div className="flex justify-center border-t border-zinc-100 dark:border-zinc-800 pt-6">
                  <Pagination
                    currentPage={filterOptions.page || 1}
                    totalPages={
                      Math.ceil(totalElements / (filterOptions.size || 20)) || 1
                    }
                    totalElements={totalElements}
                    pageSize={filterOptions.size}
                    onPageChange={(page) => handleUpdateField("page", page)}
                    onPageSizeChange={(size) => handleUpdateField("size", size)}
                    pageSizeOptions={[20, 40, 60, 80]}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      </div> */}
    </div>
  );
};

export default ShopProductsPage;
