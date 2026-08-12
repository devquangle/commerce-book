import { Link, useNavigate } from "react-router-dom";
import { InputField } from "@/components/common/InputField";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/context/useAuth";
import Container from "@/components/common/Container";
import type { LoginRequest } from "@/modules/auth/types/login.type";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { mapServerErrors } from "@/libs/utils/mapServerErrors";
import { showSuccessToast } from "./../../../libs/utils/toastUtil";
import Spinner from "@/components/common/Spinner";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginRequest>();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (requestData: LoginRequest) => {
    setIsLoading(true);
    try {
      const user = await auth.login(requestData);
      showSuccessToast("Đăng nhập thành công!");
      if (user && user.role === "USER") {
        navigate("/home");
      } else if (user && (user.role === "SHOP" || user.role === "STAFF") ) {
        navigate("/shop");
      } else {
        navigate("/admin");
      }
    } catch (error: unknown) {
      mapServerErrors(error, setError);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <Spinner />; 
  }
  return (
    <Container className="px-4 md:px-8">
      <div className=" flex justify-center items-center min-h-[80vh] py-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md  space-y-4"
        >
          <div className="card-custom flex flex-col gap-3">
            {/* Title */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-blue-700">
                Đăng nhập BookStore
              </h1>
              <p className="mt-1 text-sm text-gray-500 py-2">
                Chào mừng bạn trở lại! Vui lòng đăng nhập vào tài khoản của bạn
              </p>
            </div>

            <InputField
              label="Email"
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email không được bỏ trống.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ.",
                },
              })}
              error={errors?.email?.message}
            />
            <InputField
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              id="current-password"
              {...register("password", {
                required: "Mật khẩu không được để trống.",
                // minLength: {
                //   value: 8,
                //   message: "Mật khẩu tối thiểu 8 ký tự."
                // },
                // pattern: {
                //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                //   message: "Phải có: chữ thường, chữ hoa, số, ký tự đặc biệt."
                // }
              })}
              error={errors?.password?.message}
            />

            {/* Login button */}
            <Button
              type="submit"
              className="mt-2 py-3"
              fullWidth
            >
              Đăng nhập
            </Button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <span className="absolute inset-x-0 h-px bg-gray-200"></span>
              <span className="relative bg-white px-3 text-sm text-gray-400">
                Hoặc
              </span>
            </div>

            {/* Google login */}
            <Button
              variant="outline"
              fullWidth
              className="py-3"
              icon={
                <svg
                  className="h-5 w-5 shrink-0"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.7449 12.27C23.7449 11.48 23.6749 10.73 23.5549 10H12.2549V14.51H18.7249C18.4349 15.99 17.5849 17.24 16.3249 18.09V21.09H20.1849C22.4449 19 23.7449 15.92 23.7449 12.27Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12.2549 24C15.4949 24 18.2049 22.92 20.1849 21.09L16.3249 18.09C15.2449 18.81 13.8749 19.25 12.2549 19.25C9.12492 19.25 6.47492 17.14 5.52492 14.29H1.54492V17.38C3.51492 21.3 7.56492 24 12.2549 24Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.52488 14.29C5.27488 13.57 5.14488 12.8 5.14488 12C5.14488 11.2 5.28488 10.43 5.52488 9.71V6.62H1.54488C0.724882 8.24 0.254883 10.06 0.254883 12C0.254883 13.94 0.724882 15.76 1.54488 17.38L5.52488 14.29Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.2549 4.75C14.0249 4.75 15.6049 5.36 16.8549 6.55L20.2749 3.13C18.2049 1.19 15.4949 0 12.2549 0C7.56492 0 3.51492 2.7 1.54492 6.62L5.52492 9.71C6.47492 6.86 9.12492 4.75 12.2549 4.75Z"
                    fill="#EA4335"
                  />
                </svg>
              }
            >
              Continue with Google
            </Button>
            <div className="flex justify-between text-sm mt-4">
              <Link
                to={"/forgot-password"}
                className="text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </Link>

              <span className="text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  to={"/register"}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default LoginPage;
