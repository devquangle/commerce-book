import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import Spinner from "@/components/common/Spinner";

// Lazy-loaded pages
const AdminDashboard = lazy(() => import("@/modules/admin/pages/AdminDashboard"));
const AdminProducts = lazy(() => import("@/modules/admin/pages/AdminProducts"));
const AdminStores = lazy(() => import("@/modules/admin/pages/AdminStores"));
const AdminSeriesPage = lazy(() => import("@/modules/admin/series/AdminSeriesPage"));
const AdminGenrePage = lazy(() => import("@/modules/admin/genres/AdminGenrePage"));
const AdminAuthorPage = lazy(() => import("@/modules/admin/authors/AdminAuthorPage"));
const AdminPublisherPage = lazy(() => import("@/modules/admin/publishers/AdminPublisherPage"));
const AdminAnalytics = lazy(() => import("@/modules/admin/pages/AdminAnalytics"));
const AdminReportsProducts = lazy(() => import("@/modules/admin/pages/AdminReportsProducts"));
const AdminReportsStores = lazy(() => import("@/modules/admin/pages/AdminReportsStores"));
const AdminSettings = lazy(() => import("@/modules/admin/pages/AdminSettings"));



export const AdminRoutes: React.FC = () => {
  return (
    <AdminLayout>
      <Suspense fallback={<Spinner message="Loading admin panel..." />}>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="stores" element={<AdminStores />} />
          <Route path="series" element={<AdminSeriesPage />} />
          <Route path="genres" element={<AdminGenrePage />} />
          <Route path="authors" element={<AdminAuthorPage />} />
          <Route path="publishers" element={<AdminPublisherPage />} />
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
