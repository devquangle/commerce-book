import { authAxios, publicAxios } from "@/libs/config/axios.config";
import type { LoginRequest, LoginResponse } from "../types/login.type";

import type { ApiResponse } from "@/libs/utils/api-response";
import type { UserResponse } from "../types/user.type";

export const AuthService = {
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    const response = await publicAxios.post<ApiResponse<LoginResponse>>(
      "/api/v1/auth/login",
      request,
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Login failed");
    }
    return response.data.data;
  },
  getUser: async (): Promise<UserResponse | null> => {
    const response =
      await authAxios.get<ApiResponse<UserResponse>>("/api/v1/auth/me");
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to fetch user data");
    }
    return response.data.data;
  },
};
