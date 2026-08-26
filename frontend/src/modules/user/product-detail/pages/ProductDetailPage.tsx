import React from "react";
import ProductImages from "../components/ProductImages";
import Container from "@/components/ui/Container";
import ProductDescription from "../components/ProductDescription";
import ProductAttribute from "../components/ProductAttribute";
import ProductInfo from "../components/ProductInfo";
import { useData } from "../hooks/useData";
import { useSearchParams } from "react-router-dom";
import { ShopProduct } from "@/modules/shop/info/components/ShopProduct";
import type { ShopInfo } from "@/modules/shop/info/types/shop.type";
import ProductReviews from "../components/ProductReviews";
import RelatedProducts from "../components/RelatedProducts";
import type { ProductReviewResponse } from "../types/product-review.type";
import type { ProductCardResponse } from "@/modules/user/products/types/product-card.type";

const mockRelatedProducts: ProductCardResponse[] = [
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
    isFavorite: false
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
    isFavorite: true
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
    isFavorite: false
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
    isFavorite: false
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
    isFavorite: true
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
    isFavorite: false
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
    isFavorite: true
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
    isFavorite: false
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
    isFavorite: true
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
    isFavorite: false
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
    isFavorite: true
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
    isFavorite: false
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
    isFavorite: false
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
    isFavorite: true
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
    isFavorite: false
  }
];

const mockReviewData: ProductReviewResponse = {
  rating: 4.8,
  reviewCount: 120,
  starDetail: [
    { start: 5, count: 100 },
    { start: 4, count: 15 },
    { start: 3, count: 3 },
    { start: 2, count: 1 },
    { start: 1, count: 1 },
  ],
  comments: [
    {
      id: 1,
      fullName: "Nguyễn Văn A",
      star: 5,
      comment: "Sản phẩm tuyệt vời, giao hàng nhanh chóng! Sách được bọc cẩn thận không bị cong mép.",
      createdAt: "2026-08-20T10:00:00Z",
      images: [
        { imageId: 101, urlImage: "https://picsum.photos/id/1015/200/200" },
        { imageId: 102, urlImage: "https://picsum.photos/id/1016/200/200" }
      ],
      reply: {
        id: 1,
        replyComment: "Cảm ơn bạn đã ủng hộ shop ạ! Chúc bạn có những trải nghiệm tuyệt vời với cuốn sách này.",
        fullName: "BÌNH BÁN BOOK",
        avatar: "https://i.pravatar.cc/150?img=12",
        createdAt: "2026-08-20T11:00:00Z"
      }
    },
    {
      id: 2,
      fullName: "Trần Thị B",
      star: 4,
      comment: "Đóng gói cẩn thận, sách đẹp, rất đáng tiền. Tuy nhiên giao hàng hơi lâu một chút.",
      createdAt: "2026-08-19T14:30:00Z",
      images: [
        { imageId: 201, urlImage: "https://picsum.photos/id/1018/200/200" }
      ]
    },
    {
      id: 3,
      fullName: "Lê Minh C",
      star: 5,
      comment: "Chất lượng giấy rất tốt, chữ in rõ nét. Sẽ tiếp tục ủng hộ shop trong tương lai.",
      createdAt: "2026-08-18T09:15:00Z",
      images: []
    },
    {
      id: 4,
      fullName: "Phạm D",
      star: 3,
      comment: "Sách nội dung hay nhưng bìa hơi móp do vận chuyển.",
      createdAt: "2026-08-17T16:45:00Z",
      images: [],
      reply: {
        id: 2,
        replyComment: "Dạ shop rất xin lỗi vì sự cố vận chuyển ạ, mong bạn thông cảm giúp shop nhé.",
        fullName: "BÌNH BÁN BOOK",
        avatar: "https://i.pravatar.cc/150?img=12",
        createdAt: "2026-08-18T08:00:00Z"
      }
    }
  ]
};

const mockShop: ShopInfo = {
  shopId: 1,
  shopSlug: "binh-ban-book",
  shopName: "BÌNH BÁN BOOK",

  urlImage: "https://i.pravatar.cc/150?img=12",
  verify: true,
  rating: 4.9,
  soldCount: 1000,
  reviewCount: 7400,
};
const ProductDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("slug");
  const { productDetail, isLoading } = useData(slug || "");

  if (isLoading)
    return <Container className="max-w-7xl py-6">Đang tải...</Container>;
  if (!productDetail)
    return (
      <Container className="max-w-7xl py-6">Không tìm thấy sản phẩm</Container>
    );

  return (
    <div className="min-h-screen mx-auto w-full py-4">
      <Container className="flex flex-col md:flex-row gap-6">
        {/* Left side: Images (tương đương 4 columns) */}
        <div className="w-full md:w-1/3 md:sticky md:top-24 h-fit flex flex-col gap-6">
          <ProductImages
            coverImages={productDetail.coverImages}
            productName={productDetail.productName}
          />
          <ShopProduct shop={mockShop} />
        </div>

        {/* Right side: Product Information (tương đương 8 columns) */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          {/* Product Info (Title, Price, Add to Cart) */}
          <ProductInfo product={productDetail} />
          <ProductAttribute product={productDetail} />
          <ProductDescription description={productDetail.description} />
        </div>
      </Container>

      <Container>
        <div className="w-full">
          <ProductReviews data={mockReviewData} />
        </div>
      </Container>

      <Container>
        <div className="w-full">
          <RelatedProducts relatedProducts={mockRelatedProducts} />
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailPage;
