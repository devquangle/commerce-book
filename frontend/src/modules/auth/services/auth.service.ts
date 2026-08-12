import { authAxios, publicAxios } from "@/libs/config/axios.config";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from "../types/login.type";

import type { ApiResponse } from "@/libs/utils/api-response";
import type {
  UserRequest,
  UserResponse,
  ChangePasswordRequest,
} from "../types/user.type";
import type {
  RegisterUserRequest,
  VerifyTokenRequest,
} from "../types/register-user";

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
  updateUser: async (request: UserRequest): Promise<UserResponse | null> => {
    const response = await authAxios.put<ApiResponse<UserResponse>>(
      "/api/v1/auth/me",
      request,
    );
    console.log("updateUser request:", request); // Log the request data for debugging
    console.log("updateUser response:", response.data); // Log the entire response for debugging
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to update user data");
    }
    return response.data.data;
  },
  changePassword: async (request: ChangePasswordRequest): Promise<void> => {
    const response = await authAxios.put<ApiResponse<void>>(
      "/api/v1/auth/change-password",
      request,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to change password");
    }
  },
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await publicAxios.post<ApiResponse<RefreshTokenResponse>>(
      "/api/v1/auth/refresh",
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to refresh token");
    }
    return response.data.data;
  },
  register: async (request: RegisterUserRequest): Promise<string> => {
    const response = await publicAxios.post<ApiResponse<void>>(
      "/api/v1/auth/register",
      request,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed register");
    }
    return response.data.message;
  },
  verifyRegister: async (request: VerifyTokenRequest): Promise<string> => {
    const response = await publicAxios.post<ApiResponse<void>>(
      "/api/v1/auth/verify-register",
      request,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed verify register");
    }
    return response.data.message;
  },
  resendVerificationEmail: async (
    request: VerifyTokenRequest,
  ): Promise<string> => {
    const response = await publicAxios.post<ApiResponse<void>>(
      "/api/v1/auth/resend-verify-register",
      request,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed resend verify register");
    }
    return response.data.message;
  },
};
