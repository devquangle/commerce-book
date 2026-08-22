import React from 'react';
import type { ProductCardResponse } from '../../products/types/product-card.type';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid } from 'swiper/modules';
import ProductCard from '../../products/components/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';

interface RelatedProductsProps {
  relatedProducts: ProductCardResponse[];
}
const RelatedProducts = ({relatedProducts}:RelatedProductsProps) => {
  return (
    <div className="card-custom relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Sản phẩm tương tự
        </h2>
        <div className="flex items-center gap-2">
          <button className="related-prev w-10 h-10 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronLeft size={20} />
          </button>
          <button className="related-next w-10 h-10 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="-mx-4 px-4">
        <Swiper
          modules={[Navigation, Grid]}
          navigation={{
            nextEl: ".related-next",
            prevEl: ".related-prev",
          }}
          grid={{
            rows: 2,
            fill: "row"
          }}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
            1280: { slidesPerView: 5, spaceBetween: 24 },
          }}
          className="related-products-swiper py-2"
        >
          {relatedProducts.map((product) => (
            <SwiperSlide key={product.productId} className="h-auto!">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default RelatedProducts