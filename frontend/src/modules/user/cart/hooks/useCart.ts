import { useQuery } from "@tanstack/react-query";
import { CartService } from "../services/cart.service";
import type { CartResponse } from "../types/cart.type";

export const useCart = () => {
  return useQuery<CartResponse[]>({
    queryKey: ["cart"],
    queryFn: CartService.getMyCart,
  });
};

const SELECTED_CART_ITEMS_KEY = "selectedCartItemIds";

export const getSelectedCartItemIds = (): number[] => {
  try {
    const data = localStorage.getItem(SELECTED_CART_ITEMS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.every(item => typeof item === "number")) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.error("Failed to parse selectedCartItemIds from localStorage", error);
    return [];
  }
};

export const setSelectedCartItemIds = (ids: number[]) => {
  localStorage.setItem(SELECTED_CART_ITEMS_KEY, JSON.stringify(ids));
};

export const toggleSelectedCartItem = (cartItemId: number, isSelected: boolean) => {
  const currentIds = getSelectedCartItemIds();
  const set = new Set(currentIds);
  if (isSelected) {
    set.add(cartItemId);
  } else {
    set.delete(cartItemId);
  }
  setSelectedCartItemIds(Array.from(set));
};

export const clearSelectedCartItems = () => {
  localStorage.removeItem(SELECTED_CART_ITEMS_KEY);
};
