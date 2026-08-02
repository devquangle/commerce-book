import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ShopLayout from "@/layouts/ShopLayout";

// Lazy-loaded pages
const ShopDashboard = lazy(() => import("@/modules/shop/pages/ShopDashboard"));
const ShopProductPage = lazy(
  () => import("@/modules/shop/product/ShopProductPage"),
);
const ShopOrders = lazy(() => import("@/modules/shop/pages/ShopOrders"));
const ShopOrderDetail = lazy(
  () => import("@/modules/shop/pages/ShopOrderDetail"),
);
const ShopRevenue = lazy(() => import("@/modules/shop/pages/ShopRevenue"));
const ShopSettings = lazy(() => import("@/modules/shop/pages/ShopSettings"));
const ShopInventory = lazy(() => import("@/modules/shop/pages/ShopInventory"));


export const ShopRoutes: React.FC = () => {
  return (
    <ShopLayout>
      <Suspense >
        <Routes>
          <Route index element={<ShopDashboard />} />
          <Route path="products" element={<ShopProductPage />} />
          <Route path="inventory" element={<ShopInventory />} />
          <Route path="orders" element={<ShopOrders />} />
          <Route path="orders/:id" element={<ShopOrderDetail />} />
          <Route path="revenue" element={<ShopRevenue />} />
          <Route path="settings" element={<ShopSettings />} />
          <Route path="*" element={<Navigate to="/shop" replace />} />
        </Routes>
      </Suspense>
    </ShopLayout>
  );
};
