import { publicAxios } from "@/libs/config/axios.config";
import type { BankResponse } from "../types/bank.type";
import type { ApiResponse } from "@/libs/utils/api-response";

const BankService = {
  getBanks: async (): Promise<BankResponse[]> => {
    const response = await publicAxios.get<ApiResponse<BankResponse[]>>('/api/v1/banks');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to fetch banks");
    }
    console.log("BankService.getBanks response:", response.data.data); // Log the entire response for debugging
    return response.data.data;
  }
};
export default BankService;