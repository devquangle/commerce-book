export const SHOP_PATH = {
  ROOT: "/shop",
  DASHBOARD: "",
  DASHBOARD_FULL: "/shop",

  STORE: "info",
  STORE_FULL: "/shop/info",

  PRODUCTS: "products",
  PRODUCTS_FULL: "/shop/products",
  
  PRODUCT_CREATE: "products/create",
  PRODUCT_CREATE_FULL: "/shop/products/create",

  PRODUCT_UPDATE: "products/update",
  PRODUCT_UPDATE_FULL: "/shop/products/update",

  INVENTORY: "inventory",
  INVENTORY_FULL: "/shop/inventory",

  ORDERS: "orders",
  ORDERS_FULL: "/shop/orders",
  ORDER_DETAIL: "orders/:id",
  ORDER_DETAIL_FULL: "/shop/orders/:id",

  REVENUE: "revenue",
  REVENUE_FULL: "/shop/revenue",

  SETTINGS: "settings",
  SETTINGS_FULL: "/shop/settings",

  MY_ACCOUNT: "my-account",
  MY_ACCOUNT_FULL: "/shop/my-account",

  REVIEWS_FULL: "/shop/reviews",
  CHATS: "chats",
  CHATS_FULL: "/shop/chats",
  PROMOTIONS: "promotions",
  PROMOTION_CREATE: "promotions/add",
  PROMOTION_CREATE_FULL: "/shop/promotions/add",
  PROMOTION_UPDATE: "promotions/edit/:id",
  PROMOTION_UPDATE_FULL: "/shop/promotions/edit/:id",
  PROMOTIONS_FULL: "/shop/promotions",
  VOUCHERS: "vouchers",
  VOUCHERS_FULL: "/shop/vouchers",
  
  VOUCHER_CREATE: "vouchers/add",
  VOUCHER_CREATE_FULL: "/shop/vouchers/add",

  VOUCHER_UPDATE: "vouchers/edit/:id",
  VOUCHER_UPDATE_FULL: "/shop/vouchers/edit/:id",
  REPORTS_FULL: "/shop/reports",
  ANALYTICS_FULL: "/shop/analytics",
} as const;
