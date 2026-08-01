import type { LoginRequest } from "../types/login.type";
import type { UserResponse } from "../types/user.type";

export const AuthService = {
  login: async (request: LoginRequest): Promise<UserResponse | null> => {
    // Implementation for login
  }
};