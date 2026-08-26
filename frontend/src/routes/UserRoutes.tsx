import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "@/layouts/UserLayout";
import ProfileLayout from "@/layouts/ProfileLayout";
import Spinner from "@/components/common/Spinner";
import RegisterPage from "@/modules/user/register/pages/RegisterPage";
import ConfirmEmailPage from "@/modules/user/register/pages/ConfirmEmailPage";
import AddressPage from "@/modules/user/address/pages/AddressPage";
import AddressCreatePage from "@/modules/user/address/pages/AddressCreatePage";
import AddressUpdatePage from "@/modules/user/address/pages/AddressUpdatePage";

// Lazy-loaded pages
const Home = lazy(() => import("@/modules/user/pages/Home"));
const BookDetail = lazy(() => import("@/modules/user/pages/BookDetail"));
const BookList = lazy(() => import("@/modules/user/pages/BookList"));
const Cart = lazy(() => import("@/modules/user/pages/Cart"));
const Checkout = lazy(() => import("@/modules/user/pages/Checkout"));
const OrderSuccess = lazy(() => import("@/modules/user/pages/OrderSuccess"));
const OrderHistory = lazy(() => import("@/modules/user/pages/OrderHistory"));
const OrderDetail = lazy(() => import("@/modules/user/pages/OrderDetail"));
const Search = lazy(() => import("@/modules/user/pages/Search"));
const NotFound = lazy(() => import("@/modules/user/pages/NotFound"));
const LoginPage = lazy(() => import("@/modules/user/login/LoginPage"));
const ProfilePage = lazy(() => import("@/modules/auth/components/ProfilePage"));
const RegisterShopPage = lazy(
  () => import("@/modules/user/register-shop/pages/RegisterShopPage"),
);
const SearchProductPage = lazy(
  () => import("@/modules/product/pages/user/SearchProductPage")
);
const ProductDetailPage = lazy(
  () => import("@/modules/user/product-detail/pages/ProductDetailPage")
);
export const UserRoutes: React.FC = () => {
  return (
    <UserLayout>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify-email" element={<ConfirmEmailPage />} />
          <Route path="register-shop" element={<RegisterShopPage />} />
          <Route path="books" element={<BookList />} />
          <Route path="books/:id" element={<BookDetail />} />
          <Route path="products" element={<SearchProductPage />} />
          <Route path="product-detail" element={<ProductDetailPage />} />
          <Route path="search" element={<Search />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />

          <Route element={<ProfileLayout />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="address" element={<AddressPage />} />
            <Route path="address/create" element={<AddressCreatePage />} />
            <Route path="address/edit/:id" element={<AddressUpdatePage />} />
            <Route path="orders/:id" element={<OrderDetail />} />
          </Route>

          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </UserLayout>
  );
};
