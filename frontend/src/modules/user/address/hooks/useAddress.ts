import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AddressService } from "../services/address.service";
import type { AddressRequest } from "../types/address.type";

export const addressKeys = {
  all: ["addresses"] as const,
  detail: (id: number) => ["addresses", id] as const,
};

export const useAddresses = () => {
  return useQuery({
    queryKey: addressKeys.all,
    queryFn: AddressService.getAll,
  });
};

export const useAddressDetail = (id: number) => {
  return useQuery({
    queryKey: addressKeys.detail(id),
    queryFn: () => AddressService.getById(id),
    enabled: !!id,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddressRequest) => AddressService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AddressRequest }) =>
      AddressService.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      queryClient.invalidateQueries({ queryKey: addressKeys.detail(variables.id) });
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => AddressService.setDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => AddressService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
};
