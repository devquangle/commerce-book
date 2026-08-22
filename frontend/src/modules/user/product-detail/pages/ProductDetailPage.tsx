import React from "react";
import ProductImages from "../components/ProductImages";
import Container from "@/components/common/Container";
import ProductDescription from "../components/ProductDescription";
import ProductAttribute from "../components/ProductAttribute";
import ProductInfo from "../components/ProductInfo";
import { useData } from "../hooks/useData";
import { useParams, useSearchParams } from "react-router-dom";

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
    <Container className="max-w-7xl py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left side: Images (4 columns) */}
        <div className="md:col-span-4 md:sticky md:top-24 h-fit flex flex-col gap-4">
          <div className="card-custom">
            <ProductImages
              coverImages={productDetail.coverImages}
              productName={productDetail.productName}
            />
          </div>
        </div>

        {/* Right side: Product Information (8 columns) */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Product Info (Title, Price, Add to Cart) */}
          <ProductInfo product={productDetail} />
          <ProductAttribute product={productDetail} />
          <ProductDescription description={productDetail.description} />
        </div>
      </div>
    </Container>
  );
};

export default ProductDetailPage;
