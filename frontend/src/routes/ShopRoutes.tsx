import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ShopLayout from "@/layouts/ShopLayout";
import Spinner from "@/components/common/Spinner";
import { SHOP_PATH } from "@/libs/constant/shop-path";

// Lazy-loaded pages
const ShopDashboard = lazy(() => import("@/modules/shop/pages/ShopDashboard"));
const ShopProductPage = lazy(
  () => import("@/modules/shop/product/pages/ShopProductPage"),
);
const ShopProductCreatePage = lazy(
  () => import("@/modules/shop/product/pages/ShopProductCreatePage"),
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

export const ShopRoutes = () => {
  return (
    <ShopLayout>
      <Suspense fallback={<Spinner message="Loading shop panel..." />}>
        <Routes>
          <Route index element={<ShopDashboard />} />
          <Route path={SHOP_PATH.STORE} element={<StorePage />} />
          <Route path={SHOP_PATH.PRODUCTS} element={<ShopProductPage />} />
          <Route path={SHOP_PATH.PRODUCT_CREATE} element={<ShopProductCreatePage />} />
          <Route path={SHOP_PATH.INVENTORY} element={<ShopInventory />} />
          <Route path={SHOP_PATH.ORDERS} element={<ShopOrders />} />
          <Route path={SHOP_PATH.ORDER_DETAIL} element={<ShopOrderDetail />} />
          <Route path={SHOP_PATH.REVENUE} element={<ShopRevenue />} />
          <Route path={SHOP_PATH.SETTINGS} element={<ShopSettings />} />
          <Route path={SHOP_PATH.MY_ACCOUNT} element={<ProfilePage />} />
          <Route path="*" element={<Navigate to={SHOP_PATH.ROOT} replace />} />
        </Routes>
      </Suspense>
    </ShopLayout>
  );
};
