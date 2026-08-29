import type { ShopInfo as ShopInfoType } from "../../modules/shop/types/shop.type";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ShopInfo from "./ShopInfo";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ShopBannerProps {
  shopInfo: ShopInfoType;
}

const ShopBanner = ({ shopInfo }: ShopBannerProps) => {
  return (
    <div className="w-full relative pb-6">
      {/* Container that wraps everything and clips the corners */}
      <div className="w-full relative rounded-2xl overflow-hidden isolate bg-gray-100">
        {/* Banner (Background) */}
        <div className="absolute inset-0 w-full h-full z-0">
          {shopInfo.banner && shopInfo.banner.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation={{
                nextEl: '.banner-next',
                prevEl: '.banner-prev',
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="w-full h-full shop-banner-swiper group"
            >
              {shopInfo.banner.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img}
                    alt={`Banner ${idx + 1}`}
                    className="block w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
              
              {/* Custom Navigation Buttons */}
              <button className="banner-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft size={20} />
              </button>
              <button className="banner-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronRight size={20} />
              </button>
            </Swiper>
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center text-gray-500 text-3xl font-bold">
              Banner {shopInfo.name}
            </div>
          )}
        </div>

        {/* Spacer to keep the top part of the banner visible */}
        <div className="w-full h-45 md:h-60 relative z-10 pointer-events-none"></div>

        {/* Shop Info Card (Extracted Component) */}
        <ShopInfo shopInfo={shopInfo} />
      </div>
    </div>
  );
};

export default ShopBanner;
