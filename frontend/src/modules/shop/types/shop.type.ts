

export interface ShopStats {
  rating?: number;
  reviewCount?: number;
  soldCount?:number;
  joinedYear?: string;
}

export interface ShopInfo {
  id: string;
  name: string;
  logo: string;
  banner?: string[];
  isVerified: boolean;
  streetFull: string;
  description: string;
  stats: ShopStats;
  hotline?: string;
}
