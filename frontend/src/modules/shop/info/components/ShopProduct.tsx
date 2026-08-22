import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { ShopInfo } from '../types/shop.type';
import { Store, MessageSquare, Star, BadgeCheck, Flag } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { formatCompactNumber } from '@/libs/utils/formatMoney.utils';
import { useChat } from '@/modules/chat/context/ChatContext';

export interface ProductShopProps {
  shop: ShopInfo;
  onChatClick?: (shopId: string | number) => void;
}

export const ShopProduct = ({ shop, onChatClick }: ProductShopProps) => {
  const navigate = useNavigate();
  const { openChatWithShop } = useChat();
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
          <Link to={`/shop/${shop.shopSlug}`} className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold hover:text-blue-600 transition-colors truncate">
              {shop.shopName}
            </h3>
            {shop.verify && (
              <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
            )}
          </Link>
          
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
      
      <div className="flex gap-2">
        <Button 
          variant="outline"
          className="flex-1 px-3 py-2 text-sm"
          icon={<MessageSquare className="w-4 h-4" />}
          onClick={() => {
            openChatWithShop(shop.shopId);
            onChatClick?.(shop.shopId);
          }}
        >
          Chat
        </Button>
        
        <Button 
          variant="outline"
          className="flex-1 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200"
          icon={<Flag className="w-4 h-4" />}
          onClick={() => {
            // TODO: Handle report shop
            console.log('Report shop', shop.shopId);
          }}
        >
          Báo cáo
        </Button>
      </div>
    </div>
  );
};
