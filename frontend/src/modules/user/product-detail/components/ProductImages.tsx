import { useState } from "react";
import type { ProductImageResponse } from "../types/product-detail.type";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, FreeMode, Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/pagination";

export interface ProductImagesProps {
  coverImages: ProductImageResponse[] | [];
  productName?: string;
}

const ProductImages = ({ coverImages, productName = "Product" }: ProductImagesProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  
  if (!coverImages.length) {
    return (
      <div className="aspect-4/5 bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-2 rounded-xl border border-slate-200">
        <span className="text-sm font-medium">Chưa có hình ảnh</span>
      </div>
    );
  }
  
  return (
    <div className="lg:col-span-6 xl:col-span-4 flex flex-col gap-3">
      {/* Main Swiper */}
      <div className="overflow-hidden bg-slate-50 relative">
        <Swiper
          modules={[Thumbs, FreeMode, Navigation, Pagination]}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          loop={true}
          navigation={{
            nextEl: ".product-main-next",
            prevEl: ".product-main-prev",
          }}
          pagination={{ clickable: true }}
          className="aspect-4/5 relative group pb-8" // padding bottom for pagination dots
        >
          {coverImages.map((img, idx) => (
            <SwiperSlide key={idx} className="bg-slate-50">
              <img
                src={img.url}
                alt={`${productName} - Ảnh ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}

          {/* Custom navigation buttons */}
          <button className="product-main-next absolute left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-white hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100">
            <ChevronLeft size={20} />
          </button>
          <button className="product-main-prev absolute right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-white hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100">
            <ChevronRight size={20} />
          </button>
        </Swiper>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          .swiper-pagination-bullet { width: 8px; height: 8px; background: #cbd5e1; opacity: 1; transition: all 0.3s ease; }
          .swiper-pagination-bullet-active { background: #4f46e5; width: 24px; border-radius: 4px; }
          .swiper-pagination { bottom: 20px !important; }
        `,
          }}
        />
      </div>

      {/* Thumbs Swiper (grid 4 columns) */}
      {coverImages.length > 1 && (
        <div className="hidden md:block">
          <Swiper
            modules={[Thumbs, FreeMode]}
            onSwiper={setThumbsSwiper}
            slidesPerView={4}
            spaceBetween={12}
            freeMode={true}
            watchSlidesProgress={true}
            className="product-thumbs p-2!"
          >
            {coverImages.map((img, idx) => (
              <SwiperSlide key={idx} className="cursor-pointer">
                <div className="aspect-square overflow-hidden border border-slate-200 transition-all in-[.swiper-slide-thumb-active]:border-blue-600 in-[.swiper-slide-thumb-active]:ring-2 in-[.swiper-slide-thumb-active]:ring-blue-600 in-[.swiper-slide-thumb-active]:ring-offset-1 bg-white flex items-center justify-center p-1">
                  <img
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ProductImages;
