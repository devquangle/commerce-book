import React from "react";
import ProductImages from "../components/ProductImages";
import Container from "@/components/common/Container";
import ProductDescription from "../components/ProductDescription";

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
  language: "English",
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
          {/* Header Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {mockProduct.productName}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span>
                Sold:{" "}
                <strong className="text-gray-900">
                  {mockProduct.soldCount}
                </strong>
              </span>
              <span>•</span>
              <span>
                Author:{" "}
                <strong className="text-gray-900">
                  {mockProduct.productAuthors.map((a) => a.name).join(", ")}
                </strong>
              </span>
            </div>
            <div className="text-3xl font-bold text-red-600">
              ${mockProduct.price.toFixed(2)}
            </div>
          </div>

          {/* Details Table / Grid */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Product Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Publisher</span>
                <span className="font-medium text-gray-900">
                  {mockProduct.productPublisher.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Publish Year</span>
                <span className="font-medium text-gray-900">
                  {mockProduct.publishYear}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Pages</span>
                <span className="font-medium text-gray-900">
                  {mockProduct.pages}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Language</span>
                <span className="font-medium text-gray-900">
                  {mockProduct.language || "N/A"}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Weight</span>
                <span className="font-medium text-gray-900">
                  {mockProduct.weight}g
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">ISBN</span>
                <span className="font-medium text-gray-900">
                  {mockProduct.isbn || "N/A"}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2 sm:col-span-2">
                <span className="text-gray-500">Genres</span>
                <span className="font-medium text-gray-900 flex flex-wrap gap-2 justify-end">
                  {mockProduct.productGenres.map((g) => (
                    <span
                      key={g.id}
                      className="bg-gray-200 px-2 py-1 rounded-md text-xs"
                    >
                      {g.name}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-white text-blue-600 border border-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors">
              Add to Cart
            </button>
            <button className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
              Buy Now
            </button>
          </div>

         <ProductDescription description={mockProduct.description}/>
        </div>
      </div>
    </Container>
  );
};

export default ProductDetailPage;
