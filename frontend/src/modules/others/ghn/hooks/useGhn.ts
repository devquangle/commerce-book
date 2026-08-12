import { useQuery, useMutation } from "@tanstack/react-query";
import GHNService from "../services/ghn.service";
import type { CalculateFeeRequest } from "../types/ghn.type";

export const useProvinces = () => {
  return useQuery({
    queryKey: ["ghn", "provinces"],
    queryFn: () => GHNService.getProvinces(),
  });
};

export const useDistricts = (provinceId?: number | null) => {
  return useQuery({
    queryKey: ["ghn", "districts", provinceId],
    queryFn: () => {
      if (!provinceId) return Promise.resolve([]);
      return GHNService.getDistricts({ provinceId });
    },
    enabled: !!provinceId,
  });
};

export const useWards = (districtId?: number | null) => {
  return useQuery({
    queryKey: ["ghn", "wards", districtId],
    queryFn: () => {
      if (!districtId) return Promise.resolve([]);
      return GHNService.getWards({ districtId });
    },
    enabled: !!districtId,
  });
};

export const useCalculateFee = () => {
  return useMutation({
    mutationFn: (request: CalculateFeeRequest) => GHNService.calculateShippingFee(request),
  });
};
