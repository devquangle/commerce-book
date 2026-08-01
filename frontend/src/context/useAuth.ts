import { useContext, createContext } from "react";
import type { UserResponse } from "@/modules/auth/types/user.type";
import type { LoginRequest } from "@/modules/auth/types/login.type";
import type { RoleType } from "@/libs/constant/role.type";

export interface AuthContextType {
  userInfo: UserResponse | null;
  setUserInfo: (userInfo: UserResponse | null) => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (request: LoginRequest) => Promise<UserResponse | null>;
  logout: () => Promise<void>;
  hasRole: (role: RoleType) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
