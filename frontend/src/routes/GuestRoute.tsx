import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import Spinner from "@/components/ui/Spinner";

interface GuestRouteProps {
  children?: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { isAuthenticated, isInitialized, userInfo } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return <Spinner message="Đang tải..." />;
  }

  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname: string; search?: string } })?.from;
    const defaultPath =
      userInfo?.role === "USER"
        ? "/home"
        : userInfo?.role === "SHOP"
        ? "/shop"
        : "/admin";

    const redirectPath = from ? `${from.pathname}${from.search || ""}` : defaultPath;
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default GuestRoute;
