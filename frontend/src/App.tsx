import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminRoutes } from "@/routes/AdminRoutes";
import { ShopRoutes } from "@/routes/ShopRoutes";
import { UserRoutes } from "@/routes/UserRoutes";
import ScrollToTop from "@/components/common/ScrollToTop";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SHOP_PATH } from "./libs/constant/shop-path";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Admin panel: /admin/* */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Shop panel (seller dashboard): /shop/* */}
            <Route path={`${SHOP_PATH.ROOT}/*`} element={<ShopRoutes />} />

            {/* User storefront: /* */}
            <Route path="/*" element={<UserRoutes />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
