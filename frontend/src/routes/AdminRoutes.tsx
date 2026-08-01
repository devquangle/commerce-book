import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";

// Lazy-loaded pages
const AdminDashboard = lazy(() => import("@/modules/admin/pages/AdminDashboard"));
const AdminProducts = lazy(() => import("@/modules/admin/pages/AdminProducts"));
const AdminStores = lazy(() => import("@/modules/admin/pages/AdminStores"));
const AdminSeries = lazy(() => import("@/modules/admin/pages/AdminSeries"));
const AdminCategories = lazy(() => import("@/modules/admin/pages/AdminCategories"));
const AdminAuthors = lazy(() => import("@/modules/admin/pages/AdminAuthors"));
const AdminPublishers = lazy(() => import("@/modules/admin/pages/AdminPublishers"));
const AdminAnalytics = lazy(() => import("@/modules/admin/pages/AdminAnalytics"));
const AdminReportsProducts = lazy(() => import("@/modules/admin/pages/AdminReportsProducts"));
const AdminReportsStores = lazy(() => import("@/modules/admin/pages/AdminReportsStores"));
const AdminSettings = lazy(() => import("@/modules/admin/pages/AdminSettings"));

const AdminFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
  </div>
);

export const AdminRoutes: React.FC = () => {
  return (
    <AdminLayout>
      <Suspense fallback={<AdminFallback />}>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="stores" element={<AdminStores />} />
          <Route path="series" element={<AdminSeries />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="authors" element={<AdminAuthors />} />
          <Route path="publishers" element={<AdminPublishers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="reports/products" element={<AdminReportsProducts />} />
          <Route path="reports/stores" element={<AdminReportsStores />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};
