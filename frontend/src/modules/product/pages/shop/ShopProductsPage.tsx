import ShopBanner from '@/components/shop/ShopBanner';
import type { ShopInfo } from '@/modules/shop/types/shop.type';

// Dữ liệu mẫu (mock data) theo đúng thiết kế UI
const mockShopInfo: ShopInfo = {
  id: 'shop-1',
  name: 'Nhà Sách Phương Nam',
  logo: '',
  banner: [
    'https://placehold.co/1200x300/2563eb/white?text=Banner+1',
    'https://placehold.co/1200x300/4f46e5/white?text=Banner+2',
    'https://placehold.co/1200x300/7c3aed/white?text=Banner+3'
  ],
  isVerified: true,
  streetFull: 'TP. Hồ Chí Minh',
  description: 'Nhà sách Phương Nam là hệ thống nhà sách uy tín hàng đầu Việt Nam, cung cấp đa dạng sách trong nước và quốc tế với chất lượng đảm bảo và dịch vụ chuyên nghiệp.',
  stats: {
    rating: 4.8,
    reviewCount: 7500,
    soldCount: 1500,
    joinedYear: '2018',
  },
  hotline: '1900 6656'
};

const ShopProductsPage = () => {
  return (
    <div className="min-h-screen my-4 px-2">
      <ShopBanner shopInfo={mockShopInfo} />
      
      {/* Phần dành cho Flash sale và Danh sách sản phẩm sẽ nằm ở đây */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      </div> */}
    </div>
  );
};

export default ShopProductsPage;