export const TokenType = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType];
