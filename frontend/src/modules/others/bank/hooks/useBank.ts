import { useQuery } from "@tanstack/react-query";
import BankService from "../services/bank.service";
import type { BankResponse } from "../types/bank.type";

/**
 * Query key factory quản lý cache danh sách ngân hàng
 */
export const bankKeys = {
  all: ["banks"] as const,
  lists: () => [...bankKeys.all, "list"] as const,
};

/**
 * Hook lấy danh sách ngân hàng
 */
export const useBank = () => {
  return useQuery<BankResponse[]>({
    queryKey: bankKeys.lists(),
    queryFn: () => BankService.getBanks(),
    staleTime: 1000 * 60 * 30, // 30 phút - danh sách ngân hàng là dữ liệu tĩnh, ít biến động
  });
};

export const useBanks = useBank;
