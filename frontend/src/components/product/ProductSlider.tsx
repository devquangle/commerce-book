import type { ProductCardResponse } from '@/modules/product/types/product-card.type';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid } from 'swiper/modules';
import ProductCard from "@/components/product/ProductCard";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';

interface ProductSliderProps {
  title: string;
  products: ProductCardResponse[];
  id?: string;
  hideShop?: boolean;
  rows?: number;
}

const ProductSlider = ({ title, products, id = 'default', hideShop = false, rows = 2 }: ProductSliderProps) => {
  const nextClass = `slider-next-${id}`;
  const prevClass = `slider-prev-${id}`;

  return (
    <div className="card-custom relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button className={`${prevClass} w-10 h-10 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed`}>
            <ChevronLeft size={20} />
          </button>
          <button className={`${nextClass} w-10 h-10 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed`}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="-mx-4 px-4">
        <Swiper
          modules={rows > 1 ? [Navigation, Grid] : [Navigation]}
          navigation={{
            nextEl: `.${nextClass}`,
            prevEl: `.${prevClass}`,
          }}
          {...(rows > 1 ? { grid: { rows, fill: "row" } } : {})}
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
          {products.map((product) => (
            <SwiperSlide key={product.productId} className="h-auto!">
              <ProductCard product={product} hideShop={hideShop} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default ProductSlider;