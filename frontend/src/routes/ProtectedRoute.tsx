import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import Spinner from "@/components/ui/Spinner";
import type { RoleType } from "@/libs/constant/role.type";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: RoleType[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, isInitialized, userInfo } = useAuth();
  const location = useLocation();

  // Đang kiểm tra trạng thái xác thực
  if (!isInitialized) {
    return <Spinner message="Đang kiểm tra quyền truy cập..." />;
  }

  // Chưa đăng nhập -> Chuyển về trang login và lưu URL hiện tại vào state
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Đã đăng nhập nhưng không có role được phép truy cập
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = userInfo?.role && allowedRoles.includes(userInfo.role);
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
