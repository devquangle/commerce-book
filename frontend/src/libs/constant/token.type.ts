export const TokenType = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType];
