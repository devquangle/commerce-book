import React from "react";
import ProductImages from "../components/ProductImages";
import Container from "@/components/common/Container";
import ProductDescription from "../components/ProductDescription";
import ProductAttribute from "../components/ProductAttribute";
import ProductInfo from "../components/ProductInfo";

// --- Interfaces provided by user ---
export interface ProductGenreResponse {
  id: number;
  name: string;
  slug: string;
}
export interface ProductAuthorResponse {
  id: number;
  name: string;
  slug: string;
}
export interface ProductSeriesResponse {
  id: number;
  name: string;
  slug: string;
}
export interface ProductPublisherResponse {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImageResponse {
  url: string;
  isThumbnail: boolean;
}

export interface ProductDetailResponse {
  productId: number;
  productName: string;
  productSlug: string;
  price: number;
  quantity: number;
  isbn?: string;
  weight: number;
  publishYear: string;
  pages: number;
  language?: string;
  description: string;
  soldCount?: number;

  productPublisher: ProductPublisherResponse;
  productSeries: ProductSeriesResponse | null;
  productGenres: ProductGenreResponse[] | [];
  productAuthors: ProductAuthorResponse[] | [];
  coverImages: ProductImageResponse[] | [];
}

// --- Mock Data ---
const mockProduct: ProductDetailResponse = {
  productId: 1,
  productName: "The Great Gatsby - Classic Edition",
  productSlug: "the-great-gatsby-classic-edition",
  price: 15.99,
  quantity: 120,
  isbn: "978-0743273565",
  weight: 300,
  publishYear: "1925",
  pages: 180,
  language: "eng",
  description:
    "The Great Gatsby, F. Scott Fitzgerald's third book, stands as the supreme achievement of his career. First published in 1925, this quintessential novel of the Jazz Age has been acclaimed by generations of readers. The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted 'gin was the national drink and sex the national obsession,' it is an exquisitely crafted tale of America in the 1920s.",
  soldCount: 450,
  productPublisher: {
    id: 1,
    name: "Scribner",
    slug: "scribner",
  },
  productSeries: null,
  productGenres: [
    { id: 1, name: "Classic Literature", slug: "classic-literature" },
    { id: 2, name: "Fiction", slug: "fiction" },
  ],
  productAuthors: [
    { id: 1, name: "F. Scott Fitzgerald", slug: "f-scott-fitzgerald" },
  ],
  coverImages: [
    { url: "https://picsum.photos/id/1015/800/800", isThumbnail: true },
    { url: "https://picsum.photos/id/1016/800/800", isThumbnail: false },
    { url: "https://picsum.photos/id/1018/800/800", isThumbnail: false },
    { url: "https://picsum.photos/id/1019/800/800", isThumbnail: false },
  ],
};

const ProductDetailPage: React.FC = () => {
  // Fallback if no product data
  if (!mockProduct) return <div>Loading...</div>;

  return (
    <Container className="max-w-7xl py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left side: Images (4 columns) */}
        <div className="md:col-span-4 md:sticky md:top-24 h-fit flex flex-col gap-4">
          <div className="card-custom">
            <ProductImages
              coverImages={mockProduct.coverImages}
              productName={mockProduct.productName}
            />
          </div>
        </div>

        {/* Right side: Product Information (8 columns) */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Product Info (Title, Price, Add to Cart) */}
          <ProductInfo product={mockProduct} />
          <ProductAttribute product={mockProduct} />
          <ProductDescription description={mockProduct.description} />
        </div>
      </div>
    </Container>
  );
};

export default ProductDetailPage;
