import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import Spinner from "@/components/common/Spinner";
import { ADMIN_PATH } from "@/libs/constant/admin-path";

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
const ProfilePage = lazy(() => import("@/modules/auth/components/ProfilePage"));

export const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Suspense fallback={<Spinner message="Loading admin panel..." />}>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path={ADMIN_PATH.PRODUCTS} element={<AdminProducts />} />
          <Route path={ADMIN_PATH.STORES} element={<AdminStores />} />
          <Route path={ADMIN_PATH.SERIES} element={<AdminSeriesPage />} />
          <Route path={ADMIN_PATH.GENRES} element={<AdminGenrePage />} />
          <Route path={ADMIN_PATH.AUTHORS} element={<AdminAuthorPage />} />
          <Route path={ADMIN_PATH.PUBLISHERS} element={<AdminPublisherPage />} />
          <Route path={ADMIN_PATH.ANALYTICS} element={<AdminAnalytics />} />
          <Route path={ADMIN_PATH.REPORTS_PRODUCTS} element={<AdminReportsProducts />} />
          <Route path={ADMIN_PATH.REPORTS_STORES} element={<AdminReportsStores />} />
          <Route path={ADMIN_PATH.SETTINGS} element={<AdminSettings />} />
          <Route path={ADMIN_PATH.PROFILE} element={<ProfilePage />} />
          <Route path="*" element={<Navigate to={ADMIN_PATH.ROOT} replace />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};
