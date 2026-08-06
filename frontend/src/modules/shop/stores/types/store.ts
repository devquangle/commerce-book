export interface ShopSimpleResponse {
  shopId: number;
  shopName: string;
  shopSlug: string;
}
export interface ShopResponse {
  shopId: number;
  shopName: string;
  shopSlug: string;
  logo?: string;
  banner?: string;
  owner: OwnerResponse;
  address: StroreAddressResponse;
  description?: string;
}

export interface OwnerResponse {
  ownerId: number;
  name: string;
  email: string;
  phone: string;
  cccd: string;
  dob: string;
  sex: string;
  isVerify: boolean;
}

export interface StroreAddressResponse {
  addressId: number;
  proviceId: number;
  districtId: number;
  wardCode: string;
  street: string;
  streetFull: string;
}
