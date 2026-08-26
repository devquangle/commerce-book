import type { ShopInfo as ShopInfoType } from "../../modules/shop/types/shop.type";
import { Star, MapPin, BadgeCheck, Flag } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { formatCompactNumber } from "@/libs/utils/formatMoney.utils";

interface ShopInfoProps {
  shopInfo: ShopInfoType;
  layout?: "horizontal" | "vertical";
}

const ShopInfo: React.FC<ShopInfoProps> = ({
  shopInfo,
  layout = "horizontal",
}) => {
  const isHorizontal = layout === "horizontal";
  const navigate = useNavigate();

  return (
    <div
      className={clsx(
        "bg-white rounded-xl shadow-sm border border-gray-100 p-6",
        "flex gap-6 justify-between items-start relative z-10",
        isHorizontal ? "flex-col lg:flex-row mx-4 md:mx-8 mb-6" : "flex-col",
      )}
    >
      {/* Left: Logo & Details */}
      <div
        className={clsx(
          "flex flex-1 w-full",
          isHorizontal ? "flex-col sm:flex-row gap-6" : "flex-row gap-4",
        )}
      >
        {/* Logo */}
        <div
          className={clsx(
            "rounded-full bg-emerald-400 shrink-0 flex items-center justify-center overflow-hidden border-2 md:border-4 border-white shadow-sm",
            isHorizontal ? "w-24 h-24" : "w-16 h-16",
          )}
        >
          {shopInfo.logo ? (
            <img
              src={shopInfo.logo}
              alt={shopInfo.shopName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-bold text-lg">Logo</span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex justify-between items-center gap-2">
              <h1
                className={clsx(
                  "font-bold text-gray-800 truncate",
                  isHorizontal ? "text-lg" : "text-md",
                )}
              >
                {shopInfo.shopName}
              </h1>
              {shopInfo.isVerified &&
                (isHorizontal ? (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap">
                    <BadgeCheck className="w-3.5 h-3.5" /> Đã xác thực
                  </span>
                ) : (
                  <BadgeCheck className="w-5 h-5 text-blue-500" />
                ))}
            </div>
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/report-shop/${shopInfo.shopSlug}`)}
                className="text-gray-400 hover:text-gray-600 px-2.5 py-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                title="Báo cáo"
                icon={<Flag className="w-3.5 h-3.5" />}
              >
                <span className="hidden sm:inline">Báo cáo</span>
              </Button>
            </div>
          </div>

          {/* Stats line */}
          <div
            className={clsx(
              "flex flex-wrap items-center text-gray-600",
              isHorizontal ? "gap-6 text-[15px]" : "gap-3 text-sm",
            )}
          >
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
              <span className="font-medium text-gray-800">
                {shopInfo.stats?.rating || 0}
              </span>
              {typeof shopInfo.stats?.reviewCount === 'number' && (
                <span className="text-gray-500">
                  {formatCompactNumber(shopInfo.stats.reviewCount)} đánh giá
                </span>
              )}
              {typeof shopInfo.stats?.soldCount === 'number' && (
                <span className="text-gray-500 text-[13px] border-l border-gray-300 pl-3">
                  Đã bán {formatCompactNumber(shopInfo.stats.soldCount)}
                </span>
              )}
            </div>
            {isHorizontal && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{shopInfo.streetFull}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {isHorizontal && (
            <p className="text-gray-600 line-clamp-2 text-sm mt-1">
              {shopInfo.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopInfo;
