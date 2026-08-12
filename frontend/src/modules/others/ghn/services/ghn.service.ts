import { publicAxios } from "@/libs/config/axios.config";
import type { ApiResponse } from "@/libs/utils/api-response";
import type {
  ProvinceResponse,
  DistrictResponse,
  WardResponse,
  ProvinceRequest,
  DistrictRequest,
  CalculateFeeRequest,
} from "../types/ghn.type";

const GHNService = {
  getProvinces: async (): Promise<ProvinceResponse[]> => {
    const response = await publicAxios.get<ApiResponse<ProvinceResponse[]>>("/api/v1/ghn/provinces");
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to fetch provinces");
    }
    console.log(response.data.data)
    return response.data.data;
  },

  getDistricts: async (request: ProvinceRequest): Promise<DistrictResponse[]> => {
    const response = await publicAxios.post<ApiResponse<DistrictResponse[]>>("/api/v1/ghn/districts", request);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to fetch districts");
    }
    return response.data.data;
  },

  getWards: async (request: DistrictRequest): Promise<WardResponse[]> => {
    const response = await publicAxios.post<ApiResponse<WardResponse[]>>("/api/v1/ghn/wards", request);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to fetch wards");
    }
    return response.data.data;
  },

  calculateShippingFee: async (request: CalculateFeeRequest): Promise<number> => {
    const response = await publicAxios.post<ApiResponse<number>>("/api/v1/ghn/shipping-fee", request);
    if (!response.data.success || response.data.data === null || response.data.data === undefined) {
      throw new Error(response.data.message || "Failed to calculate shipping fee");
    }
    return response.data.data;
  },
};

export default GHNService;