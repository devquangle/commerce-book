import { useState, useEffect } from "react";
import { ProductHeader } from "../components/ProductHeader";
import { ProductFilter } from "../components/ProductFilter";
import { ProductTable } from "../components/ProductTable";
import { ProductMobileCard } from "../components/ProductMobileCard";
import {
  ProductSkeleton,
  ProductMobileSkeleton,
} from "../components/ProductSkeleton";
import { ProductDeleteModal } from "../components/ProductDeleteModal";
import type { ProductResponse } from "../types/shop-product.type";

// Dữ liệu mẫu (Mock data)
const MOCK_PRODUCTS: ProductResponse[] = [
  {
    id: 1,
    name: "Nhà Giả Kim",
    slug: "nha-gia-kim",
    originalPrice: 80000,
    price: 65000,
    quantity: 50,
    weight: 200,
    publishYear: "2020",
    pages: 227,
    language: "Tiếng Việt",
    genresName: ["Tiểu thuyết", "Tâm lý học"],
    authorsName: ["Paulo Coelho"],
    publisherName: "NXB Hội Nhà Văn",
    seriesName: "",
    status: "ACTIVE",
    urlImageDefault: "https://picsum.photos/200?random=1",
  },
  {
    id: 2,
    name: "Đắc Nhân Tâm",
    slug: "dac-nhan-tam",
    originalPrice: 90000,
    price: 75000,
    quantity: 30,
    weight: 250,
    publishYear: "2019",
    pages: 320,
    language: "Tiếng Việt",
    genresName: ["Kỹ năng sống", "Tâm lý"],
    authorsName: ["Dale Carnegie"],
    publisherName: "NXB Tổng hợp TP.HCM",
    seriesName: "",
    status: "ACTIVE",
    urlImageDefault: "https://picsum.photos/200?random=2",
  },
  {
    id: 3,
    name: "Dune - Xứ Cát",
    slug: "dune-xu-cat",
    originalPrice: 150000,
    price: 135000,
    quantity: 0,
    weight: 500,
    publishYear: "2021",
    pages: 600,
    language: "Tiếng Việt",
    genresName: ["Khoa học viễn tưởng"],
    authorsName: ["Frank Herbert"],
    publisherName: "NXB Hội Nhà Văn",
    seriesName: "Dune",
    status: "INACTIVE",
    urlImageDefault: "https://picsum.photos/200?random=3",
  },
  {
    id: 4,
    name: "Clean Code",
    slug: "clean-code",
    originalPrice: 250000,
    price: 250000,
    quantity: 15,
    weight: 600,
    publishYear: "2008",
    pages: 464,
    language: "English",
    genresName: ["Lập trình", "Sách giáo khoa"],
    authorsName: ["Robert C. Martin"],
    publisherName: "Prentice Hall",
    seriesName: "",
    status: "ACTIVE",
    urlImageDefault: "https://picsum.photos/200?random=4",
  },
  {
    id: 5,
    name: "Design Patterns",
    slug: "design-patterns",
    originalPrice: 300000,
    price: 280000,
    quantity: 10,
    weight: 700,
    publishYear: "1994",
    pages: 395,
    language: "English",
    genresName: ["Lập trình"],
    authorsName: ["Erich Gamma"],
    publisherName: "Addison-Wesley",
    seriesName: "",
    status: "ACTIVE",
    urlImageDefault: "https://picsum.photos/200?random=5",
  },
  {
    id: 6,
    name: "Sapiens: Lược Sử Loài Người",
    slug: "sapiens",
    originalPrice: 200000,
    price: 180000,
    quantity: 25,
    weight: 450,
    publishYear: "2014",
    pages: 443,
    language: "Tiếng Việt",
    genresName: ["Lịch sử", "Khoa học"],
    authorsName: ["Yuval Noah Harari"],
    publisherName: "NXB Tri Thức",
    seriesName: "",
    status: "ACTIVE",
    urlImageDefault: "https://picsum.photos/200?random=6",
  },
  {
    id: 7,
    name: "Tư Duy Nhanh Và Chậm",
    slug: "tu-duy-nhanh-va-cham",
    originalPrice: 180000,
    price: 155000,
    quantity: 40,
    weight: 350,
    publishYear: "2011",
    pages: 499,
    language: "Tiếng Việt",
    genresName: ["Tâm lý học"],
    authorsName: ["Daniel Kahneman"],
    publisherName: "NXB Thế Giới",
    seriesName: "",
    status: "ACTIVE",
    urlImageDefault: "https://picsum.photos/200?random=7",
  },
  {
    id: 8,
    name: "Harry Potter và Hòn Đá Phù Thủy",
    slug: "harry-potter-1",
    originalPrice: 120000,
    price: 110000,
    quantity: 100,
    weight: 300,
    publishYear: "1997",
    pages: 223,
    language: "Tiếng Việt",
    genresName: ["Tiểu thuyết", "Kỳ ảo"],
    authorsName: ["J.K. Rowling"],
    publisherName: "NXB Trẻ",
    seriesName: "Harry Potter",
    status: "ACTIVE",
    urlImageDefault: "https://picsum.photos/200?random=8",
  },
  {
    id: 9,
    name: "Cuốn Theo Chiều Gió",
    slug: "cuon-theo-chieu-gio",
    originalPrice: 220000,
    price: 195000,
    quantity: 5,
    weight: 650,
    publishYear: "1936",
    pages: 1037,
    language: "Tiếng Việt",
    genresName: ["Tiểu thuyết", "Lãng mạn"],
    authorsName: ["Margaret Mitchell"],
    publisherName: "NXB Văn Học",
    seriesName: "",
    status: "INACTIVE",
    urlImageDefault: "https://picsum.photos/200?random=9",
  },
  {
    id: 10,
    name: "Code Dạo Ký Sự",
    slug: "code-dao-ky-su",
    originalPrice: 110000,
    price: 99000,
    quantity: 80,
    weight: 250,
    publishYear: "2018",
    pages: 300,
    language: "Tiếng Việt",
    genresName: ["Lập trình", "Tản văn"],
    authorsName: ["Phạm Huy Hoàng"],
    publisherName: "NXB Thanh Niên",
    seriesName: "",
    status: "ACTIVE",
    urlImageDefault: "https://picsum.photos/200?random=10",
  },
];

import { useProductShopFilter } from "../hooks/useProductShopFilter";

const ShopProducts = () => {
  const {
    keyword,
    status,
    page,
    filterParams,
    setPage,
    handleKeywordChange,
    handleStatusChange,
    handleResetFilter,
  } = useProductShopFilter();

  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductResponse[]>([]);

  // Trạng thái cho Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePageChange = (newPage: number) => {
    setIsLoading(true);
    setPage(newPage);
  };

  // Mô phỏng gọi API (Simulate API fetch)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Giả lập lọc danh sách
      let filtered = MOCK_PRODUCTS;
      if (filterParams.keyword) {
        filtered = filtered.filter((p) => p.name.toLowerCase().includes(filterParams.keyword!.toLowerCase()));
      }
      if (filterParams.status) {
        filtered = filtered.filter((p) => p.status === filterParams.status);
      }
      setProducts(filtered);
      setIsLoading(false);
    }, 1000); // Delay 1s để hiển thị skeleton

    return () => clearTimeout(timer);
  }, [filterParams.keyword, filterParams.status, filterParams.page, filterParams.size]);

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete === null) return;

    setIsDeleting(true);
    // Mô phỏng gọi API xóa (Simulate delete API call)
    setTimeout(() => {
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete));
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }, 800);
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
              currentPage={page}
              totalPages={5}
              totalElements={45}
              onPageChange={handlePageChange}
              onDelete={handleDeleteClick}
            />
          </div>

          {/* Giao diện Card cho Mobile/Tablet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {products.map((product) => (
              <ProductMobileCard
                key={product.id}
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
        </>
      )}

      {/* Modal xác nhận xóa */}
      <ProductDeleteModal
        isOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ShopProducts;
