import Cookies from "js-cookie";
import { TokenType, type TokenTypeValue } from "../constant/token.type";


export const getToken = (type: TokenTypeValue = TokenType.ACCESS_TOKEN): string | undefined => {
  return Cookies.get(type) || undefined;
};

export const setToken = (type: TokenTypeValue, token: string, expiresInDays: number = 7): void => {
  Cookies.set(type, token, { expires: expiresInDays, path: "/" });
};

export const removeToken = (type: TokenTypeValue): void => {
  Cookies.remove(type, { path: "/" });
};

// Aliases for backward compatibility
export const getAuthToken = (): string | undefined => getToken(TokenType.ACCESS_TOKEN);
export const setAuthToken = (token: string, expiresInDays: number = 7): void => setToken(TokenType.ACCESS_TOKEN, token, expiresInDays);
export const removeAuthToken = (): void => removeToken(TokenType.ACCESS_TOKEN);
