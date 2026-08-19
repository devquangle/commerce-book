import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ShopLayout from "@/layouts/ShopLayout";
import Spinner from "@/components/common/Spinner";
import { SHOP_PATH } from "@/libs/constant/shop-path";

// Lazy-loaded pages
const ShopDashboard = lazy(() => import("@/modules/shop/pages/ShopDashboard"));
const ShopProductPage = lazy(
  () => import("@/modules/shop/products/pages/ShopProductPage"),
);
const ShopProductCreatePage = lazy(
  () => import("@/modules/shop/products/pages/ShopProductCreatePage"),
);
const ShopProductUpdatePage = lazy(
  () => import("@/modules/shop/products/pages/ShopProductUpdatePage"),
);

const ShopOrders = lazy(() => import("@/modules/shop/pages/ShopOrders"));
const ShopOrderDetail = lazy(
  () => import("@/modules/shop/pages/ShopOrderDetail"),
);
const ShopRevenue = lazy(() => import("@/modules/shop/pages/ShopRevenue"));
const ShopSettings = lazy(() => import("@/modules/shop/pages/ShopSettings"));
const ShopInventory = lazy(() => import("@/modules/shop/pages/ShopInventory"));
const StorePage = lazy(() => import("@/modules/shop/stores/pages/StorePage"));
const ProfilePage = lazy(() => import("@/modules/auth/components/ProfilePage"));

const ShopPromotionListPage = lazy(() => import('@/modules/shop/promotions/pages/ShopPromotionListPage'));
const ShopPromotionAddPage = lazy(() => import('@/modules/shop/promotions/pages/ShopPromotionAddPage'));
const ShopPromotionUpdatePage = lazy(() => import('@/modules/shop/promotions/pages/ShopPromotionUpdatePage'));

const ShopVoucherListPage = lazy(() => import("@/modules/shop/vouchers/pages/ShopVoucherListPage"));
const ShopVoucherAddPage = lazy(() => import("@/modules/shop/vouchers/pages/ShopVoucherAddPage"));
const ShopVoucherUpdatePage = lazy(() => import("@/modules/shop/vouchers/pages/ShopVoucherUpdatePage"));
export const ShopRoutes = () => {
  return (
    <ShopLayout>
      <Suspense fallback={<Spinner message="Loading shop panel..." />}>
        <Routes>
          <Route index element={<ShopDashboard />} />
          <Route path={SHOP_PATH.STORE} element={<StorePage />} />
          <Route path={SHOP_PATH.PRODUCTS} element={<ShopProductPage />} />
          <Route
            path={SHOP_PATH.PRODUCT_CREATE}
            element={<ShopProductCreatePage />}
          />
          <Route
            path={SHOP_PATH.PRODUCT_UPDATE}
            element={<ShopProductUpdatePage />}
          />
          <Route path={SHOP_PATH.INVENTORY} element={<ShopInventory />} />
          <Route path={SHOP_PATH.ORDERS} element={<ShopOrders />} />
          <Route path={SHOP_PATH.ORDER_DETAIL} element={<ShopOrderDetail />} />
          <Route path={SHOP_PATH.REVENUE} element={<ShopRevenue />} />
          <Route path={SHOP_PATH.SETTINGS} element={<ShopSettings />} />
          <Route path={SHOP_PATH.MY_ACCOUNT} element={<ProfilePage />} />
          
          <Route path={SHOP_PATH.PROMOTIONS} element={<ShopPromotionListPage />} />
          <Route path={SHOP_PATH.PROMOTION_CREATE} element={<ShopPromotionAddPage />} />
          <Route path={SHOP_PATH.PROMOTION_UPDATE} element={<ShopPromotionUpdatePage />} />

          <Route path={SHOP_PATH.VOUCHERS} element={<ShopVoucherListPage />} />
          <Route path={SHOP_PATH.VOUCHER_CREATE} element={<ShopVoucherAddPage />} />
          <Route path={SHOP_PATH.VOUCHER_UPDATE} element={<ShopVoucherUpdatePage />} />
          <Route path="*" element={<Navigate to={SHOP_PATH.ROOT} replace />} />
        </Routes>
      </Suspense>
    </ShopLayout>
  );
};
