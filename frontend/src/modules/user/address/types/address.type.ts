export interface AddressRequest {
  id: number;
  fullName: string;
  phone: string;
  provinceId: number | null;
  districtId: number | null;
  wardCode: string | null;
  street: string;
  defaultAddress: boolean;
}

export interface AddressResponse {
  id: number;
  fullName: string;
  phone: string;
  provinceId: number | null;
  districtId: number | null;
  wardCode: string | null;
  street: string;
  streetFull?: string;
  defaultAddress: boolean;
}
