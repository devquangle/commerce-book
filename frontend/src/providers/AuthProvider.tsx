import React from "react";
import { AuthContext } from "../context/useAuth";
import { useQueryClient } from "@tanstack/react-query";

import type { UserResponse } from "@/modules/auth/types/user.type";
import type { LoginRequest } from "@/modules/auth/types/login.type";
import type { RoleType } from "@/libs/constant/role.type";

import { AuthService } from "@/modules/auth/services/auth.service";
import { setToken, removeToken } from "@/libs/utils/cookie";
import { TokenType } from "@/libs/constant/token.type";

import {
  useGetUserQuery,
  useLoginMutation,
  authKeys,
} from "@/modules/auth/hooks/useAuth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError } = useGetUserQuery();

  const { mutateAsync: loginMutation } = useLoginMutation();
  const userInfo = user ?? null;
  const isAuthenticated = !!user && !isError;
  const isInitialized = !isLoading;
  const setUserInfo = (newUser: UserResponse | null) => {
    queryClient.setQueryData(authKeys.user(), newUser);
  };
  const login = async (request: LoginRequest): Promise<UserResponse | null> => {
    const data = await loginMutation(request);

    setToken(TokenType.ACCESS_TOKEN, data.accessToken);

    const fetchedUser = await queryClient.fetchQuery({
      queryKey: authKeys.user(),
      queryFn: () => AuthService.getUser(),
    });

    return fetchedUser;
  };

  const logout = async (): Promise<void> => {
    removeToken(TokenType.ACCESS_TOKEN);
    removeToken(TokenType.REFRESH_TOKEN);
    queryClient.setQueryData(authKeys.user(), null);
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
