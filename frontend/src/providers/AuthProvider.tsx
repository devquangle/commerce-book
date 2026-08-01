import React, { useState, useEffect } from "react";
import { AuthContext } from "../context/useAuth";

import type { UserResponse } from "@/modules/auth/types/user.type";
import type { LoginRequest } from "@/modules/auth/types/login.type";
import type { RoleType } from "@/libs/constant/role.type";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Mock initialization
    const initAuth = async () => {
      // Simulate API call to fetch session/user info
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsInitialized(true);
    };
    initAuth();
  }, []);

  const isAuthenticated = !!userInfo;

  const login = async (request: LoginRequest): Promise<UserResponse | null> => {
    // Mock login logic - in a real app, you would call your API here
    const mockUser: UserResponse = {
      id: "1",
      email: request.email,
      name: "Khách hàng",
      role: "USER",
      street: "123 Đường Tạm, Quận 1, TP.HCM"
    };
    setUserInfo(mockUser);
    return mockUser;
  };

  const logout = async (): Promise<void> => {
    // Mock logout logic
    setUserInfo(null);
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
