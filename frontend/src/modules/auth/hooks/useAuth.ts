import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../services/auth.service";
import type { LoginRequest } from "../types/login.type";
import type { UserRequest, ChangePasswordRequest } from "../types/user.type";
import type { RegisterUserRequest, VerifyTokenRequest } from "../types/register-user";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (request: LoginRequest) => AuthService.login(request),
  });
};

export const useGetUserQuery = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => AuthService.getUser(),
    retry: false,
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UserRequest) => AuthService.updateUser(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (request: ChangePasswordRequest) =>
      AuthService.changePassword(request),
  });
};

export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationFn: () => AuthService.refreshToken(),
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (request: RegisterUserRequest) => AuthService.register(request),
  });
};

export const useVerifyRegisterMutation = () => {
  return useMutation({
    mutationFn: (request: VerifyTokenRequest) => AuthService.verifyRegister(request),
  });
};

export const useResendVerificationEmailMutation = () => {
  return useMutation({
    mutationFn: (request: VerifyTokenRequest) => AuthService.resendVerificationEmail(request),
  });
};
