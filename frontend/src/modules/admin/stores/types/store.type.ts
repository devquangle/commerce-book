import type { ShopStatus } from "./store-status.type";

export interface AdminShopResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  status: ShopStatus;
  reason?: string;
  rating?: number;
  year?: number;
  createdAt?: string;
  updatedAt?: string;

  // Owner
  ownerId?: number;
  ownerFullName?: string;
  ownerEmail?: string;
  ownerPhone?: string;

  // Banking
  bankName?: string;
  bankNumber?: string;
  ownerName?: string;
}

export interface AdminShopDetailResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  status: ShopStatus;
  reason?: string;
  rating?: number;
  year?: number;
  createdAt?: string;
  updatedAt?: string;

  // Owner Identity
  ownerId?: number;
  username?: string;
  email?: string;
  phone?: string;
  fullName?: string;
  ownerFullName?: string;
  ownerRole?: string;

  // eKYC Data
  identityNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  permanentAddress?: string;
  expiryDate?: string;
  cccdFrontUrl?: string;
  cccdBackUrl?: string;
  faceImageUrl?: string;
  ekycVerified?: boolean;

  // Banking
  bankName?: string;
  bankNumber?: string;
  ownerName?: string;

  // Warehouse Address
  warehouseAddressId?: number;
  streetFull?: string;
  street?: string;
  provinceId?: number;
  districtId?: number;
  wardCode?: string;
}

export interface AdminShopFilterParams {
  keyword?: string;
  status?: ShopStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface RejectShopRequest {
  reason: string;
}
