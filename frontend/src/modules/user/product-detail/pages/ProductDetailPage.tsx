import React from "react";
import ProductImages from "../components/ProductImages";
import Container from "@/components/common/Container";
import ProductDescription from "../components/ProductDescription";
import ProductAttribute from "../components/ProductAttribute";
import ProductInfo from "../components/ProductInfo";
import { useData } from "../hooks/useData";
import { useSearchParams } from "react-router-dom";
import { ShopProduct } from "@/modules/shop/info/components/ShopProduct";
import type { ShopInfo } from "@/modules/shop/info/types/shop.type";
import ProductReviews from "../components/ProductReviews";
import type { ProductReviewResponse } from "../types/product-review.type";

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
    </div>
  );
};

export default ProductDetailPage;
