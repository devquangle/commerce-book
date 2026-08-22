import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { ShopInfo } from '../types/shop.type';
import { Store, Star, BadgeCheck, Flag } from 'lucide-react';
import { formatCompactNumber } from '@/libs/utils/formatMoney.utils';
import { Chat } from '@/components/common/Chat';

export interface ProductShopProps {
  shop: ShopInfo;
  onChatClick?: (shopId: string | number) => void;
}

export const ShopProduct = ({ shop, onChatClick }: ProductShopProps) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  return (
    <div className="card-custom p-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          <Link 
            to={`/shop/${shop.shopSlug}`}
            className="w-12 h-12 rounded-full border bg-gray-50 flex items-center justify-center text-gray-400 overflow-hidden"
          >
            {shop.urlImage && !imgError ? (
              <img 
                src={shop.urlImage} 
                alt={shop.shopName}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <Store className="w-6 h-6" />
            )}
          </Link>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <Link to={`/shop/${shop.shopSlug}`} className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-base font-semibold hover:text-blue-600 transition-colors truncate">
                {shop.shopName}
              </h3>
              {shop.verify && (
                <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
              )}
            </Link>
            <button 
              className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1"
              title="Báo cáo"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Handle report shop
                console.log('Report shop', shop.shopId);
              }}
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-gray-900">{shop.rating?.toFixed(1) || '0'}</span>
              <span className="text-xs">({formatCompactNumber(shop.reviewCount)})</span>
            </div>
            <div className="w-px h-3 bg-gray-300"></div>
            <div className="flex items-center gap-1 text-xs">
              <span className="font-medium text-gray-900 text-sm">{formatCompactNumber(shop.soldCount)}</span>
              sản phẩm
            </div>
          </div>
        </div>
      </div>
      
      <Chat shopId={shop.shopId} shopName={shop.shopName} onChatClick={onChatClick} />
    </div>
  );
};
