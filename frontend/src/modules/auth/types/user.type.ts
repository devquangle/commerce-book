import type { RoleType } from "@/libs/constant/role.type";

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  username: string;
  phone?: string;
  street: string;
  role: RoleType;
  avatarUrl?: string;
}
    
export interface UserRequest {
  email: string;
  name: string;
  phone?: string;
  street: string;
  avatarUrl?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}