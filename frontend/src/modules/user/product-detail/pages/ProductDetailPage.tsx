import React from "react";
import ProductImages from "../components/ProductImages";
import Container from "@/components/common/Container";
import ProductDescription from "../components/ProductDescription";
import ProductAttribute from "../components/ProductAttribute";
import ProductInfo from "../components/ProductInfo";
import { useData } from "../hooks/useData";
import { useSearchParams } from "react-router-dom";

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
    <div className="min-h-screen mx-auto w-full space-y-16 py-6">
      <Container className="flex flex-col md:flex-row gap-6">
        {/* Left side: Images (tương đương 4 columns) */}
        <div className="w-full md:w-1/3 md:sticky md:top-24 h-fit flex flex-col gap-4">
          <div className="card-custom">
            <ProductImages
              coverImages={productDetail.coverImages}
              productName={productDetail.productName}
            />
          </div>
        </div>

        {/* Right side: Product Information (tương đương 8 columns) */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          {/* Product Info (Title, Price, Add to Cart) */}
          <ProductInfo product={productDetail} />
          <ProductAttribute product={productDetail} />
          <ProductDescription description={productDetail.description} />
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailPage;
