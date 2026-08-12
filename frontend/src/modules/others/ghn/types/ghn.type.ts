export interface ProvinceResponse {
  provinceId: number;
  provinceName: string;
}

export interface DistrictResponse {
  districtId: number;
  districtName: string;
}

export interface WardResponse {
  wardCode: string;
  wardName: string;
}

export interface ProvinceRequest {
  provinceId: number;
}

export interface DistrictRequest {
  districtId: number;
}

export interface CalculateFeeRequest {
  toDistrictId: number;
  toWardCode: string;
  weight: number;
  insuranceValue?: number;
  serviceTypeId?: number;
  length?: number;
  width?: number;
  height?: number;
}