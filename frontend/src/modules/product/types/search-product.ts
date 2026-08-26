export interface SearchProductsFilter {
  keyword?: string;
  genres?: string[];
  authors?: string[];
  publisher?: string;
  series?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
  size?: number;
  sort?: SortType;
}

export type SortType =
  | "priceAsc"
  | "priceDesc"
  | "soldCount"
  | "rating"
  | "newest"
  | "hasPromotion"
  | "";

export const SORT_OPTIONS: {
  value: SortType;
  label: string;
}[] = [
  {
    value: "priceAsc",
    label: "Giá: Thấp đến Cao",
  },
  {
    value: "priceDesc",
    label: "Giá: Cao đến Thấp",
  },
  {
    value: "soldCount",
    label: "Bán Chạy",
  },
  {
    value: "rating",
    label: "Đánh Giá Cao",
  },
  {
    value: "newest",
    label: "Mới Nhất",
  },
    {
    value: "hasPromotion",
    label: "Khuyến mãi",
  },
  {
    value: "",
    label: "Tất cả",
  },
];
