import type { RoleType } from "@/libs/constant/role.type";

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  phone?: string;
  street: string;
  role: RoleType;
  avatar?: string;
}
    