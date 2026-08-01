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
    console.log("getUser response:", response.data); // Log the entire response for debugging
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to fetch user data");
    }
    console.log("getUser data:", response.data.data); // Log the user data for debugging
    return response.data.data;
  },
  updateUser: async (userData: FormData): Promise<UserResponse | null> => {
    const response =
      await authAxios.put<ApiResponse<UserResponse>>("/api/v1/auth/me", userData);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to update user data");
    }
    return response.data.data;
  }
};
