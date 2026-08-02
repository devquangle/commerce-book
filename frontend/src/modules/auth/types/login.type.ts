export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
export interface RefreshTokenRequest {
  refreshToken: string;
}