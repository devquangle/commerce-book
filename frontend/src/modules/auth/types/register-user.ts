export interface RegisterUserRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyTokenRequest {
  token: string;
}
