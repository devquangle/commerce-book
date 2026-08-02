import React from "react";
import { AuthContext } from "../context/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { UserResponse } from "@/modules/auth/types/user.type";
import type { LoginRequest } from "@/modules/auth/types/login.type";
import type { RoleType } from "@/libs/constant/role.type";
import { AuthService } from "@/modules/auth/services/auth.service";
import { getToken, setToken, removeToken } from "@/libs/utils/cookie";
import { TokenType } from "@/libs/constant/token.type";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      if (
        !getToken(TokenType.ACCESS_TOKEN)
      ) {
        return null;
      }
      return await AuthService.getUser();
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // Thay vì dùng useState + useEffect (gây lỗi render nhiều lần), chúng ta lấy trực tiếp từ cache của React Query
  const userInfo = user || null;
  const isAuthenticated = !!user && !isError;
  const isInitialized = !isLoading;

  // Giữ lại hàm setUserInfo để tương thích với AuthContext, nhưng dùng QueryCache làm nguồn sự thật
  const setUserInfo = (newUser: UserResponse | null) => {
    queryClient.setQueryData(["auth", "me"], newUser);
  };

  const login = async (request: LoginRequest): Promise<UserResponse | null> => {
    const res = await AuthService.login(request);
    setToken(TokenType.ACCESS_TOKEN, res.accessToken);
    setToken(TokenType.REFRESH_TOKEN, res.refreshToken);
    // Force React Query to fetch and cache new user data
    console.log(res);
    
    const fetchedUser = await queryClient.fetchQuery({
      queryKey: ["auth", "me"],
      queryFn: () => AuthService.getUser(),
    });

    return fetchedUser;
  };

  const logout = async (): Promise<void> => {
    removeToken(TokenType.ACCESS_TOKEN);
    removeToken(TokenType.REFRESH_TOKEN);
    setUserInfo(null);
    window.location.href = "/login";
  };

  const hasRole = (role: RoleType): boolean => {
    return userInfo?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        setUserInfo,
        isAuthenticated,

        isInitialized,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
