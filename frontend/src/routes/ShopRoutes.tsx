import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ShopLayout from "@/layouts/ShopLayout";
import Spinner from "@/components/common/Spinner";

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
          <Route path="stores" element={<StorePage />} />
          <Route path="products" element={<ShopProductPage />} />
          <Route path="product/create" element={<ShopProductCreatePage />} />
          <Route path="inventory" element={<ShopInventory />} />
          <Route path="orders" element={<ShopOrders />} />
          <Route path="orders/:id" element={<ShopOrderDetail />} />
          <Route path="revenue" element={<ShopRevenue />} />
          <Route path="settings" element={<ShopSettings />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/shop" replace />} />
        </Routes>
      </Suspense>
    </ShopLayout>
  );
};
