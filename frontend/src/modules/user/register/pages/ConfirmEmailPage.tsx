import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import {
  useVerifyRegisterMutation,
  useResendVerificationEmailMutation,
} from "@/modules/auth/hooks/useAuth";
import { useSearchParams, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";
import { AxiosError } from "axios";
import type { ApiResponse } from "@/libs/utils/api-response";

const ConfirmEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("verifyToken");

  const [error, setError] = useState<string | null>(
    token ? null : "JWT_INVALID",
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  


  const { mutate: verifyMutation, isPending: isPendingVerify } =
    useVerifyRegisterMutation();
  const { mutate: resendMutation, isPending: isPendingResend } =
    useResendVerificationEmailMutation();

  useEffect(() => {
    if (token) {
      verifyMutation(
        { token },
        {
          onSuccess: () => {
            setIsSuccess(true);
            setError(null);
          },
          onError: (err: unknown) => {
            const axiosError = err as AxiosError<ApiResponse<unknown>>;
            const errorCode = axiosError.response?.data?.error || (err as Error).message;
            console.log("=== API Verify Error ===");
            console.log("Full response data:", axiosError.response?.data);
            console.log("Extracted errorCode:", errorCode);
            // Hiển thị JWT_INVALID nếu token hết hạn, hoặc lưu lỗi mặc định
            if (
              errorCode === "JWT_INVALID" ||
          
              errorCode?.toLowerCase().includes("expired") ||
              errorCode?.toLowerCase().includes("invalid")
            ) {
              setError("JWT_INVALID");
            } else if (
              errorCode === "ACCOUNT_ALREADY_VERIFIED" ||
              errorCode?.includes("already verified")
            ) {
              setError("ACCOUNT_ALREADY_VERIFIED");
            } else {
              setError("VERIFY_FAILED");
            }
          },
        },
      );
    }
    // Chỉ chạy lần đầu khi có token
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const redirect = setTimeout(() => {
        navigate("/login");
      }, 3000);

      return () => {
        clearInterval(timer);
        clearTimeout(redirect);
      };
    }
  }, [isSuccess, navigate]);

  const handleResend = () => {
    if (!token) return;
    resendMutation(
      { token },
      {
        onSuccess: () => {
          showSuccessToast(
            "Đã gửi lại email xác thực thành công! Vui lòng kiểm tra hộp thư của bạn.",
          );
        },
        onError: (err: unknown) => {
          const axiosError = err as AxiosError<ApiResponse<unknown>>;
          const errorMessage =
            axiosError.response?.data?.message || (err as Error).message;
          showErrorToast(errorMessage || "Có lỗi xảy ra khi gửi lại email.");
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="w-full max-w-md p-8 space-y-6 card-custom">
        {isSuccess ? (
          <>
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Xác thực thành công
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Email của bạn đã được xác thực thành công. Bạn có thể đăng nhập
              ngay bây giờ.
            </p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 animate-pulse">
              Tự động chuyển hướng sau{" "}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {countdown}s
              </span>
              ...
            </p>
            <div className="pt-4">
              <Button
                onClick={() => navigate("/login")}
                variant="primary"
                fullWidth
                size="lg"
              >
                Đăng nhập ngay
              </Button>
            </div>
          </>
        ) : error === "ACCOUNT_ALREADY_VERIFIED" ? (
          <>
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Tài khoản đã được xác thực
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Tài khoản của bạn đã xác thực, hãy đăng nhập.
            </p>
            <div className="pt-4">
              <Button
                onClick={() => navigate("/login")}
                variant="primary"
                fullWidth
                size="lg"
              >
                Đăng nhập ngay
              </Button>
            </div>
          </>
        ) : error === "JWT_INVALID" ? (
          <>
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Liên kết không hợp lệ
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Liên kết xác thực của bạn đã hết hạn hoặc không hợp lệ. Vui lòng
              yêu cầu gửi lại email xác thực mới để tiếp tục.
            </p>
            <div className="pt-4">
              <Button
                onClick={handleResend}
                variant="primary"
                fullWidth
                size="lg"
                isLoading={isPendingResend}
              >
                Gửi lại email xác thực
              </Button>
            </div>
          </>
        ) : error ? (
          <>
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Xác thực thất bại
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại sau.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center mb-4">
              {isPendingVerify ? (
                <Spinner inline />
              ) : (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Đang xác thực...
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Vui lòng đợi trong giây lát, chúng tôi đang kiểm tra liên kết của
              bạn.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
