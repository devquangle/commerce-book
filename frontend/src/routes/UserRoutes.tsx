import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "@/layouts/UserLayout";
import ProfileLayout from "@/layouts/ProfileLayout";

// Lazy-loaded pages
const Home = lazy(() => import("@/modules/user/pages/Home"));
const BookDetail = lazy(() => import("@/modules/user/pages/BookDetail"));
const BookList = lazy(() => import("@/modules/user/pages/BookList"));
const Cart = lazy(() => import("@/modules/user/pages/Cart"));
const Checkout = lazy(() => import("@/modules/user/pages/Checkout"));
const OrderSuccess = lazy(() => import("@/modules/user/pages/OrderSuccess"));
const Profile = lazy(() => import("@/modules/user/profile/ProfilePage"));
const OrderHistory = lazy(() => import("@/modules/user/pages/OrderHistory"));
const OrderDetail = lazy(() => import("@/modules/user/pages/OrderDetail"));
const Search = lazy(() => import("@/modules/user/pages/Search"));
const NotFound = lazy(() => import("@/modules/user/pages/NotFound"));
const LoginPage = lazy(() => import("@/modules/user/login/LoginPage"));

const UserFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
  </div>
);

export const UserRoutes: React.FC = () => {
  return (
    <UserLayout>
      <Suspense fallback={<UserFallback />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="books" element={<BookList />} />
          <Route path="books/:id" element={<BookDetail />} />
          <Route path="search" element={<Search />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />
          
          <Route element={<ProfileLayout />}>
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="orders/:id" element={<OrderDetail />} />
          </Route>

          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </UserLayout>
  );
};
