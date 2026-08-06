export interface ShopAccountInfo {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface OwnerIdentityInfo {
  fullName: string;
  cccd: string;
  dob: string;
  sex: string;
  issueDate: string;
  expiryDate: string;
  address: string;
}

export interface ShopInfo {
  shopName: string;
  shopDescription: string;
  logo?: string;
  banner?: string;
  bankName: string;
  bankNumber: string;
  ownerName: string;
}

export interface ShopAddressInfo {
  provinceId: number;
  districtId: number;
  wardCode: string;
  street: string;
}

export interface RegisterShopRequest
  extends ShopAccountInfo,
    OwnerIdentityInfo,
    ShopInfo,
    ShopAddressInfo {}